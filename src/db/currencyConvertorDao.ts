// src/dao/currencyConvertorDao.ts
import { putItem, scanItems, getItem, updateItem } from './aws-db';
import { Currency } from '../types/currency';

const TABLE_NAME = process.env.TABLE_NAME;
if (!TABLE_NAME) throw new Error('TABLE_NAME is not defined in environment variables');

export const createCurrencyItem = async (currency: Currency) => {
  const params = {
    TableName: TABLE_NAME,
    Item: currency,
    ConditionExpression: 'attribute_not_exists(currencyCode)',
  };

  try {
    console.log('Creating currency item with params:', params);
    await putItem(params);
    return { success: true, data: currency };
  } catch (error: any) {
    if (error.name === 'ConditionalCheckFailedException') {
      return { success: false, code: 'CONFLICT', message: 'Currency already exists' };
    }
    return { success: false, code: 'DB_ERROR', message: error.message };
  }
};

export const getAllCurrencyItems = async () => {
  const params = { TableName: TABLE_NAME };

  try {
    const result = await scanItems(params);
    return { success: true, data: result.Items || [] };
  } catch (error: any) {
    return { success: false, code: 'DB_ERROR', message: error.message };
  }
};

export const getCurrencyItemByCode = async (code: string) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { currencyCode: code },
  };

  try {
    const result = await getItem(params);
    if (!result.Item) {
      return { success: false, code: 'NOT_FOUND', message: 'Currency not found' };
    }
    return { success: true, data: result.Item };
  } catch (error: any) {
    return { success: false, code: 'DB_ERROR', message: error.message };
  }
};

export const updateCurrencyItem = async (code: string, values: any) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { currencyCode: code },
    UpdateExpression: `
      SET currencyName = :name,
          currencySymbol = :symbol,
          rateAgainstUSD = :rate,
          updatedAt = :updatedAt,
          updatedBy = :updatedBy
    `,
    ExpressionAttributeValues: {
      ':name': values.currencyName,
      ':symbol': values.currencySymbol,
      ':rate': values.rateAgainstUSD,
      ':updatedAt': values.updatedAt,
      ':updatedBy': values.updatedBy,
    },
    ConditionExpression: 'attribute_exists(currencyCode)',
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await updateItem(params);
    return { success: true, data: result.Attributes };
  } catch (error: any) {
    if (error.name === 'ConditionalCheckFailedException') {
      return { success: false, code: 'NOT_FOUND', message: 'Currency not found' };
    }
    return { success: false, code: 'DB_ERROR', message: error.message };
  }
};
