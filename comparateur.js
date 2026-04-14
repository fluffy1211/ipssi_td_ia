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

const prompts = [{
    traduction: 'Traduire en anglais : "The cat is sleeping on the Sofa."',
    resume: 'Résumer ce paragraphe en une phrase : "L\'intelligence artificielle (IA) est un domaine de l\'informatique qui vise à créer des machines capables de simuler l\'intelligence humaine. Elle englobe des techniques telles que l\'apprentissage automatique, le traitement du langage naturel et la vision par ordinateur. L\'IA a le potentiel de transformer de nombreux secteurs, de la santé à la finance, en automatisant des tâches complexes et en fournissant des insights précieux."',
    code: 'Ecrire une fonction JS qui inverse une chaîne de caractères',
    creatif: 'Une metaphore originale pour expliquer un LLM',
    factuel: 'Qui a invente le Transformer en 2017 ?',
}]

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

async function compareSameModel(prompt) {
    const tasks = providers.slice(1).map(provider => callProvider(provider, prompt));
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

// Exemple d'utilisation
compareSameModel(prompts[0].traduction);

const tasks = prompts.flatMap(p => providers.map(provider => callProvider(provider, p.traduction)));

const results = await Promise.all(tasks);

const table = new Table({
    head: ['Provider', 'Status', 'Response'],
    colWidths: [20, 10, 70],
});

results.forEach(result => {
    table.push([
        result.provider,
        result.status,
        result.status === 'OK' ? result.content : result.error,
    ]);
});

console.log(table.toString());