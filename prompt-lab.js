import Table from 'cli-table3';
import dotenv from 'dotenv';
dotenv.config();

// Definition de nos providers
const providers = [
    {
        name: 'Mistral',
        url: 'https://api.mistral.ai/v1/chat/completions',
        key: process.env.MISTRAL_API_KEY,
        model: 'mistral-small-latest',
    },
    {
        name: 'Groq',
        url: 'https://api.groq.com/openai/v1/chat/completions',
        key: process.env.GROQ_API_KEY,
        model: 'llama-3.3-70b-versatile',
    },
    {
        name: 'Hugging Face',
        url: 'https://router.huggingface.co/v1/chat/completions',
        key: process.env.HUGGINGFACE_TOKEN,
        model: 'meta-llama/Llama-3.1-8B-Instruct',
    }
]

console.log('🔍 Test des réponses selon la température...\n');

const temperatures = [0.0, 0.5, 1.0];
const prompt = 'Que penses tu de Emmanuel Macron ?';

// Verification de la connexion a nos providers
async function callProvider(provider, temperature) {
    const start = Date.now();

    const response = await fetch(provider.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${provider.key}`,
        },
        body: JSON.stringify({
            model: provider.model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 150,
            temperature: temperature,
        }),
    });

    const data = await response.json();
    const latency = Date.now() - start;

    if (!response.ok) {
        return {
            provider: provider.name,
            temperature,
            status: 'ERROR',
            latency,
            error: `HTTP ${response.status}`,
        };
    }

    return {
        provider: provider.name,
        temperature,
        status: 'OK',
        latency,
        content: data.choices[0].message.content,
    };
}

const tasks = providers.flatMap(provider =>
    temperatures.map(temp => callProvider(provider, temp))
);

const results = await Promise.all(tasks);

// Affichage des résultats (Model puis temp puis reponse sous forme de table)
const table = new Table({
    head: ['Provider', 'Temperature', 'Response'],
    colWidths: [15, 15, 150],
});

results.forEach(result => {
    table.push([
        result.provider,
        result.temperature,
        result.status === 'OK' ? result.content : result.error,
    ]);
});

console.log(table.toString());