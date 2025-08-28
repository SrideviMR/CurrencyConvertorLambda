// src/types/currency.ts
export type Currency = {
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  rateAgainstUSD: number;
  updatedBy: string;
  updatedAt: string;
}

export type CreateCurrencyInput = {
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  rateAgainstUSD: number;
  updatedBy: string;
}

export type CurrencyResult = {
  currencyCode?: string;
  reason: string;
} 

export type UpdateCurrencyInput = {
  currencyName: string;
  currencySymbol: string;
  rateAgainstUSD: number;
  updatedBy: string;
}
export type UpdateCurrencyResult = {
  currencyCode?: string;
  reason: string;
}

export type ConversionResult = {
  from: string;
  to: string;
  inputAmount: number;
  convertedAmount: number;
}

export type ErrorResponse = {
  error: string;
}
export type SuccessResponse<T> = {
  message: string;
  data: T;
}
export type PaginatedCurrencies = {
  items: Currency[];
  lastEvaluatedKey?: string;
}
export type PaginatedCurrenciesResponse = SuccessResponse<PaginatedCurrencies>;

export type ConversionResponse = SuccessResponse<ConversionResult> | ErrorResponse;

export type CurrencyResponse = SuccessResponse<Currency> | ErrorResponse;

export type CurrenciesResponse = SuccessResponse<Currency[]> | ErrorResponse;
export type CreateCurrencyResponse = SuccessResponse<Currency> | ErrorResponse;
export type UpdateCurrencyResponse = SuccessResponse<{ message: string; data: Currency }> | Error
