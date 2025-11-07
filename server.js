const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://planning-poker.onrender.com', 'https://*.onrender.com']
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

// Store active sessions
const sessions = new Map();

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/session/:sessionId', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'session.html'));
});

// API to create a new session
app.post('/api/create-session', (req, res) => {
  const sessionId = uuidv4().substring(0, 8);
  const { facilitatorName } = req.body;
  
  sessions.set(sessionId, {
    id: sessionId,
    facilitator: facilitatorName,
    participants: [],
    currentStory: null,
    votes: new Map(),
    votingActive: false,
    timerDuration: 15, // default 15 seconds
    timerStart: null,
    history: [] // Store past estimations
  });
  
  res.json({ sessionId, url: `${req.protocol}://${req.get('host')}/session/${sessionId}` });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-session', ({ sessionId, userName, isFacilitator }) => {
    const session = sessions.get(sessionId);
    
    if (!session) {
      socket.emit('error', { message: 'Session not found' });
      return;
    }
    
    // Validate userName
    if (!userName || userName.trim() === '') {
      socket.emit('error', { message: 'Name is required to join the session' });
      return;
    }
    
    socket.join(sessionId);
    socket.sessionId = sessionId;
    socket.userName = userName.trim();
    socket.isFacilitator = isFacilitator;
    
    if (!isFacilitator) {
      session.participants.push({
        id: socket.id,
        name: userName.trim(),
        connected: true
      });
    }
    
    // Send current session state to the user
    socket.emit('session-state', {
      sessionId: session.id,
      facilitator: session.facilitator,
      participants: session.participants,
      currentStory: session.currentStory,
      votingActive: session.votingActive,
      isFacilitator: socket.isFacilitator,
      history: session.history
    });
    
    // Notify others about new participant
    io.to(sessionId).emit('participant-joined', {
      participants: session.participants
    });
  });
  
  socket.on('start-voting', ({ sessionId, storyName, timerDuration }) => {
    const session = sessions.get(sessionId);
    
    if (!session || !socket.isFacilitator) {
      return;
    }
    
    session.currentStory = storyName;
    session.votingActive = true;
    session.votes.clear();
    session.timerDuration = timerDuration || 15;
    session.timerStart = Date.now();
    
    io.to(sessionId).emit('voting-started', {
      storyName,
      timerDuration: session.timerDuration,
      timerStart: session.timerStart
    });
  });
  
  socket.on('submit-vote', ({ sessionId, vote }) => {
    const session = sessions.get(sessionId);
    
    if (!session || !session.votingActive) {
      return;
    }
    
    session.votes.set(socket.id, {
      userName: socket.userName,
      vote: vote,
      timestamp: Date.now()
    });
    
    // Notify facilitator of vote submission (without revealing the vote)
    const votes = Array.from(session.votes.values()).map(v => ({
      userName: v.userName,
      voted: true
    }));
    
    io.to(sessionId).emit('votes-update', {
      votes,
      totalParticipants: session.participants.length,
      votedCount: session.votes.size
    });
    
    // Auto-reveal if everyone has voted
    if (session.votes.size === session.participants.length && session.participants.length > 0) {
      session.votingActive = false;
      
      const allVotes = Array.from(session.votes.values()).map(v => ({
        userName: v.userName,
        vote: v.vote
      }));
      
      io.to(sessionId).emit('votes-revealed', {
        votes: allVotes,
        autoRevealed: true
      });
    }
  });
  
  socket.on('reveal-votes', ({ sessionId }) => {
    const session = sessions.get(sessionId);
    
    if (!session || !socket.isFacilitator) {
      return;
    }
    
    session.votingActive = false;
    
    const votes = Array.from(session.votes.values()).map(v => ({
      userName: v.userName,
      vote: v.vote
    }));
    
    io.to(sessionId).emit('votes-revealed', {
      votes
    });
  });
  
  socket.on('end-voting', ({ sessionId }) => {
    const session = sessions.get(sessionId);
    
    if (!session || !socket.isFacilitator) {
      return;
    }
    
    // Save to history if there was an active story with votes
    if (session.currentStory && session.votes.size > 0) {
      const votes = Array.from(session.votes.values()).map(v => ({
        userName: v.userName,
        vote: v.vote
      }));
      
      // Calculate statistics
      const numericVotes = votes.map(v => v.vote).filter(v => v !== '?').map(Number);
      let stats = null;
      if (numericVotes.length > 0) {
        const avg = (numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length).toFixed(1);
        const min = Math.min(...numericVotes);
        const max = Math.max(...numericVotes);
        stats = { average: avg, min, max };
      }
      
      session.history.push({
        storyName: session.currentStory,
        votes: votes,
        statistics: stats,
        timestamp: Date.now(),
        completedAt: new Date().toISOString()
      });
    }
    
    session.votingActive = false;
    session.currentStory = null;
    session.votes.clear();
    
    io.to(sessionId).emit('voting-ended', {
      history: session.history
    });
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    if (socket.sessionId) {
      const session = sessions.get(socket.sessionId);
      
      if (session) {
        // Remove participant from session
        session.participants = session.participants.filter(p => p.id !== socket.id);
        session.votes.delete(socket.id);
        
        io.to(socket.sessionId).emit('participant-left', {
          participants: session.participants
        });
        
        // If facilitator left, clean up session
        if (socket.isFacilitator) {
          io.to(socket.sessionId).emit('session-ended', {
            message: 'The facilitator has left the session'
          });
          sessions.delete(socket.sessionId);
        }
      }
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
