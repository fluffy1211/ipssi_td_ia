import Table from 'cli-table3';
import dotenv from 'dotenv';
dotenv.config();

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



async function callProvider(provider, prompt) {

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
            max_tokens: 200,
            temperature: 0.3,
        }),
    });

    const data = await response.json();
    const latency = Date.now() - start;

    if (!response.ok) {
        return {
            provider: provider.name,
            status: 'ERROR',
            error: `HTTP ${response.status}`,
            latency,
            prompt
        };
    }

    return {
        provider: provider.name,
        status: 'OK',
        content: data.choices[0].message.content.trim(),
        latency,
        prompt
    };
}

async function stressTest(provider, n = 10) {
    const tasks = [];

    for (let i = 0; i < n; i++) {
        tasks.push(callProvider(provider, `ping ${i + 1}`));
    }

    const results = await Promise.all(tasks);

    const table = new Table({
        head: ['Provider', 'Latency (ms)', 'Response', 'Prompt'],
        colWidths: [20, 15, 70, 70],
    });

    results.forEach(result => {
        table.push([
            result.provider,
            result.latency,
            result.content,
            result.prompt
        ]);
    });

    console.log(table.toString());
}

// Tester tous les providers
providers.forEach(provider => {
    console.log(`\n🚀 Stress test for ${provider.name}...`);
    stressTest(provider, 30);
});