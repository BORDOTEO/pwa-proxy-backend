const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // Assicurati sia in package.json

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Abilita CORS (puoi specificare solo il tuo dominio se vuoi più sicurezza)
app.use(cors({
  origin: '*', // es: "https://TUA-APP.netlify.app"
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Inserisci qui l'URL corretto del tuo Google Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw33M5QP-aL7xuZemyFVcmuIGGYzOnpVm6Mt8qvWiNK80GTA9vkS-1AOXpbK58p7kZL/exec';

app.post('/api/proxy', async (req, res) => {
  try {
    console.log("📩 Richiesta ricevuta su /api/proxy");
    console.log("📝 Parametri ricevuti:", req.body);

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(req.body),
    });

    const text = await response.text();
    console.log("📨 Risposta dallo script Google:", text);

    try {
      const json = JSON.parse(text);
      console.log("✅ JSON valido ricevuto:", json);
      res.json(json);
    } catch (e) {
      console.warn("⚠️ La risposta non è JSON valido. Invio testo grezzo al client.");
      res.send(text);
    }

  } catch (error) {
    console.error("❌ Errore durante la richiesta al Google Script:", error);
    res.status(500).json({
      errore: 'Errore proxy',
      dettaglio: error.message,
    });
  }
});

// ✅ Avvio server
app.listen(PORT, () => {
  console.log(`🚀 Server avviato sulla porta ${PORT}`);
});
