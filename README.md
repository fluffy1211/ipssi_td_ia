# Node.js AI Provider Comparison Tool

A comprehensive Node.js application for comparing, testing, and monitoring multiple AI language model providers. This tool provides cost estimation, latency testing, stress testing, and unified API endpoints for querying different LLM services.

## Features

- ✅ **Multi-Provider Support** - Test and compare Mistral, Groq, Hugging Face, and more
- 💰 **Cost Calculator** - Estimate API costs for different providers
- ⚡ **Latency Testing** - Monitor response times and provider health
- 🔄 **Stress Testing** - Run performance tests with multiple prompts
- 🔍 **Provider Comparison** - Side-by-side evaluation of different models
- 🌐 **REST API** - Express server with endpoints for health checks and queries
- 📊 **Vector Database Integration** - Pinecone connectivity checks

## Supported AI Providers

- **Mistral** - mistral-small-latest
- **Groq** - llama-3.3-70b-versatile
- **Hugging Face** - meta-llama/Llama-3.1-8B-Instruct
- **OpenAI** - GPT-4o (optional)

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd nodejs_ia
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your API keys:
```env
MISTRAL_API_KEY=your_mistral_api_key
GROQ_API_KEY=your_groq_api_key
HUGGINGFACE_TOKEN=your_huggingface_token
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=your_pinecone_index
```

## Quick Start

### Development Server

Start the Express server with hot-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

### API Endpoints

#### Health Check
Check the status and latency of all providers and Pinecone:
```bash
curl http://localhost:3000/check
```

Response:
```json
[
  {
    "provider": "mistral",
    "status": "OK",
    "latency": 1250
  },
  {
    "provider": "groq",
    "status": "OK",
    "latency": 580
  }
]
```

#### Ask a Question
Query a specific provider:
```bash
curl "http://localhost:3000/ask?q=What%20is%20AI?&provider=Mistral"
```

Query parameters:
- `q` - The question/prompt (required)
- `provider` - Provider name: Mistral, Groq, or HuggingFace (required)

## Available Scripts

### `app.js` - Provider Configuration
Defines provider configurations and tests connectivity to the Mistral API.

### `server.js` - Express Server
Main REST server with health checks and query endpoints.

### `comparateur.js` - Provider Comparison
Side-by-side comparison of different providers with multiple prompts:
- Translation tasks
- Text summarization
- Code generation
- Creative writing

Run:
```bash
node comparateur.js
```

### `stresstest.js` - Performance Testing
Runs stress tests against providers to measure performance under load.

Run:
```bash
node stresstest.js
```

### `cost-calculator.js` - Cost Estimation
Calculates and displays estimated costs for each provider based on token usage.

Run:
```bash
node cost-calculator.js
```

### `prompt-lab.js` - Prompt Testing
Interactive prompt laboratory for testing different prompts across providers.

### `utils.js` - Utility Functions
Shared utility functions including:
- `checkProvider()` - Provider connectivity and latency testing
- `checkPinecone()` - Vector database integration check
- `estimateCostData()` - Cost calculation
- `getProviderConfig()` - Provider configuration retrieval

## Project Structure

```
.
├── README.md                 # This file
├── package.json              # Project dependencies
├── app.js                    # Provider configuration & setup
├── server.js                 # Express REST server
├── comparateur.js            # Provider comparison tool
├── stresstest.js             # Performance testing
├── cost-calculator.js        # Cost estimation
├── prompt-lab.js             # Prompt experimentation
├── utils.js                  # Shared utilities
└── .env                      # Configuration (not in repo)
```

## Development

### Scripts

```bash
# Start development server with hot-reload
npm run dev

# Run comparison test
node comparateur.js

# Run stress test
node stresstest.js

# Run cost calculator
node cost-calculator.js
```

### Dependencies

- **express** ^5.2.1 - Web framework
- **dotenv** ^17.4.2 - Environment variable management
- **cli-table3** ^0.6.5 - Terminal table formatting
- **nodemon** ^3.1.14 - Auto-reload for development

## Configuration

### Environment Variables

| Variable | Description |
|----------|-------------|
| `MISTRAL_API_KEY` | Mistral API key |
| `GROQ_API_KEY` | Groq API key |
| `HUGGINGFACE_TOKEN` | Hugging Face API token |
| `OPENAI_API_KEY` | OpenAI API key (optional) |
| `PINECONE_API_KEY` | Pinecone API key |
| `PINECONE_INDEX` | Pinecone index name |

## Use Cases

- **Cost Optimization** - Find the most cost-effective provider for your use case
- **Performance Comparison** - Benchmark latency across different providers
- **Model Testing** - Test multiple models with the same prompts
- **Stress Testing** - Evaluate provider reliability under load
- **Production Monitoring** - Health checks and status monitoring via API

## License

ISC

## Author

Gabriel
