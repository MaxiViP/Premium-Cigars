import Twilio from 'twilio';
const client = Twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendVerifyCode(phone){
  return client.verify.services(process.env.TWILIO_SERVICE_SID).verifications.create({ to: phone, channel: 'sms' });
}
export async function checkVerifyCode(phone, code){
  const res = await client.verify.services(process.env.TWILIO_SERVICE_SID).verificationChecks.create({ to: phone, code });
  return res.status === 'approved';
}
