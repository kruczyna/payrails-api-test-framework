# Test Plan for AlphaVantage TIME_SERIES_INTRADAY Endpoint

This test plan outlines manual and automated test cases for the AlphaVantage `TIME_SERIES_INTRADAY` endpoint, which returns intraday OHLCV data for specified equities.


## 🟢 TC01 - Valid intraday 5min request

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC01 |
| **Title**        | Verify 5min intraday data returns for valid symbol |
| **Preconditions**| Valid API key is available in environment config |
| **Test Steps**   |
| 1. Send a `GET` request to `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=VALID_KEY` |
| **Expected Result** | Status code is `200`. Response body includes `Meta Data` and `Time Series (5min)` keys with OHLCV data. |
| **Priority**     | High |
| **Tags**         | @positive @api |

---

## 🟢 TC02 - Full output for past month

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC02 |
| **Title**        | Validate full intraday data for symbol `IBM` for month `2009-01` |
| **Preconditions**| Valid API key is available |
| **Test Steps**   |
| 1. Send a `GET` request with params: `function=TIME_SERIES_INTRADAY`, `symbol=IBM`, `interval=5min`, `month=2009-01`, `outputsize=full`, `apikey=VALID_KEY` |
| **Expected Result** | Response code `200`, and large payload including `Meta Data` and `Time Series (5min)` entries from 2009-01. |
| **Priority**     | Medium |
| **Tags**         | @positive @api |

---

## 🔴 TC03 - Invalid interval value

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC03 |
| **Title**        | Ensure invalid interval triggers an error |
| **Preconditions**| Valid API key is available |
| **Test Steps**   |
| 1. Send request with `interval=7min`, all other params valid |
| **Expected Result** | Response includes an `Error Message` or `Note` stating the call is invalid. No data returned. |
| **Priority**     | High |
| **Tags**         | @negative @api |

---

## 🔴 TC04 - Missing interval parameter

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC04 |
| **Title**        | Ensure missing required `interval` param returns error |
| **Preconditions**| Valid API key is set |
| **Test Steps**   |
| 1. Send request without `interval` field |
| **Expected Result** | Error response or informative `Note` explaining missing parameter. |
| **Priority**     | High |
| **Tags**         | @negative @api |

---

## 🔴 TC05 - Missing API key

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC05 |
| **Title**        | Ensure missing API key returns authentication error |
| **Preconditions**| No API key is used in request |
| **Test Steps**   |
| 1. Send request with all required params except `apikey` |
| **Expected Result** | Error response: status 200 with `Error Message` or `Note`. No data returned. |
| **Priority**     | High |
| **Tags**         | @negative @auth |

---

## 🔴 TC06 - Invalid symbol

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC06 |
| **Title**        | Ensure invalid symbol returns empty or error |
| **Preconditions**| Valid API key |
| **Test Steps**   |
| 1. Use `symbol=FAKE123` with other valid params |
| **Expected Result** | Response includes no `Time Series` key or an error explaining the issue. |
| **Priority**     | Medium |
| **Tags**         | @negative @edgecase |

---


## 🟢 TC07 - Request CSV format

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC07 |
| **Title**        | Validate response in CSV format |
| **Preconditions**| Valid API key and params |
| **Test Steps**   |
| 1. Send request with `datatype=csv` |
| **Expected Result** | Response text begins with: `timestamp,open,high,low,close,volume` |
| **Priority**     | Medium |
| **Tags**         | @positive @csv |

---

## 🟢 TC08 - Use of adjusted and extended_hours flags

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC08 |
| **Title**        | Check adjusted=false and extended_hours=false filter data correctly |
| **Preconditions**| Valid API key |
| **Test Steps**   |
| 1. Send request with `adjusted=false`, `extended_hours=false` |
| **Expected Result** | Response is valid and excludes extended hours data; time range matches regular trading. |
| **Priority**     | Low |
| **Tags**         | @positive @filters |

---

## 🟢 TC09 - All optional params enabled

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC09 |
| **Title**        | Confirm all optional params work together |
| **Preconditions**| Valid API key |
| **Test Steps**   |
| 1. Send request using: `adjusted=false`, `extended_hours=false`, `month=2009-01`, `outputsize=full`, `datatype=json` |
| **Expected Result** | Valid JSON response with full historical intraday data. |
| **Priority**     | Medium |
| **Tags**         | @positive @edgecase |

---

## 🔴 TC10 – Invalid datatype value

| Field             | Value                                      |
|------------------|--------------------------------------------|
| **Test Case ID** | TC10                                       |
| **Title**        | Ensure invalid `datatype` value returns an error |
| **Preconditions**| Valid API key is available                 |
| **Test Steps**   | 1. Send a `GET` request to the API with `datatype=xml` (unsupported) and other valid parameters |
| **Expected Result** | API should return an error message or fallback to default JSON. If fallback happens, response structure should still be valid and include `Meta Data` and `Time Series`. |
| **Priority**     | Medium                                     |
| **Tags**         | @negative @api @validation                 |

---

## 🔴 TC11 – Invalid outputsize value

