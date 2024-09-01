import clientPromise from '../../utils/mongodb';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;

    // Define the transporter here
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Define the mail options here
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome!',
      text: 'Thank you for subscribing! Hello from Developer Side!',
    };

    console.log('Starting to send email...');
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Subscription successful, but failed to send email' });
      } else {
        console.log('Email sent:', info.response);

        // Save to the database after the email is successfully sent
        const client = await clientPromise;
        const db = client.db('myDatabase');
        const collection = db.collection('subscribers');

        await collection.insertOne({ email });

        return res.status(200).json({ message: 'Subscribed and email sent successfully!' });
      }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
