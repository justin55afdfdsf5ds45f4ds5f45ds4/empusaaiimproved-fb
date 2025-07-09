import type { NextApiRequest, NextApiResponse } from 'next';
import { uploadImageBase64 } from '../../lib/cloudinary';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { base64 } = req.body;
  if (!base64) return res.status(400).json({ error: 'Missing image data' });

  try {
    const result = await uploadImageBase64(base64);
    res.status(200).json(result); // { url, public_id }
  } catch (error) {
    res.status(500).json({ error: 'Cloudinary upload failed' });
  }
}