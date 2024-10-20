// backend/src/controllers/agoraController.js
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

exports.generateToken = (req, res) => {
  const { channelName, uid } = req.body;
  const appID = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;
  const role = RtcRole.PUBLISHER;

  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);

  res.json({ token });
};
