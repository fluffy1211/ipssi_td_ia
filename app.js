import dotenv from 'dotenv';
dotenv.config();

// Vérification de la connexion à Mistral
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

console.log('🔍 Vérification des connexions API...');

// Verification de la connexion a nos providers
async function callProvider(provider) {
    const verbose = process.argv.includes('--verbose');

    const start = Date.now();

    const response = await fetch(provider.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${provider.key}`,
        },
        body: JSON.stringify({
            model: provider.model,
            messages: [{ role: 'user', content: verbose ? 'Donne moi la capitale de la France en un mot' : 'ping' }],
            max_tokens: 5,
        }),
    });

    const data = await response.json();
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
        content: data.choices[0].message.content,
    };
}

const results = await Promise.all(providers.map(callProvider));

// Vérification de la connexion à Pinecone
async function checkPinecone() {
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

const pineconeResult = await checkPinecone();
results.push(pineconeResult);

// Affichage des résultats
async function displayResults(result) {
    const statusEmoji = result.status === 'OK' ? '✅' : '❌';
    console.log(`${statusEmoji} ${result.provider} ${result.latency}ms ${result.provider === 'Pinecone' ? '' : result.content}`);
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

// Liste des modèles disponibles chez Mistral
async function listMistralModels() {
    const response = await fetch('https://api.mistral.ai/v1/models', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
        },
    });

    if (!response.ok) {
        console.error(`Erreur lors de la récupération des modèles Mistral: HTTP ${response.status}`);
        return;
    }

    const data = await response.json();
    console.log(`Modeles disponibles chez Mistral : ${data.data.map(m => m.id).join(', ')}`);
}

await listMistralModels();