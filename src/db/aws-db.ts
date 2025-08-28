//src/db/aws-db.ts
import { PutCommand, ScanCommand, GetCommand, UpdateCommand, QueryCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient } from "../utils/dynamoClients";

export const putItem = async (params: any) => {
  return await ddbDocClient.send(new PutCommand(params));
};

export const scanItems = async (params: any) => {
  return await ddbDocClient.send(new ScanCommand(params));
};

export const getItem = async (params: any) => {
  return await ddbDocClient.send(new GetCommand(params));
};

export const updateItem = async (params: any) => {
  return await ddbDocClient.send(new UpdateCommand(params));
};

export const queryItems = async (params: any) => {
  return await ddbDocClient.send(new QueryCommand(params));
};

export const transactWrite = async (params: any) => {
  return await ddbDocClient.send(new TransactWriteCommand(params));
};
