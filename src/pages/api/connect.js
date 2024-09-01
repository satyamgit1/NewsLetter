// src/pages/api/connect.js
import clientPromise from '../../utils/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('myDatabase');

    const data = await db.collection('myCollection').find({}).toArray();
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: 'Unable to fetch data' });
  }
}
