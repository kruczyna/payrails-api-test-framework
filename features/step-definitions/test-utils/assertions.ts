import { expect } from "@playwright/test";

export const expectedMetaDataKeys = [
  '1. Information',
  '2. Symbol',
  '3. Last Refreshed',
  '4. Interval',
  '5. Output Size',
  '6. Time Zone'
];

const expectedTimeSeriesKeys = [
  '1. open',
  '2. high',
  '3. low',
  '4. close',
  '5. volume'
];

export function assertMetaDataStructure(metaData: any, expectedInterval: string) {
  expect(Object.keys(metaData).length).toBe(expectedMetaDataKeys.length);

  expectedMetaDataKeys.forEach((key) => {
    expect(Object.keys(metaData)).toContain(key);
    expect(typeof metaData[key]).toBe('string');
  });

  expect(metaData['4. Interval']).toBe(expectedInterval);
  expect(metaData['1. Information']).toContain(expectedInterval);
  expect(typeof metaData).toBe('object');
}

export function assertTimeSeriesStructure(timeSeries: Record<string, any>) {
  const timestamps = Object.keys(timeSeries);
  expect(timestamps.length).toBeGreaterThan(1);

  const firstTimestamp = new Date(timestamps[0]);
  const lastTimestamp = new Date(timestamps[timestamps.length - 1]);
  expect(firstTimestamp.getTime()).toBeGreaterThan(lastTimestamp.getTime());

  timestamps.forEach((timestamp) => {
    const entry = timeSeries[timestamp];

    expectedTimeSeriesKeys.forEach((key) => {
      expect(Object.keys(entry)).toContain(key);
      expect(typeof entry[key]).toBe('string');
    });

    // 📝 Note:
    // The following assertions validate the logical consistency of OHLC (Open, High, Low, Close) values,
    // ensuring that 'high' is at least as large as the higher of open/close and 'low' is at most the smaller.
    // These validations go beyond basic structural testing and check for data correctness.
    //
    // While this level of checking is appropriate when the API is part of our internal service
    // or if our business logic depends on reliable financial data structure,
    // it would generally be considered out of scope when testing a third-party API (like AlphaVantage),
    // unless such checks are essential for downstream processing or error handling in our system.

    const open = parseFloat(entry['1. open']);
    const high = parseFloat(entry['2. high']);
    const low = parseFloat(entry['3. low']);
    const close = parseFloat(entry['4. close']);
    expect(high).toBeGreaterThanOrEqual(low);

    const maxOpenClose = Math.max(open, close);
    const minOpenClose = Math.min(open, close);
    expect(high).toBeGreaterThanOrEqual(maxOpenClose);
    expect(low).toBeLessThanOrEqual(minOpenClose);
  });
}
