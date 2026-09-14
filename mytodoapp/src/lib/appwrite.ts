import "react-native-url-polyfill/auto";

import {
  Client,
  Account,
  TablesDB
} from "react-native-appwrite";

const client = new Client();

client
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("6a9f03c30034a2e44b2d")
  .setPlatform("com.mytodoapp.com");

  // Used to create accounts on appwrite
export const account = new Account(client);
// Used to create tables on Appwrite
export const tablesDB = new TablesDB(client);

export const DATABASE_ID = "6aa82063000559993a0d";
export const TASKS_TABLE_ID = "6aa820a40013214a4974";