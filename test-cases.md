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
| **Notes**         | This test uses the `5min` interval, which is one of the valid values. Other supported intervals include: `1min`, `15min`, `30min`, and `60min`. |
| **Priority**     | High |
| **Tags**         | @positive @api |

---

## 🟢 TC02 - Full output for earliest supported month (boundary)

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC02 |
| **Title**        | Validate full intraday data for symbol `IBM` for month `2000-01` |
| **Preconditions**| Valid API key is available |
| **Test Steps**   |
| 1. Send a `GET` request with params: `function=TIME_SERIES_INTRADAY`, `symbol=IBM`, `interval=5min`, `month=2000-01`, `outputsize=full`, `apikey=VALID_KEY` |
| **Expected Result** | Response code `200`, and large payload including `Meta Data` and `Time Series (5min)` entries from January 2000. |
| **Notes**         | This is also a boundary test for the earliest supported month: `2000-01`. |
| **Priority**     | Medium |
| **Tags**         | @positive @api @boundary |

---

## 🟢 TC03 - All optional params enabled

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC03 |
| **Title**        | Confirm all optional params work together |
| **Preconditions**| Valid API key |
| **Test Steps**   |
| 1. Send request using: `adjusted=false`, `extended_hours=false`, `month=2009-01`, `outputsize=full`, `datatype=json` |
| **Expected Result** | Valid JSON response with full historical intraday data. |
| **Priority**     | Medium |
| **Tags**         | @positive @api @edgecase |

---

## 🟢 TC04 - Request CSV format

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC04 |
| **Title**        | Validate response in CSV format |
| **Preconditions**| Valid API key and params |
| **Test Steps**   |
| 1. Send request with `datatype=csv` |
| **Expected Result** | Response text begins with: `timestamp,open,high,low,close,volume` |
| **Priority**     | Medium |
| **Tags**         | @positive @api @csv |

---

## 🟢 TC05 - Use of adjusted and extended_hours flags

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC05 |
| **Title**        | Check adjusted=false and extended_hours=false filter data correctly |
| **Preconditions**| Valid API key |
| **Test Steps**   |
| 1. Send request with `adjusted=false`, `extended_hours=false` |
| **Expected Result** | Response is valid and excludes extended hours data; time range matches regular trading. |
| **Priority**     | Low |
| **Tags**         | @positive @api @filters |

---

## 🔴 TC06 – Invalid interval value

| Field             | Value                                                  |
|------------------|--------------------------------------------------------|
| **Test Case ID** | TC06                                                   |
| **Title**        | Ensure invalid interval triggers an error              |
| **Preconditions**| Valid API key is available                             |
| **Test Steps**   |                                                        |
|                  | 1. Send request with `interval=7min` (unsupported value) |
|                  | 2. Send request with `interval=-5min` (negative value) |
|                  | 3. Send request with `interval=@@@` (non-alphanumeric) |
| **Expected Result** | Each request should return an `Error Message` or `Note`. No `Time Series` data should be included. |
| **Priority**     | High                                                   |
| **Tags**         | @negative @api @validation                             |

---

## 🔴 TC07 - Missing interval parameter

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC07 |
| **Title**        | Ensure missing required `interval` param returns error |
| **Preconditions**| Valid API key is set |
| **Test Steps**   |
| 1. Send request without `interval` field |
| **Expected Result** | Error response or informative `Note` explaining missing parameter. |
| **Priority**     | High |
| **Tags**         | @negative @api |

---

## 🔴 TC08 - Invalid date value: future date not allowed

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC08 |
| **Title**        | Check behavior for unsupported future date (e.g. `month=2099-01`) |
| **Preconditions**| Valid API key |
| **Test Steps**   |
| 1. Use `month=2099-01` in request |
| **Expected Result** | Response includes no `Time Series`, or returns a clear error or empty result. |
| **Priority**     | Medium |
| **Tags**         | @validation @negative @api |

---

## 🔴 TC059 - Missing API key

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC09 |
| **Title**        | Ensure missing API key returns authentication error |
| **Preconditions**| No API key is used in request |
| **Test Steps**   |
| 1. Send request with all required params except `apikey` |
| **Expected Result** | Error response: status 200 with `Error Message` or `Note`. No data returned. |
| **Priority**     | High |
| **Tags**         | @negative @auth @api |

---

