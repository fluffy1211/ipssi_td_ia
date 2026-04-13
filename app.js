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
            error: `HTTP ${response.status}`,
        };
    }

    return {
        provider: 'mistral',
        status: 'OK',
        latency,
    };
}

const mistralResults = await checkMistral();
console.log(mistralResults);

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

console.log('🔍 Vérification des connexions API...');

async function callProvider(provider) {
    const start = Date.now();

    const response = await fetch(provider.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${provider.key}`,
        },
        body: JSON.stringify({
            model: provider.model,
            messages: [{ role: 'user', content: 'ping' }],
            max_tokens: 5,
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

    return {
        provider: provider.name,
        status: 'OK',
        latency,
    };
}

const results = await Promise.all(providers.map(callProvider));

async function displayResults(result) {
    const statusEmoji = result.status === 'OK' ? '✅' : '❌';
    console.log(`${statusEmoji} ${result.provider} ${result.latency}ms`);
    if (result.error) {
        console.log(`   Error: ${result.error}`);
    }
}

results.forEach(displayResults);

const successCount = results.filter(r => r.status === 'OK').length;
console.log(`${successCount}/${results.length} connexions actives`);
if (successCount === results.length) {
    console.log('Tout est vert. Vous êtes prêts pour la suite !');
} else {
    console.log('Certaines connexions ont échoué. Vérifiez les erreurs ci-dessus et corrigez-les avant de continuer.');
}