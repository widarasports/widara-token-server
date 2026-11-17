const express = require('express');
const { AccessToken } = require('livekit-server-sdk');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

app.get('/get-token', async (req, res) => {
  try {
    const roomName = req.query.room || 'widara-radio-room';
    const participantName = req.query.name || 'DJ';

    // Hakikisha API Key na Secret zinasomwa
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return res.status(500).json({ error: "API Key au Secret haipo kwenye server." });
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
    });

    at.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: true });

    // TUMIA await KWA SABABU toJwt() ni ASYNC kwenye version mpya
    const token = await at.toJwt();
    
    res.json({ token: token });
  } catch (error) {
    console.error("Kosa kutengeneza token:", error);
    res.status(500).json({ error: "Imeshindwa kutengeneza token" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server inakimbia kwenye port ${PORT}`);
});
