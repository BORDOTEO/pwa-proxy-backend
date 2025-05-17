const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({
  origin: '*' // ⚠️ Sviluppo: per produzione è meglio specificare l'origine esatta (es: 'https://tuo-dominio.netlify.app')
}));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.post('/api/proxy', (req, res) => {
  // Qui puoi fare il forwarding a Google Sheets, validazioni, ecc.
  res.json({ messaggio: 'Richiesta ricevuta dal proxy!' });
});

app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