## 🔴 TC10 - Invalid API key value

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC10 |
| **Title**        | Ensure invalid API key is rejected |
| **Preconditions**| An intentionally invalid API key (e.g. `apikey=INVALID123`) |
| **Test Steps**   |
| 1. Send request using all valid parameters except an incorrect `apikey` |
| **Expected Result** | Response status is `200`, but body includes an error message like `Invalid API call` or `Invalid API key`. No `Time Series` data returned. |
| **Priority**     | High |
| **Tags**         | @negative @auth @validation @api |

---

## 🔴 TC11 - Invalid and edge-case symbol values

| Field             | Value |
|------------------|--------------------------------------------|
| **Test Case ID** | TC11                                       |
| **Title**        | Validate API behavior for incorrect or unusual symbol values |
| **Preconditions**| Valid API key                              |
| **Test Steps**   |
| 1. Send a request with `symbol=FAKE123` (nonexistent but syntactically valid).
| 2. Send a request with `symbol=123456` (numeric only).
| 3. Send a request with `symbol=$$$!!!` (special characters). |
| **Expected Result** | Each request should return a response with no `Time Series` data and either:
   - an error message,
   - an empty result, or
   - a `Note` indicating invalid usage.
   The API should not crash or return HTTP errors. |
| **Priority**     | Medium |
| **Tags**         | @negative @api @validation @edgecase |


## 🔴 TC12 - Missing symbol parameter

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC12 |
| **Title**        | Ensure request without `symbol` param returns an error |
| **Preconditions**| Valid API key |
| **Test Steps**   |
| 1. Send a `GET` request without the `symbol` parameter. All other required fields are present (e.g., `function`, `interval`, `apikey`). |
| **Expected Result** | Response should include an `Error Message` or a `Note` indicating that `symbol` is required. No `Time Series` data should be returned. |
| **Priority**     | High |
| **Tags**         | @negative @api @validation |

---

## 🔴 TC13 – Invalid datatype value

| Field             | Value                                      |
|------------------|--------------------------------------------|
| **Test Case ID** | TC13                                       |
| **Title**        | Ensure invalid `datatype` value returns an error |
| **Preconditions**| Valid API key is available                 |
| **Test Steps**   | 1. Send a `GET` request to the API with `datatype=xml` (unsupported) and other valid parameters |
| **Expected Result** | API should return an error message or fallback to default JSON. If fallback happens, response structure should still be valid and include `Meta Data` and `Time Series`. |
| **Priority**     | Medium                                     |
| **Tags**         | @negative @api @validation                 |

---

## 🔴 TC14 – Invalid outputsize value

| Field             | Value                                      |
|------------------|--------------------------------------------|
| **Test Case ID** | TC14                                       |
| **Title**        | Ensure invalid `outputsize` returns an error or fallback |
| **Preconditions**| Valid API key is set                       |
| **Test Steps**   | 1. Send a `GET` request with `outputsize=giant` (invalid), other params valid |
| **Expected Result** | API may either return a clear error, or fallback to `compact`. Behavior should be documented and consistent. |
| **Priority**     | Medium                                     |
| **Tags**         | @negative @api @validation                 |

---

## 🔴 TC15 - Rate limiting threshold

| Field             | Value |
|------------------|-------|
| **Test Case ID** | TC15 |
| **Title**        | Ensure API responds with a rate limit error after 5 requests per minute |
| **Preconditions**| Valid API key with free-tier plan |
| **Test Steps**   |
| 1. Send 6 rapid consecutive requests to the API (e.g. in under 60 seconds) |
| **Expected Result** | The 6th response should include a `Note` message indicating rate limiting. |
| **Priority**     | High |
| **Tags**         | @negative @ratelimit @api |

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
| **Tags**         | @security @negative @api |

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
| **Tags**         | @security @xss @negative @api |

---



## *Only relevant if the API response is further ingested into internal storage or systems. Not applicable for read-only third-party APIs like AlphaVantage.*

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
| **Notes**         | *Only relevant if the API response is further ingested into internal storage or systems. Not applicable for read-only third-party APIs like AlphaVantage.* |
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
| **Notes**         | *Only relevant if this API is wrapped by internal infrastructure or event-based logic. Skip for external, read-only usage.* |
| **Priority**     | Medium |
| **Tags**         | @observability @eventing @defensive |



## 🧪 Automated Test Cases

### ✅ Automated Test Case 1: `TC01`
- Title: Fetch 5min intraday data for a valid symbol
- Type: Positive
- Status code check: `200`
- JSON key check: `Meta Data` and `Time Series (5min)` exist
- Implemented in: `intraday.feature` & `intraday.steps.ts`

### ✅ Automated Test Case 2: `TC06`
- Title: Invalid interval value
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
