# 📊 AlphaVantage Intraday API Test Framework

This repository contains a BDD-style API test automation framework built with **Playwright**, **Cucumber.js**, and **TypeScript** to test the `TIME_SERIES_INTRADAY` endpoint of AlphaVantage.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/kruczyna/payrails-api-test-framework.git
cd payrails-api-test-framework
```

### 2. Use Node.js 20
This project requires **Node.js v20**.

If you're using `nvm`, run:
```bash
nvm install 20
nvm use 20
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
touch .env
```

Edit the `.env` file and insert your AlphaVantage API key:

```env
ALPHAVANTAGE_API_KEY=your_real_api_key_here
```

✅ Alternatively, you can copy from .env.example and fill in your key.

```bash
cp .env.example .env
```

---

## 🧪 Running the Tests

### Run all tests
```bash
npm run test:api:bdd
```

### Run only positive tests
```bash
npm run test:api:positive
```

### Run only negative tests
```bash
test:api:negative
```

---

## 🧱 Tech Stack
- [Playwright](https://playwright.dev/) - API testing via `APIRequestContext`
- [Cucumber.js](https://github.com/cucumber/cucumber-js) - BDD syntax
- [TypeScript](https://www.typescriptlang.org/) - Static typing
- [dotenv](https://www.npmjs.com/package/dotenv) - Secure environment variable handling

---

## 📁 Project Structure
```
├── features
│   ├── intraday.feature               # BDD test scenarios
│   └── step-definitions
│       ├── intraday.steps.ts         # Step definitions for test logic
│       └── test-utils
│           └── assertions.ts         # Shared assertion functions
├── src
│   └── api
│       └── IntradayAPI.ts            # API service abstraction
├── .env.example                      # Sample environment file
├── cucumber.js                       # Cucumber runner config
├── package.json                      # NPM scripts and dependencies

```

---

## ✅ Scripts
```json
"scripts": {
  "test:api:bdd": "cucumber-js",
  "test:api:positive": "cucumber-js --tags @positive",
  "test:api:negative": "cucumber-js --tags @negative"
}
```

---

## 🔍 Overview of Test Cases

### ✅ Positive Test Cases (@positive)
- **TC01**: Valid intraday 5min request for symbol `IBM`
- **TC02**: Full output for earliest supported month (boundary test for `2000-01`)
- **TC03**: All optional params enabled return valid result
- **TC04**: CSV format returns correct headers
- **TC05**: `adjusted=false` & `extended_hours=false` return limited data

### ❌ Negative Test Cases (@negative)
- **TC06**: Invalid interval values return error (e.g., `7min`, `-5min`, `@@@`)
- **TC07**: Missing interval parameter returns informative error
- **TC08**: Future `month=2099-01` results in empty or error
- **TC09**: Missing API key results in error
- **TC10**: Invalid API key returns error message
- **TC11**: Invalid symbol values (numeric, special, or fake) return error or empty response
- **TC12**: Missing `symbol` param triggers an error
- **TC13**: Invalid `datatype` value returns fallback or error
- **TC14**: Invalid `outputsize` returns fallback or error
- **TC15**: Rate limiting behavior after 5 rapid calls

### 🔐 Security and Edge Case Tests
- **TC16**: SQL injection-like value in `symbol` is safely handled
- **TC17**: XSS attempt in `symbol` does not execute

### 🟡 Conditional/Internal-Only (Add if applicable)
- **TC18**: Invalid data should not persist in DB (only relevant if ingestion happens)
- **TC19**: Ensure no event emission or side effect on API call

---

## 🧠 Notes
- Free AlphaVantage accounts are **rate-limited to 5 calls/min**, so avoid running all test cases repeatedly.
- Some scenarios request historical data (e.g. 2009-01) to demonstrate extended API functionality.
- CSV and JSON formats are both supported.

---

## 👤 Author
**Victoria Kruczek**
Built for the Payrails QA Technical Challenge
