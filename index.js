const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // assicurati che sia installato in dependencies

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Abilita CORS (puoi specificare l’origine se vuoi)
app.use(cors({
  origin: '*'
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Inserisci qui il tuo URL dello script Google Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxpebaft0_N3rghw7ajNkjf2tqDVh9JRlzy5o4hBkTuWbKetDDXrsAtiy092HEvS2pJ/exec';

app.post('/api/proxy', async (req, res) => {
  console.log('✅ Richiesta ricevuta su /api/proxy');
  console.log('📝 Parametri ricevuti:', req.body);

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(req.body),
    });

    const text = await response.text();
    console.log('📩 Risposta dallo script Google:', text);

    try {
      const json = JSON.parse(text);
      console.log('✅ JSON valido ricevuto:', json);
      res.json(json);
    } catch (jsonError) {
      console.warn('⚠️ La risposta NON è JSON valido. Invio come testo.');
      res.send(text);
    }

  } catch (error) {
    console.error('❌ Errore durante la fetch verso lo script Google:', error);
    res.status(500).json({ errore: 'Errore proxy', dettaglio: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server avviato sulla porta ${PORT}`);
});
