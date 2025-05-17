const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔁 Sostituisci con il tuo URL Google Apps Script:
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/TUO_SCRIPT_ID/exec';

app.use(cors({
  origin: 'https://6828fffeb83131a407238bd8--tubular-dragon-c806bc.netlify.app/',
  methods: ['POST']
}));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/proxy', async (req, res) => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(req.body)
    });
    const text = await response.text();
    res.setHeader('Content-Type', 'application/json');
    res.send(text);
  } catch (error) {
    console.error('Errore proxy:', error);
    res.status(500).json({ errore: 'Errore nel proxy.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
