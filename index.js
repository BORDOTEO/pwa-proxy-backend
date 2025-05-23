const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// 🌐 Inserisci qui l’URL PUBBLICATO del tuo Google Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxXv4xIiyR-hMKUANbK3lguJr3FIhHhPmjiWulKO6Ur18ARYluyYm9eYtIPgJV9jWe2YQ/exec';

// ✅ Middleware
app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ API di proxy
app.post('/api/proxy', async (req, res) => {
  console.log("📩 Richiesta ricevuta su /api/proxy");
  console.log("📝 Parametri ricevuti:", req.body);

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(req.body),
    });

    const rawText = await response.text();

    // Prova a interpretare la risposta come JSON
    try {
      const json = JSON.parse(rawText);
      console.log("✅ JSON valido ricevuto:", json);
      return res.json(json);
    } catch (parseError) {
      // 🔴 Se la risposta non è JSON (probabile errore HTML)
      console.warn("⚠️ Risposta non JSON. Forse errore HTML dallo script.");
      console.warn("⛔ Contenuto ricevuto:", rawText.slice(0, 300)); // Mostra max 300 char
      return res.status(500).json({
        errore: "La risposta non è in formato JSON.",
        dettaglio: "Possibile errore nello script Google Apps.",
        contenuto: rawText,
      });
    }

  } catch (err) {
    console.error("❌ Errore nella richiesta al Google Apps Script:", err);
    return res.status(500).json({
      errore: 'Errore di connessione al Google Script',
      dettaglio: err.message,
    });
  }
});

// 🚀 Avvia server
app.listen(PORT, () => {
  console.log(`✅ Server avviato su http://localhost:${PORT}`);
});
