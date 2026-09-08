import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { account } from '@/lib/appwrite';
import { Link, router } from 'expo-router';

export default function LoginScreen() {
    const [email, setEmail]= useState('');
    const [password, setPassword]= useState('');
    const [message, setMessage]= useState('');

    async function login()
    {
        try{
            setMessage("");

            await account.createEmailPasswordSession({
                email,
                password
            });

            const user = await account.get();

            console.log("Logged in user: ",user);

            router.replace("/");

        }
        catch(error:any)
        {
            console.log("Login Error:",error);

            setMessage(error.message);
        }
    }
  return (
    <View>
      <Text>login</Text>
      <TextInput placeholder='Email'value={email} onChangeText={setEmail} autoCapitalize='none' keyboardType='email-address'/>
      <TextInput placeholder='Password' value={password} onChangeText={setPassword} secureTextEntry/>

      <TouchableOpacity onPress={login}>
        <Text>
            Login
        </Text>
      </TouchableOpacity>
      {message ?<Text>{message}</Text>:null}

      <Link href="/register">
            Don't have an account?Register
            </Link>
    </View>
  )
}