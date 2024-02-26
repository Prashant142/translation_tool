const express = require('express');
const translate_text = require("./translate");

const app = express();
const port = 8080;

app.use(express.json()); 

app.post('/translate', async (req, res) => {
    try {
        if (!req.body || !req.body.text) {
            return res.status(400).json({ error: "Missing 'text' field in request body" });
        }

        const { text } = req.body;
        
        if (typeof text !== 'string' || text.trim() === '') {
            return res.status(400).json({ error: "'text' field must be a non-empty string" });
        }
        const translatedText = await translate_text(text);

        res.status(200).json({ translation: translatedText });
    } catch (error) {
        console.error(error);
        if (error instanceof TranslateError) {
            return res.status(400).json({ error: "Translation error: " + error.message });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
