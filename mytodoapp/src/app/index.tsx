import { Text, View, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    // Controls what you see on screen, its like a fragment
    <View style={styles.container}>
      {/* Text is the tag for texts */}
      <Text style={styles.title}>
            My Tasks
      </Text>
      <Text style={styles.subtitle}>
        I have no taskks yet
      </Text>
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
  }
})


