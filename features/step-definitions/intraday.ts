import { Given, When, Then } from '@cucumber/cucumber';
import { expect, APIResponse } from '@playwright/test';
import { IntradayAPI } from '../../src/api/IntradayAPI';
import { assertMetaDataStructure, assertTimeSeriesStructure } from './test-utils/assertions'
import * as dotenv from 'dotenv';

dotenv.config();

let api: IntradayAPI;
let response: APIResponse;
let apikey: string;

Given('I have a valid API key', async function () {
  apikey = process.env.ALPHAVANTAGE_API_KEY!;
  api = new IntradayAPI();
  await api.init();
});

When('I request intraday data for symbol {string} with interval {string}', async function (symbol: string, interval: string) {
  response = await api.getIntraday(symbol, interval, apikey);
});

When('I request intraday data for symbol {string} without an interval', async function (symbol: string) {
  response = await api.getIntraday(symbol, '', apikey);
});

Then('the response status should be {int}', async function (statusCode: number) {
  expect(response.status()).toBe(statusCode);
});

Then('the response should include intraday time series for interval {string}', async function (interval: string) {
  const body = await response.json();
  const timeSeriesKey = `Time Series (${interval})`;
  const timeSeries = body[timeSeriesKey];
  const metaData = body['Meta Data']

  assertTimeSeriesStructure(timeSeries);
  assertMetaDataStructure(metaData, interval);
});

Then('the response should include an error message mentioning {string}', async function (functionName: string) {
  const body = await response.json();
  expect(body['Error Message']).toMatch(/Invalid API call/);
  expect(body['Error Message']).toContain(functionName);
});
