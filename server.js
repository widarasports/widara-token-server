const express = require('express');
const { AccessToken } = require('livekit-server-sdk');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

app.get('/get-token', (req, res) => {
  try {
    const roomName = req.query.room || 'widara-radio-room';
    const participantName = req.query.name || 'DJ';

    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      { identity: participantName }
    );

    at.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: true });
    res.json({ token: at.toJwt() });
  } catch (error) {
    res.status(500).json({ error: "Imeshindwa kutengeneza token" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server inakimbia`);
});
