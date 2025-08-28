// src/service/currencyConvertorService.ts
import { validateCurrencyInput, prepareCurrencyData, calculateConversion, parseAmount, validateRates } from '../utils/currencyUtils'
import { CreateCurrencyInput } from '../types/currency';
import { createCurrencyItem, getAllCurrencyItems, getCurrencyItemByCode, updateCurrencyItem } from '../db/currencyConvertorDao';

export const createCurrency = async (body: CreateCurrencyInput) => {
  if (!validateCurrencyInput(body)) {
    return { status: 400, body: { error: 'Invalid input data' } };
  }

  const currencyData = prepareCurrencyData(body);
  console.log("currencyData", currencyData);
  console.log("Using table:", process.env.TABLE_NAME);
  const result = await createCurrencyItem(currencyData);
  console.log("result",result);

  if (!result.success) {
    if (result.code === 'CONFLICT') return { status: 409, body: { error: result.message } };
    return { status: 500, body: { error: result.message } };
  }

  return { status: 201, body: { message: 'Currency added to DynamoDB', data: result.data } };
};

export const getAllCurrencies = async () => {
  const result = await getAllCurrencyItems();

  if (!result.success) {
    return { status: 500, body: { error: result.message } };
  }

  return { status: 200, body: result.data };
};

export const calculateCurrency = async (query: any) => {
  const { from, to, input } = query;

  if (!from || !to || !input) {
    return { status: 400, body: { error: "Missing required query parameters: from, to, input" } };
  }

  const inputAmount = parseAmount(input);
  if (inputAmount == null) {
    return { status: 400, body: { error: "Invalid input amount" } };
  }
  console.log("from, to",from, to, inputAmount);
  const fromData = await getCurrencyItemByCode(from);
  const toData = await getCurrencyItemByCode(to);

  const error = validateRates(fromData.data?.rateAgainstUSD, toData.data?.rateAgainstUSD);
  if (error) {
    return { status: 400, body: { error } };
  }

  const convertedAmount = calculateConversion(
    fromData.data?.rateAgainstUSD,
    toData.data?.rateAgainstUSD,
    inputAmount
  );

  return { status: 200, body: { from, to, inputAmount, convertedAmount } };
};

export const updateCurrency = async (code: string, body: any) => {
  if (!validateCurrencyInput({ ...body, currencyCode: code })) {
    return { status: 400, body: { error: 'Invalid input data' } };
  }

  const updatedData = prepareCurrencyData(body);
  const result = await updateCurrencyItem(code, updatedData);

  if (!result.success) {
    if (result.code === 'NOT_FOUND') return { status: 404, body: { error: result.message } };
    return { status: 500, body: { error: result.message } };
  }

  return { status: 200, body: { message: 'Currency updated successfully', data: result.data } };
};

export const getCurrency = async (code: string) => {
  const result = await getCurrencyItemByCode(code);

  if (!result.success) {
    if (result.code === 'NOT_FOUND') return { status: 404, body: { error: result.message } };
    return { status: 500, body: { error: result.message } };
  }

  return { status: 200, body: result.data };
};
