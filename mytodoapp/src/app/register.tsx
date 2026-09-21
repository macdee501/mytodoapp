import { View, Text, Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

import { ID } from 'react-native-appwrite';
import { account } from '@/lib/appwrite';
import { Link } from 'expo-router';

export default function register() {

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [message,setMessage] = useState("");

    // asynchrous function that runs while the button is pressed
    async function handleRegister() {
        // if fields are empty return error
        if(!name || !email|| !password)
        {
            Alert.alert("Error","Please fill in all fields");
            return;
        }

        //  if fields a filled try to create account
        try{
            await account.create({
                userId:ID.unique(),
                email:email,
                password:password,
                name:name,

            });

            // account created create a logged in session
            await account.createEmailPasswordSession({
                email:email,
                password:password,
            });

            const user = await account.get();

            Alert.alert("Success",`Welcome ${user.name}`);


        }

        catch(error:any){
            Alert.alert("Registration",error.message);
            setMessage(error.message);
        }
        
    }
    
  return (
    <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>

      <Text style={styles.title}>
        Create Account
      </Text>

      <Text style={styles.subtitle}>
        Sign Up to start managing your tasks
      </Text>
        </View>


        {/* Form */}
        <View style={styles.form}>

      <TextInput style={styles.input} placeholder='Name' value={name} onChangeText={setName}/>
      <TextInput style={styles.input} placeholder='Email' value={email} onChangeText={setEmail} keyboardType='email-address' autoCapitalize='none'/>
      <TextInput style={styles.input} placeholder='Password' value={password} onChangeText={setPassword} secureTextEntry/>

      <TouchableOpacity style={styles.button} onPress={handleRegister} activeOpacity={0.8}>
        <Text style={styles.buttonText}>
            Create Account
        </Text>
      </TouchableOpacity>

      {message ? (<Text style={styles.errorText}>{message}</Text>): null}
      {/* Login Link */}
      <View style={styles.loginContainer}>

      <Link href="/login" style={styles.loginLink}>
      Already  have an account? Login
      </Link>
      </View>
        </View>

    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        paddingHorizontal:24,
        backgroundColor:"#F5F7FA",
    },
    header:{

        marginBottom:32,
    },
    title:{
        fontSize:36,
        fontWeight:"bold",
        color:"#111827",
    },
    subtitle:{

        fontSize:16,
        color:"#6B7280",
        marginTop:8,
    },
    form:{
        width:"100%"
    },
    input:{
        borderWidth:1,
        borderColor:"#FFFFFF",
        borderRadius:12,
        paddingHorizontal:16,
        paddingVertical:15,
        marginBottom:12,
        fontSize:16,
        color:"#111827",

    },
    button:{
        backgroundColor:"#000000",
        borderRadius:12,
        paddingVertical:16,
        alignItems:"center",
        marginTop:24,
    },
    buttonText:{
        color:"#ffffff",
        fontSize:16,
        fontWeight:"bold",
    },
    errorText:{
        color:"#DC2626",
        fontSize:14,
        textAlign:"center",
        marginTop:14
    },
    loginContainer:{
        flexDirection:"row",
        justifyContent:"center",
        marginTop:24
    }

})