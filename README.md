# Planning Poker - Agile Scrum Estimation Tool

A real-time planning poker application for agile scrum teams to estimate story points collaboratively.

## Features

- 🎯 **Real-time Voting**: All team members vote simultaneously
- ⏱️ **Timed Voting**: Set time limits for each story estimation
- 🔗 **Easy Sharing**: Generate shareable links for team members to join
- 📊 **Live Results**: Facilitator sees who has voted and can reveal results
- 📈 **Statistics**: Automatic calculation of average, min, and max votes
- 🎴 **Fibonacci Sequence**: Standard planning poker cards (0, 1, 2, 3, 5, 8, 13, 21, ?)
- 👥 **Team Tracking**: See all connected participants and their voting status

## Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd planning-poker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Usage

### Starting the Server

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will start at `http://localhost:3000`

### Creating a Planning Session

1. Open your browser and go to `http://localhost:3000`
2. Enter your name as the facilitator
3. Click "Start New Planning Session"
4. Copy the generated session link and share it with your team

### Joining a Session

Team members can join in two ways:

1. **Via shared link**: Click the link shared by the facilitator
2. **Manual join**: Go to homepage, enter their name and the session ID

### Running a Planning Session

**As Facilitator:**
1. Enter the story/ticket name (e.g., "USER-123: Add login feature")
2. Set the time limit (default 60 seconds)
3. Click "Start Voting"
4. Watch as team members submit their votes
5. When all votes are in or timer expires, results are automatically revealed
6. View statistics (average, min, max) and individual votes
7. Click "New Story" to estimate the next item

**As Team Member:**
1. Wait for the facilitator to start voting
2. Read the story description
3. Select your estimate from the cards (0, 1, 2, 3, 5, 8, 13, 21, or ?)
4. Your vote is submitted automatically
5. Wait for results to be revealed

## Technical Details

### Built With
- **Backend**: Node.js, Express, Socket.IO
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Real-time Communication**: WebSockets via Socket.IO

### Architecture
- Real-time bidirectional communication using Socket.IO
- Session-based architecture with unique session IDs
- In-memory session storage (sessions are lost on server restart)
- Responsive design for mobile and desktop

### Key Features Implementation

**Timer System:**
- Countdown timer synchronized across all clients
- Visual warnings at 30 seconds (orange) and 10 seconds (red)
- Auto-reveal when time expires

**Voting System:**
- Anonymous voting until reveal
- Real-time vote tracking for facilitator
- Prevent voting after time expires

**Session Management:**
- Unique 8-character session IDs
- Automatic cleanup when facilitator leaves
- Participant reconnection handling

## Deployment

### Production Deployment

For production, you may want to:

1. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name planning-poker
   ```

2. Set the PORT environment variable:
   ```bash
   PORT=8080 npm start
   ```

3. Use a reverse proxy (nginx/Apache) for SSL/TLS

### Deploying to Cloud Platforms

**Heroku:**
```bash
heroku create your-planning-poker
git push heroku main
```

**Azure/AWS:**
- Ensure `PORT` environment variable is properly configured
- The app listens on `process.env.PORT || 3000`

## Customization

### Changing Vote Values

Edit the voting cards in `public/session.html`:
```html
<div class="card" onclick="selectVote('0')">0</div>
<!-- Add or modify cards here -->
```

### Adjusting Timer Defaults

Change the default timer in `public/session.html`:
```html
<input type="number" id="timerDuration" value="60" min="10" max="300">
```

### Styling

All styles are contained in the `<style>` tags in:
- `public/index.html` - Home page
- `public/session.html` - Session page

## Limitations

- Sessions are stored in memory and will be lost on server restart
- No authentication or user management
- No persistent history of past sessions
- Limited to one session per session ID

## Future Enhancements

- Database persistence for session history
- User authentication and team management
- Export results to CSV/JSON
- Multiple voting rounds per story
- Custom card values
- Story description and acceptance criteria display
- Integration with Jira/Azure DevOps

## Troubleshooting

**Port already in use:**
```bash
PORT=3001 npm start
```

**Connection issues:**
- Check firewall settings
- Ensure WebSocket connections are allowed
- Verify the server is running

**Session not found:**
- Sessions expire when the facilitator disconnects
- Check that the session ID is correct

## License

MIT

## Support

For issues or questions, please create an issue in the repository.

---

Happy Estimating! 🃏
