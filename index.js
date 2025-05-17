const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // se non presente, aggiungilo in dependencies

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Abilita CORS per Netlify (frontend)
app.use(cors({
  origin: '*', // oppure: "https://TUOSITO.netlify.app"
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ URL del tuo Google Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxpebaft0_N3rghw7ajNkjf2tqDVh9JRlzy5o4hBkTuWbKetDDXrsAtiy092HEvS2pJ/exec';

app.post('/api/proxy', async (req, res) => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(req.body),
    });

    const text = await response.text();

    try {
      const json = JSON.parse(text);
      res.json(json);
    } catch (e) {
      // fallback: restituisci comunque il testo (es. errore HTML o stringa normale)
      res.send(text);
    }

  } catch (error) {
    console.error('Errore nel proxy:', error);
    res.status(500).json({ errore: 'Errore proxy', dettaglio: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
