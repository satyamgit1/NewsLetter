// src/pages/api/trigger-email.js (Optional for manual trigger)
import sendDailyEmails from '../../utils/sendEmails';

export default async function handler(req, res) {
  await sendDailyEmails();
  res.status(200).json({ message: 'Emails sent' });
}
