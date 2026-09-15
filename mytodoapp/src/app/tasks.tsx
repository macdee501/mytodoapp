import { View, Text, TouchableOpacity, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { account, DATABASE_ID, tablesDB, TASKS_TABLE_ID } from '@/lib/appwrite';
import { router } from 'expo-router';

export default function tasksScreen() {

    /**
   * Stores all tasks retrieved from Appwrite.
   */
    const [tasks,setTasks] = useState<any[]>([]);
    /**
   * Shows a loading message while tasks are being fetched.
   */
  const [loading, setLoading] = useState(true);
    /**
   * Runs when this screen first opens.
   */
  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      // Make sure there is an active logged-in user.
      await account.get();

      const response = await tablesDB.listRows({
        databaseId: DATABASE_ID,
        tableId: TASKS_TABLE_ID,
      });

      // Store the returned rows in React state.
      setTasks(response.rows);
    } catch (error) {
      console.log("Load tasks error:", error);

      // If the user has no valid session, return to Login.
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }

  async function updateTask(taskId:string,currentStatus:boolean) {
    try{
      await tablesDB.updateRow({
        databaseId:DATABASE_ID,
        tableId:TASKS_TABLE_ID,
        rowId:taskId,
        data:{
          completed:!currentStatus,
        }
      });

      await loadTasks();
    }
    catch(error)
    {
      console.log("Update task error:",error);
    }
    
  }

  /**
   * Display a temporary message while Appwrite loads the data.
   */
  if (loading) {
    return (
      <View>
        <Text>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View>
       <Text>My Tasks</Text>

      {tasks.length === 0 ? (
        <Text>No tasks yet.</Text>
      ) : (
        tasks.map((item) => (
          <View key={item.$id}>
            <Text>{item.title}</Text>
            <Text>
              {item.completed ? "Completed" : "Not completed"}
            </Text>
            <Button
      title={item.completed ? "Mark Incomplete" : "Mark Complete"}
      onPress={() =>
        updateTask(item.$id, item.completed)
      }
    />

          </View>
        ))
      )}

       <Button
        title="Back"
        onPress={() => router.back()}
      />

    </View>
  )
}