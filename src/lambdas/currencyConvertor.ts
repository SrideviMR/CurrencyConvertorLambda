// src/lambda/getAllCurrency.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  createCurrency,
  getAllCurrencies,
  calculateCurrency,
  updateCurrency,
  getCurrency,
} from "../services/currencyService";

// Utility to send API Gateway response
const sendResponse = (status: number, body: any): APIGatewayProxyResult => ({
  statusCode: status,
  body: JSON.stringify(body),
});

// Create Currency
export const createCurrencyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const result = await createCurrency(JSON.parse(event.body || "{}"));
  return sendResponse(result.status, result.body);
};

// Get All Currencies
export const getAllCurrenciesHandler = async (): Promise<APIGatewayProxyResult> => {
  const result = await getAllCurrencies();
  return sendResponse(result.status, result.body);
};

// Calculate Currency
export const calculateCurrencyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const result = await calculateCurrency(event.queryStringParameters || {});
  return sendResponse(result.status, result.body);
};

// Update Currency
export const updateCurrencyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const code = event.pathParameters?.code || "";
  const result = await updateCurrency(code, JSON.parse(event.body || "{}"));
  return sendResponse(result.status, result.body);
};

// Get Currency by Code
export const getCurrencyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const code = event.pathParameters?.code || "";
  const result = await getCurrency(code);
  return sendResponse(result.status, result.body);
};
