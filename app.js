import dotenv from 'dotenv';
dotenv.config();

export async function checkMistral() {
    const start = Date.now();

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'mistral-small-latest',
            messages: [{ role: 'user', content: 'ping' }],
            max_tokens: 5,
        }),
    });

    const latency = Date.now() - start;

    if (!response.ok) {
        return {
            provider: 'mistral',
            status: 'ERROR',
            latency,
            error: `HTTP ${response.status}}`,
        };
    }

    return {
        provider: 'mistral',
        status: 'OK',
        latency,
    };
}

const results = await checkMistral();
console.log(results);