| Field             | Value                                      |
|------------------|--------------------------------------------|
| **Test Case ID** | TC11                                       |
| **Title**        | Ensure invalid `outputsize` returns an error or fallback |
| **Preconditions**| Valid API key is set                       |
| **Test Steps**   | 1. Send a `GET` request with `outputsize=giant` (invalid), other params valid |
| **Expected Result** | API may either return a clear error, or fallback to `compact`. Behavior should be documented and consistent. |
| **Priority**     | Medium                                     |
| **Tags**         | @negative @api @validation                 |

---

## 🔴 TC12 - Rate limiting threshold

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC12 |
| **Title**        | Ensure API responds with a rate limit error after 5 requests per minute |
| **Preconditions**| Valid API key with free-tier plan |
| **Test Steps**   |
| 1. Send 6 rapid consecutive requests to the API (e.g. in under 60 seconds) |
| **Expected Result** | The 6th response should include a `Note` message indicating rate limiting. |
| **Priority**     | High |
| **Tags**         | @negative @ratelimit |

---

## 🔴 TC13 - Numeric symbol edge case

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC13 |
| **Title**        | Ensure API returns error or empty result for numeric-only symbol |
| **Preconditions**| Valid API key |
| **Test Steps**   |
| 1. Send request with `symbol=123456`, and valid interval/apikey |
| **Expected Result** | Response should either return an error or no data. `Meta Data` or `Time Series` should not exist. |
| **Priority**     | Medium |
| **Tags**         | @negative @edgecase |

---

## 🔴 TC14 - Boundary test: earliest supported month

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC14 |
| **Title**        | Check response for oldest supported date (month=2000-01) |
| **Preconditions**| Valid API key |
| **Test Steps**   |
| 1. Use `month=2000-01` with valid interval and outputsize |
| **Expected Result** | Response status is `200`, and returns correct metadata or meaningful error if out of bounds. |
| **Priority**     | Medium |
| **Tags**         | @boundary @api |

---

## 🔴 TC15 - Boundary test: future date not allowed

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC15 |
| **Title**        | Check behavior for unsupported future date (e.g. `month=2099-01`) |
| **Preconditions**| Valid API key |
| **Test Steps**   |
| 1. Use `month=2099-01` in request |
| **Expected Result** | Response includes no `Time Series`, or returns a clear error or empty result. |
| **Priority**     | Medium |
| **Tags**         | @boundary @negative |

---

## 🔐 TC16 - Injection-style symbol string

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC16 |
| **Title**        | Ensure special characters in symbol are safely handled |
| **Preconditions**| Valid API key |
| **Test Steps**   |
| 1. Send a request with `symbol=IBM'; DROP TABLE stocks;--` and valid params |
| **Expected Result** | API returns an error or empty result; no crash or unsafe behavior observed. |
| **Priority**     | High |
| **Tags**         | @security @negative |

---

## 🔐 TC17 - XSS attempt in symbol field

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC17 |
| **Title**        | Ensure potential script input is ignored in symbol field |
| **Preconditions**| Valid API key |
| **Test Steps**   |
| 1. Send request with `symbol=<script>alert(1)</script>` and valid interval/apikey |
| **Expected Result** | Response contains no script execution or HTML injection; returned as plain string or rejected. |
| **Priority**     | High |
| **Tags**         | @security @xss @negative |

---

## 🔴 TC18 - Save unrecognized value to DB

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC18 |
| **Title**        | Ensure unrecognized values are not persisted in downstream systems or logs |
| **Preconditions**| System integrates API responses into a DB or store |
| **Test Steps**   |
| 1. Send a request with `symbol=FAKE123`, `interval=5min` and a valid API key. |
| 2. Observe backend DB/log system for persistence or ingestion behavior. |
| **Expected Result** | System should not save invalid or empty results to database/logs. DB entries should remain unchanged. |
| **Priority**     | High |
| **Tags**         | @negative @integrity @persistence |

---

## 🟡 TC19 - Ensure no event emission or side effect on API call

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC19 |
| **Title**        | Validate that API call does not trigger internal events or persistence unless explicitly configured |
| **Preconditions**| Application listens for events or logs from third-party API integrations |
| **Test Steps**   |
| 1. Send a normal request to the API using valid parameters. |
| 2. Monitor event emitters, webhooks, or async logging systems (if any). |
| **Expected Result** | No events, logs, or DB actions are triggered unless explicitly enabled by system configuration. |
| **Priority**     | Medium |
| **Tags**         | @observability @eventing @defensive |

---

## 🧪 Automated Test Cases

### ✅ Automated Test Case 1: `TC01`
- Title: Fetch 5min intraday data for a valid symbol
- Type: Positive
- Status code check: `200`
- JSON key check: `Meta Data` and `Time Series (5min)` exist
- Implemented in: `intraday.feature` & `intraday.steps.ts`

### ✅ Automated Test Case 2: `TC04`
- Title: Invalid interval returns error
- Type: Negative
- Sends `interval=7min`
- Asserts response includes `Error Message` or `Note`
- Implemented in: `intraday.feature` & `intraday.steps.ts`


## 🔍 Notes
- All tests use Playwright's APIRequestContext.
- BDD structure built with Cucumber.js and TypeScript.
- `.env` file is used to manage API key securely.
- Manual cases can be extended into automated tests easily thanks to modular step definitions.
- Rate limiting and real-time market hours may impact response data — tested against demo or valid API key.

---

Prepared for: Payrails QA Technical Challenge
Framework: Playwright + Cucumber.js + TypeScript
