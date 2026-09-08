import { View, Text, Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

import { ID } from 'react-native-appwrite';
import { account } from '@/lib/appwrite';
import { Link } from 'expo-router';

export default function register() {

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

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
        }
        
    }
    
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Create Account
      </Text>

      <TextInput style={styles.input} placeholder='Name' value={name} onChangeText={setName}/>
      <TextInput style={styles.input} placeholder='Email' value={email} onChangeText={setEmail} keyboardType='email-address' autoCapitalize='none'/>
      <TextInput style={styles.input} placeholder='Password' value={password} onChangeText={setPassword} secureTextEntry/>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>
            Register
        </Text>
      </TouchableOpacity>
      <Link href="/login">
      Already  have an account? Login
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        padding:24,
    },
    title:{
        fontSize:32,
        fontWeight:"bold",
        marginBottom:24,
    },
    input:{
        borderWidth:1,
        borderColor:"#cccccc",
        borderRadius:8,
        padding:14,
        marginBottom:12,
        fontSize:16,

    },
    button:{
        backgroundColor:"#000000",
        padding:16,
        borderRadius:8,
        alignItems:"center",
        marginTop:8,
    },
    buttonText:{
        color:"#ffffff",
        fontSize:16,
        fontWeight:"bold",
    }

})