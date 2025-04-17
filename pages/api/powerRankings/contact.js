export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
  
    const { name, email, message } = req.body;
  
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing fields' });
    }
  
    // In a real app, you'd store this or email it.
    console.log('New Contact Message:', { name, email, message });
  
    return res.status(200).json({ success: true });
  }
  