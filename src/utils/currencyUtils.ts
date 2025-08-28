//src/utils/currencyUtils.ts
import { Currency } from '../types/currency';

export const validateCurrencyInput = (body: any) => {
  const { currencyCode, currencyName, currencySymbol, rateAgainstUSD, updatedBy } = body;
  if (!currencyCode || !currencyName || !currencySymbol || typeof rateAgainstUSD !== 'number' || !updatedBy) {
    return false;
  }
  return true;
};

export const prepareCurrencyData = (body: any): Currency => {
  const updatedAt = new Date().toISOString();
  return { ...body, updatedAt };
};

export const calculateConversion = (fromRate: number, toRate: number, inputAmount: number): number => {
  const converted = (inputAmount * fromRate) / toRate;
  return Number(converted.toFixed(4));
};
export const parseAmount = (input: string): number | null => {
  const amount = parseFloat(input);
  return isNaN(amount) ? null : amount;
};
export const validateRates = (fromRate: number | undefined, toRate: number | undefined): string | null => {
  if (fromRate == null || toRate == null) {
    return "One of the currency rates is not available";
  }
  if (fromRate <= 0 || toRate <= 0) {
    return "Currency rates must be greater than zero";
  }
  return null;
};