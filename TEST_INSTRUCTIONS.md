# Testing Name Requirement Feature

## How to Test:

### Test 1: Join via Shared Link (Without Name in URL)
1. Create a new session as facilitator
2. Copy the shared link (e.g., `http://localhost:3000/session/abc12345`)
3. Open the link in a new browser tab/window
4. **Expected**: A prompt will appear asking for your name
5. **Required**: You must enter a name to proceed
6. If you cancel or leave it empty, you'll be redirected to home page
7. Once you enter a name, you'll join the session and your name will appear in the facilitator's participant list

### Test 2: Join via Home Page
1. Go to `http://localhost:3000`
2. Enter your name in the "Your Name" field
3. Enter a session ID
4. Click "Join Existing Session"
5. **Expected**: You'll join and your name will be displayed

### Test 3: Facilitator View
1. As facilitator, start a session
2. Have team members join using the shared link
3. **Expected**: On the left sidebar, you'll see:
   - "Team Members (X)" - shows count
   - List of all participants with their names
   - When they vote, a checkmark (✓) appears next to their name

### Test 4: Validation
1. Try to join with an empty name
2. **Expected**: Error message and redirect to home page

## Current Behavior:
- ✅ Name is **required** when joining via shared link (prompt appears)
- ✅ Name is **required** when joining via home page (validation)
- ✅ Server validates names and rejects empty ones
- ✅ All participant names are displayed in the facilitator's sidebar
- ✅ Participant vote status is shown with checkmarks
