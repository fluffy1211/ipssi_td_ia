import dotenv from 'dotenv';
dotenv.config();

// FICHIER UTILITAIRE POUR CENTRALISER LES FONCTIONS COMMUNES

export const providers = [
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
    },
];

export function getProviderConfig(providerName) {
    return providers.find(provider => provider.name.toLowerCase() === providerName.toLowerCase());
}

export function estimateTokens(text) {
    return Math.ceil(text.length / 4);
}

export function estimateCostData(text) {
    const tokens = estimateTokens(text);
    const pricingData = [
        { provider: 'Mistral Small', costPerMillionTokens: 0.20 },
        { provider: 'Groq Llama 3', costPerMillionTokens: 0.05 },
        { provider: 'GPT-4o', costPerMillionTokens: 2.50 },
    ];

    return pricingData.map(entry => ({
        provider: entry.provider,
        tokens,
        estimatedCost: `${((tokens / 1_000_000) * entry.costPerMillionTokens).toFixed(8)}€`,
    }));
}

export async function checkProvider(provider, prompt = 'ping') {
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
        }),
    });

    const latency = Date.now() - start;

    if (!response.ok) {
        return {
            provider: provider.name,
            status: 'ERROR',
            latency,
            error: `HTTP ${response.status}`,
        };
    }

    const data = await response.json();

    return {
        provider: provider.name,
        status: 'OK',
        latency,
        response: data.choices[0].message.content,
    };
}

export async function checkPinecone() {
    const start = Date.now();

    const response = await fetch('https://api.pinecone.io/indexes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Api-Key': process.env.PINECONE_API_KEY,
            'X-Pinecone-API-Version': '2024-07',
        },
    });

    const latency = Date.now() - start;

    if (!response.ok) {
        return {
            provider: 'Pinecone',
            status: 'ERROR',
            latency,
            error: `HTTP ${response.status}`,
        };
    }

    return {
        provider: 'Pinecone',
        status: 'OK',
        latency,
    };
}