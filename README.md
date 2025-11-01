# Trading Bot Server

A high-performance Model Context Protocol (MCP) server for cryptocurrency trading automation, built with Bun. This project provides real-time market data gathering, technical analysis, and automated trade execution capabilities for multiple cryptocurrency assets.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [Debug Mode with Inspector](#debug-mode-with-inspector)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [Architecture](#architecture)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)

## Features

- **Real-time Market Data**: Fetch live market prices and historical data for cryptocurrency assets
- **Technical Analysis**: Compute technical indicators (RSI, MACD, Bollinger Bands, etc.) across multiple timeframes
- **Automated Trading**: Execute LONG, SHORT, HOLD, and CLOSE_ALL trading actions with configurable confidence levels
- **Multi-Asset Support**: Trade across BTC, ETH, SOL, and HYPE (extensible to other symbols)
- **Position Tracking**: Monitor and retrieve open trading positions
- **LLM Integration**: Leverage AI models for intelligent trade analysis and decision-making
- **High Performance**: Built on Bun runtime for 3x faster performance than Node.js

## Prerequisites

### Required

- **Bun v1.3.1 or higher** - [Install Bun](https://bun.com)
- **Private API Key** - Required for accessing trading and market data APIs (see [Configuration](#configuration))
- **Node.js compatibility** - Bun provides 100% Node.js API compatibility

### Optional

- **MCP Inspector** - For debugging and monitoring server behavior
- **API credentials** - For your trading platform (Binance, Kraken, etc.)

## Installation

### Step 1: Clone or Create Project

```bash
# If starting fresh
bun init trading-bot-server
cd trading-bot-server

# Or clone existing project
git clone <your-repo-url>
cd trading-bot-server
```

### Step 2: Install Dependencies

```bash
bun install
```

This will install all dependencies defined in your `package.json`, including:
- MCP protocol dependencies
- Market data clients
- Trading execution libraries
- Analysis tools

## Configuration

### Setting Up Environment Variables

Create a `.env` file in the project root directory with the following required variables:

```bash
# CRITICAL: Required for all operations
PRIVATE_API_KEY=your_private_api_key_here
EXCHANGE_API_KEY=your_exchange_api_key
EXCHANGE_SECRET_KEY=your_exchange_secret_key

# Optional: Server Configuration
SERVER_PORT=3000
LOG_LEVEL=info
TRADING_MODE=simulation
```

### Obtaining Your Private API Key

1. **Log in** to your trading platform account
2. **Navigate** to Settings â†’ API Management or Security
3. **Create a new API key** with the following permissions:
   - Read market data âœ“
   - Read account balance âœ“
   - Create orders âœ“
   - Cancel orders âœ“
4. **Copy the private key** and add it to your `.env` file
4. **Secure your key** - Never commit `.env` to version control

### Environment Safety

Always add `.env` to your `.gitignore`:

```bash
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo "*.key" >> .gitignore
```

## Running the Server

### Basic Execution

```bash
bun run server.ts
```

The server will start on the default port and begin listening for MCP protocol connections.

### Running with Custom Configuration

```bash
# Run with specific environment file
export $(cat .env.production | xargs)
bun run server.ts

# Run in development mode with hot reload
bun run --watch server.ts

# Run with increased memory allocation
bun run --smol server.ts
```

### Verifying Server Status

Once started, you should see output similar to:

```
âœ“ Trading Bot Server initialized
âœ“ Market data provider connected
âœ“ MCP server listening on port 3000
âœ“ Ready for connections
```

## Debug Mode with Inspector

### Using MCP Inspector for Debugging

The MCP Inspector provides a visual interface for debugging and testing your MCP server. This is invaluable for:

- Testing tool function calls
- Inspecting server responses
- Debugging trade execution logic
- Monitoring real-time data flows

### Installation

```bash
# Install MCP Inspector globally
npm install -g @modelcontextprotocol/inspector
# or
bun add -g @modelcontextprotocol/inspector
```

### Running with Inspector

```bash
# Method 1: Using bunx (Bun's package runner)
bunx @modelcontextprotocol/inspector bun server.ts

# Method 2: Using installed inspector
mcp-inspector bun server.ts

# Method 3: Direct execution with inspector output
bun run --inspect server.ts
```

### Inspector Interface

Once running, the inspector will provide:

1. **Tool Browser** - View all available tools and their parameters
2. **Request/Response Viewer** - See real-time API calls and responses
3. **Error Tracking** - Monitor and debug errors as they occur
4. **Performance Metrics** - View execution times and resource usage

### Example Inspector Workflow

```bash
# 1. Start inspector
bunx @modelcontextprotocol/inspector bun server.ts

# 2. Open browser to localhost:3000 (inspector UI)

# 3. Test market data retrieval
# - Select "get_market_data" tool
# - Input: {"symbol": "BTC"}
# - View response in real-time

# 4. Test trade execution
# - Select "execute_trade" tool
# - Input: {"symbol": "BTC", "action": "LONG", "quantity": 1, "confidence": 0.85}
# - Monitor execution and response
```

## API Reference

### Available Tools

#### 1. `get_market_data`

Retrieves current market price and data for a specified cryptocurrency symbol.

**Parameters:**
- `symbol` (string, required): Trading symbol - `BTC`, `ETH`, `SOL`, or `HYPE`

**Response:**
```json
{
  "symbol": "BTC",
  "price": 45250.50,
  "change24h": 2.35,
  "volume": 28450000000,
  "timestamp": 1698825600000
}
```

#### 2. `get_technical_indicators`

Computes technical analysis indicators for a specified timeframe and symbol.

**Parameters:**
- `symbol` (string, required): Trading symbol
- `period` (string, required): Time period - `5m` (5-minute) or `4h` (4-hour)

**Response:**
```json
{
  "symbol": "BTC",
  "period": "5m",
  "rsi": 65.42,
  "macd": 245.30,
  "bollingerBands": {
    "upper": 46000,
    "middle": 45250,
    "lower": 44500
  }
}
```

#### 3. `get_open_positions`

Retrieves all currently open trading positions.

**Response:**
```json
{
  "positions": [
    {
      "symbol": "BTC",
      "side": "LONG",
      "quantity": 0.5,
      "entryPrice": 44000,
      "currentPrice": 45250.50,
      "pnl": 625.25,
      "pnlPercent": 1.42
    }
  ]
}
```

#### 4. `execute_trade`

Executes a trading action with specified parameters and confidence level.

**Parameters:**
- `symbol` (string, required): Trading symbol
- `action` (string, required): Trade action - `LONG`, `SHORT`, `HOLD`, or `CLOSE_ALL`
- `quantity` (number, required): Trade quantity in base currency
- `confidence` (number, required): Confidence level (0.0 - 1.0)
- `reasoning` (string, required): Explanation for the trade decision

**Response:**
```json
{
  "status": "executed",
  "orderId": "ORD_1698825650_BTC",
  "symbol": "BTC",
  "action": "LONG",
  "quantity": 0.5,
  "executionPrice": 45250.50,
  "timestamp": 1698825650000
}
```

#### 5. `request_ai_trading_bot`

Sends a request to the AI trading bot MCP server to gather data, analyze markets, and execute trades autonomously.

**Parameters:**
- `symbol` (string, required): Trading symbol to analyze

**Response:**
```json
{
  "status": "processing",
  "analysis": {
    "trend": "bullish",
    "strength": 0.85,
    "recommendation": "LONG"
  },
  "tradeExecuted": true,
  "orderId": "ORD_1698825650_BTC"
}
```

## Usage Examples

### Example 1: Fetching Market Data

```typescript
// Get current BTC price and market data
const response = await server.tools.get_market_data({
  symbol: "BTC"
});

console.log(`BTC Price: $${response.price}`);
console.log(`24h Change: ${response.change24h}%`);
```

### Example 2: Analyzing Technical Indicators

```typescript
// Get 5-minute technical indicators for ETH
const indicators = await server.tools.get_technical_indicators({
  symbol: "ETH",
  period: "5m"
});

console.log(`RSI: ${indicators.rsi}`);
console.log(`Bollinger Bands Upper: ${indicators.bollingerBands.upper}`);
```

### Example 3: Executing a Trade

```typescript
// Execute a LONG trade on SOL
const tradeResult = await server.tools.execute_trade({
  symbol: "SOL",
  action: "LONG",
  quantity: 10,
  confidence: 0.75,
  reasoning: "Strong bullish signal from RSI crossover"
});

console.log(`Order ID: ${tradeResult.orderId}`);
console.log(`Status: ${tradeResult.status}`);
```

### Example 4: Checking Open Positions

```typescript
// Get all open positions
const positions = await server.tools.get_open_positions();

positions.forEach(position => {
  console.log(`${position.symbol}: ${position.side} ${position.quantity}`);
  console.log(`P&L: $${position.pnl} (${position.pnlPercent}%)`);
});
```

### Example 5: Autonomous Trading with AI Bot

```typescript
// Request AI bot to analyze and trade HYPE
const aiTrade = await server.tools.request_ai_trading_bot({
  symbol: "HYPE"
});

console.log(`Analysis: ${aiTrade.analysis.trend}`);
console.log(`Trade Executed: ${aiTrade.tradeExecuted}`);
```

## Architecture

### High-Level Overview

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                    MCP Client                           â”‚
â”‚              (External Applications)                    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                       â”‚ MCP Protocol
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚          Trading Bot Server (server.ts)                 â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                                         â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚  â”‚        Tool Functions                           â”‚   â”‚
â”‚  â”‚  â€¢ get_market_data                              â”‚   â”‚
â”‚  â”‚  â€¢ get_technical_indicators                     â”‚   â”‚
â”‚  â”‚  â€¢ get_open_positions                           â”‚   â”‚
â”‚  â”‚  â€¢ execute_trade                                â”‚   â”‚
â”‚  â”‚  â€¢ request_ai_trading_bot                       â”‚   â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚             â”‚                                          â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚  â”‚        Integration Layer                        â”‚   â”‚
â”‚  â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤   â”‚
â”‚  â”‚  â€¢ Market Data API                              â”‚   â”‚
â”‚  â”‚  â€¢ Exchange API                                 â”‚   â”‚
â”‚  â”‚  â€¢ Technical Analysis Engine                    â”‚   â”‚
â”‚  â”‚  â€¢ Position Manager                             â”‚   â”‚
â”‚  â”‚  â€¢ LLM/AI Integration                           â”‚   â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”˜   â”‚
â”‚             â”‚                                   â”‚       â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”˜
              â”‚                                   â”‚
   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”                      â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”
   â”‚   Market    â”‚                      â”‚  Trading  â”‚
   â”‚ Data APIs   â”‚                      â”‚  Exchange â”‚
   â”‚  (Binance)  â”‚                      â”‚   (OKX)   â”‚
   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                      â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Component Details

| Component | Purpose | Technology |
|-----------|---------|------------|
| **MCP Protocol Handler** | Manages client connections | `@modelcontextprotocol/sdk` |
| **Market Data Service** | Fetches real-time prices | REST APIs + WebSocket |
| **Technical Analysis** | Calculates indicators | Custom TA library |
| **Trade Executor** | Submits orders to exchange | Exchange API SDK |
| **Position Manager** | Tracks active trades | Database/In-memory store |
| **AI/LLM Integration** | Autonomous analysis | External LLM API |

## Performance

### Bun Runtime Advantages

Bun provides significant performance improvements over Node.js:

| Metric | Node.js | Bun | Improvement |
|--------|---------|-----|-------------|
| Package Install | 45s | 8s | 5.6x faster |
| TypeScript Compilation | 2.3s | 0.1s | 23x faster |
| HTTP Throughput | 19,039 req/s | 59,026 req/s | 3.1x faster |
| WebSocket Messages | 435,099 msg/s | 2,536,227 msg/s | 5.8x faster |
| Database Queries | 14,522 q/s | 28,571 q/s | 1.97x faster |

### Optimization Tips

1. **Use Bun's built-in bundler** for faster builds
2. **Enable caching** for market data queries
3. **Batch trade operations** to reduce API calls
4. **Implement rate limiting** to respect exchange limits
5. **Monitor memory usage** with `bun run --smol` for constrained environments

## Troubleshooting

### Issue: "PRIVATE_API_KEY not found"

**Solution:**
```bash
# Verify .env file exists in project root
ls -la .env

# Verify variable is set
grep PRIVATE_API_KEY .env

# Reload environment
source .env
bun run server.ts
```

### Issue: "Connection refused" on port 3000

**Solution:**
```bash
# Check if port is already in use
lsof -i :3000

# Kill existing process
kill -9 <PID>

# Run on different port
PORT=3001 bun run server.ts
```

### Issue: Inspector not starting

**Solution:**
```bash
# Update inspector to latest version
bun add -g @modelcontextprotocol/inspector@latest

# Try direct inspector command
mcp-inspector --help

# Alternative: Use Bun's built-in debugger
bun run --inspect-brk server.ts
```

### Issue: API Key authentication failure

**Solution:**
```bash
# Verify API key format and encoding
echo $PRIVATE_API_KEY | wc -c

# Test API key with direct request
curl -H "Authorization: Bearer $PRIVATE_API_KEY" \
  https://api.example.com/account

# Check for whitespace issues
PRIVATE_API_KEY=$(echo $PRIVATE_API_KEY | xargs)
```

### Issue: High memory usage

**Solution:**
```bash
# Run with memory constraints
bun run --smol server.ts

# Monitor memory
ps aux | grep server.ts

# Implement position cleanup
# Add periodic garbage collection
setInterval(() => {
  if (global.gc) global.gc();
}, 60000);
```

### Issue: Market data API rate limiting

**Solution:**
```bash
# Implement exponential backoff
# Add request queuing
# Reduce polling frequency
# Consider upgrading API subscription tier
```

## Development Workflow

### Hot Reload Development

```bash
bun run --watch server.ts
```

### Running Tests

```bash
bun test
```

### Building for Production

```bash
bun build --target bun server.ts --outfile dist/server.js
```

### Docker Deployment

```dockerfile
FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY server.ts .
ENV NODE_ENV=production

EXPOSE 3000

CMD ["bun", "run", "server.ts"]
```

## Security Best Practices

1. **Never commit `.env` file** containing API keys
2. **Use environment-specific secrets** for production
3. **Implement rate limiting** to prevent abuse
4. **Validate all inputs** from external sources
5. **Use HTTPS** in production deployments
6. **Rotate API keys** regularly
7. **Monitor suspicious activity** on trading accounts
8. **Implement request signing** for trade execution

## Contributing

To contribute to this project:

1. Create a feature branch
2. Make your changes
3. Test thoroughly with the inspector
4. Submit a pull request

## License

[Add your license here]

## Support

For issues, questions, or feature requests:

- **GitHub Issues**: Create an issue in the repository
- **Documentation**: Check the docs folder
- **Debugging**: Use `bunx @modelcontextprotocol/inspector bun server.ts`

## Additional Resources

- [Bun Documentation](https://bun.sh)
- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [Trading Strategy Guide](./docs/trading-strategies.md)
- [API Integration Examples](./docs/api-examples.md)
- [Performance Tuning Guide](./docs/performance.md)
