import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
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
    <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
            <Text style={styles.title}>
                Welcome Back
            </Text>
            <Text style={styles.subtitle}>Sign in to continue to your tasks</Text>

        </View>

        {/* Login Form */}
        <View style={styles.form}>

      <TextInput placeholder='Email'value={email} onChangeText={setEmail} autoCapitalize='none' keyboardType='email-address' style={styles.input}/>
      <TextInput placeholder='Password' value={password} onChangeText={setPassword} secureTextEntry style={styles.input}/>

      <TouchableOpacity 
      onPress={login} 
      style={styles.loginButton}>
        <Text style={styles.loginButtonText}>
            Login 
        </Text>
      </TouchableOpacity>
      {message ?<Text style={styles.ErrorText}>{message}</Text>:null}

      <Link href="/register" style={styles.registerText}>
            Don't have an account?Register
            </Link>
        </View>

    </View>
  )
}

const styles = StyleSheet.create({

    container:{
        flex:1,
        backgroundColor:"#F5F7FA",
        paddingHorizontal:24,
        justifyContent:"center"
    },
    header:{
        marginBottom:32
    },
    title:{
        fontSize:36,
        color:"#111827",
        fontWeight:"bold",
    },
    subtitle:{
        fontSize:16,
        color:"#6B7280",
        marginTop:8
    },
    form:{
        width:"100%",
    },
    input:{
        backgroundColor:"#FFFFFF",
        borderWidth:1,
        borderColor:"#E5E7EB",
        borderRadius:12,
        paddingHorizontal:16,
        paddingVertical:15,
        fontSize:16,
        color:"#111827",

    },
    loginButton:{
         backgroundColor: "#111827",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
    },
    loginButtonText:{
        color:"#FFFFFF",
        fontSize:14,
        fontWeight:"600"
    },
     ErrorText: {
    color: "#DC2626",
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },

  registerText: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 24,
  },


    
})