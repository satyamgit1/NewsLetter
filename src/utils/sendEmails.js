// src/utils/sendEmails.js
import nodemailer from 'nodemailer';
import clientPromise from './mongodb';
import cron from 'node-cron';

async function sendDailyEmails() {
  const client = await clientPromise;
  const db = client.db('myDatabase');
  const collection = db.collection('subscribers');
  const subscribers = await collection.find({}).toArray();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  subscribers.forEach((subscriber) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: subscriber.email,
      subject: 'Daily Update',
      text: 'Hello from Developer Side!',
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  });
}

// Schedule the task to run daily at a specific time (e.g., 9:00 AM)
cron.schedule('0 9 * * *', () => {
  sendDailyEmails();
});

export default sendDailyEmails;
