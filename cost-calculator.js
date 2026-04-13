import Table from 'cli-table3';
import dotenv from 'dotenv';
dotenv.config();

const text = "Le soleil se couchait lentement sur la ville, teintant les toits de nuances orangées. Dans les rues, les passants pressaient le pas, indifférents à cette beauté fugace. Seul un enfant s'arrêta pour lever les yeux.";

function estimateTokens(text) {
    return Math.ceil(text.length / 4);
}

function estimateCost(text, label) {
    const tokens = estimateTokens(text);
    const pricingData = {
        'Mistral Small': 0.20,
        'Groq Llama 3': 0.05,
        'GPT-4o': 2.50,
    };

    const costPerMillionToken = pricingData[label];
    const costPerRequest = (tokens / 1_000_000) * costPerMillionToken;
    const costPer1000Requests = costPerRequest * 1000;

    return {
        perRequest: costPerRequest.toFixed(8),
        per1000Requests: costPer1000Requests.toFixed(8),
    };
}

const t = new Table({
  head: ['Provider', 'Coût estimé (input)', 'Pour 1000 requêtes'],
});

t.push(
  ['Mistral Small', estimateCost(text, 'Mistral Small').perRequest + '€', estimateCost(text, 'Mistral Small').per1000Requests + '€'],
  ['Groq Llama 3',  estimateCost(text, 'Groq Llama 3').perRequest + '€', estimateCost(text, 'Groq Llama 3').per1000Requests + '€'],
  ['GPT-4o', estimateCost(text, 'GPT-4o').perRequest + '€', estimateCost(text, 'GPT-4o').per1000Requests + '€'],
);

console.log(t.toString());