export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    // Preflight
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbx3TR-ARo2UdJ8LZCRgGmMH0ByQmWlXq0Qlt7uooEtLA10yxrA1TRFcTrMeJI_s2_sF/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      });

      const text = await response.text();

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(200).send(text);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro no proxy');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
