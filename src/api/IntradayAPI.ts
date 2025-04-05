import { request, APIRequestContext, APIResponse } from '@playwright/test';

export class IntradayAPI {
  private context!: APIRequestContext;
  private baseURL = 'https://www.alphavantage.co/query';

  async init() {
    this.context = await request.newContext();
  }

  async getIntraday(
    symbol: string,
    interval: string,
    apikey: string,
    month?: string,
    outputsize: string = 'compact',
  ): Promise<APIResponse> {
    const params: Record<string, string> = {
      function: 'TIME_SERIES_INTRADAY',
      symbol,
      interval,
      apikey,
      outputsize,
    };
    if (month) params.month = month;

    return await this.context.get(this.baseURL, { params });
  }
}
