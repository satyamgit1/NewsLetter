import clientPromise from '../../utils/mongodb';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome!',
      text: 'Thank you for subscribing! Hello from Developer Side!',
    };

    try {
      console.log('Starting to send email...');
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully.');

      const client = await clientPromise;
      const db = client.db('myDatabase');
      const collection = db.collection('subscribers');

      await collection.insertOne({ email });
      console.log('Subscription saved to MongoDB.');

      return res.status(200).json({ message: 'Subscribed and email sent successfully!' });
    } catch (error) {
      console.error('Error:', error.message);
      return res.status(500).json({ message: 'Subscription failed.', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
