import "react-native-url-polyfill/auto";

import {
  Client,
  Account,
} from "react-native-appwrite";

const client = new Client();

client
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("6a9f03c30034a2e44b2d")
  .setPlatform("com.mytodoapp.com");

export const account = new Account(client);