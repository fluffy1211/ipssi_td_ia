import express from 'express';
import { checkPinecone, checkProvider, estimateCostData, getProviderConfig, providers } from './utils.js';

const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Endpoint pour vérifier les providers et Pinecone
app.get('/check', async (req, res) => {
    try {
        const results = await Promise.all([
            ...providers.map(provider => checkProvider(provider)),
            checkPinecone(),
        ]);

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while running the checks.' });
    }
});

// Endpoint pour poser une question à un provider spécifique
app.get('/ask', async (req, res) => {
    const { q, provider } = req.query;

    if (!q || !provider) {
        return res.status(400).json({ error: 'Missing query parameters. Usage: /ask?q=your+question&provider=providerName' });
    }

    try {
        const providerConfig = getProviderConfig(provider);

        if (!providerConfig) {
            return res.status(404).json({ error: `Unknown provider: ${provider}` });
        }

        const result = await checkProvider(providerConfig, q);

        if (result.status !== 'OK') {
            return res.status(502).json({ provider: result.provider, error: result.error });
        }

        res.json({ provider: result.provider, response: result.response });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

// Endpoint pour estimer le coût d'un texte
app.get('/cost', (req, res) => {
    const { text } = req.query;

    if (!text) {
        return res.status(400).json({ error: 'Missing query parameter. Usage: /cost?text=your+text' });
    }

    res.json(estimateCostData(text));
});