import { Link } from "expo-router";
import { useState } from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  // Creates temporary memory to be used later
  const [task, setTask] =useState("")
  return (
    // Controls what you see on screen, its like a fragment
    <View style={styles.container}>
      {/* Text is the tag for texts */}
      <Text style={styles.title}>
            My Tasks
      </Text>
      <Text style={styles.subtitle}>
        What needs doing??
        <TextInput style={styles.input} placeholder="Enter a task" value={task} onChangeText={setTask}/>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Add  Task</Text>
        </TouchableOpacity>

        <Text style={styles.preview}>{task}</Text>
      </Text>
      {/* <Text style={styles.subtitle}>
        I have no taskks yet
      </Text> */}
      <Link href="/register">
      Create Account
      </Link>
    </View>
    
  );
}

// acts as css file for the current page file
const styles = StyleSheet.create({
  container:{
    // Makes content fit entire screen
    flex:1,
    // puts padding around the screen
    padding:24,
    // puts content at the center of the screen
    justifyContent:'center'
  },
  title:{
    fontSize:32,
    fontWeight:'bold',
    

  },
  subtitle:{
    fontSize:8,
    marginTop:8,
  },
  input:{
    borderWidth:1,
    borderColor:"#cccccc",
    borderRadius:10,
    padding:14,
    fontSize:16,
  },
  button:{
    backgroundColor:"#111111",
    padding:14,
    borderRadius:10,
    marginTop:12,
    alignItems:"center",
  },
  buttonText:{
    color:'#ffffff',
    fontSize:16,
    fontWeight:'bold'
  },
  preview:{
    marginTop:20,
    fontSize:18,
  }

})


