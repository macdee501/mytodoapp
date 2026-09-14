import { account, tablesDB, DATABASE_ID, TASKS_TABLE_ID } from "@/lib/appwrite";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  Models,
  ID,
  Permission,
  Role,
} from "react-native-appwrite";

export default function HomeScreen() {
  /**
   * Stores the text currently entered in the task input.
   *
   * `task` contains the current value.
   * `setTask` updates that value.
   */
  const [task, setTask] = useState("");

  /**
   * Stores the currently logged-in Appwrite user.
   *
   * It starts as `null` because we do not know who the user is
   * until Appwrite checks the current session.
   */
  const [user, setUser] =
    useState<Models.User<Models.Preferences> | null>(null);

  /**
   * Used while checking whether the user has an active session.
   *
   * This prevents the home screen from appearing before
   * authentication has been verified.
   */
  const [loading, setLoading] = useState(true);

  /**
   * Runs once when the Home screen first loads.
   *
   * The empty dependency array [] means this effect runs
   * only when the component is first mounted.
   */
  useEffect(() => {
    checkUser();
  }, []);

  /**
   * Checks whether there is currently an authenticated Appwrite user.
   *
   * If a valid session exists:
   * - The user information is stored in state.
   *
   * If no valid session exists:
   * - The user is redirected to the Login screen.
   */
  async function checkUser() {
    try {
      const currentUser = await account.get();

      setUser(currentUser);
    } catch (error) {
      console.log("User session check failed:", error);

      router.replace("/login");
    } finally {
      // Stop showing the loading state whether the request succeeds or fails.
      setLoading(false);
    }
  }

  /**
   * Logs out the currently authenticated user.
   *
   * "current" tells Appwrite to delete the session
   * belonging to the user on this device.
   *
   * After logout, the user is redirected to the Login screen.
   */
  async function logout() {
    try {
      await account.deleteSession({
        sessionId: "current",
      });

      router.replace("/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  }

  /**
   * Creates a new task in the Appwrite Tasks table.
   *
   * Before creating the task we verify that:
   * 1. The user entered a task title.
   * 2. A user is currently logged in.
   *
   * Each task also receives row-level permissions so that
   * only the user who created it can read, update or delete it.
   */
  async function createTask() {
    // Remove surrounding spaces and stop if the input is empty.
    if (!task.trim()) {
      return;
    }

    // A task should never be created without an authenticated user.
    if (!user) {
      return;
    }

    try {
      const newTask = await tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: TASKS_TABLE_ID,

        // Generate a unique Appwrite ID for this task.
        rowId: ID.unique(),

        /**
         * Data that will be stored in the task row.
         *
         * userId:
         * Links the task to the user who created it.
         *
         * title:
         * Contains the text entered in the task input.
         *
         * completed:
         * New tasks begin as incomplete.
         */
        data: {
          userId: user.$id,
          title: task.trim(),
          completed: false,
        },

        /**
         * Row-level permissions.
         *
         * Only the owner of this task may:
         * - Read it
         * - Update it
         * - Delete it
         */
        permissions: [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ],
      });

      console.log("Task created:", newTask);

      // Clear the input after the task has been created successfully.
      setTask("");
    } catch (error) {
      console.log("Create task error:", error);
    }
  }

  /**
   * Show a temporary loading screen while Appwrite
   * checks the user's authentication session.
   */
  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Display the logged-in user's name. */}
      <Text>Welcome {user?.name}</Text>

      <Text style={styles.title}>
        My Tasks
      </Text>

      <Text style={styles.subtitle}>
        What needs doing?
      </Text>

      {/* Input used to enter a new task title. */}
      <TextInput
        style={styles.input}
        placeholder="Enter a task"
        value={task}
        onChangeText={setTask}
      />

      {/* Creates a task using the value stored in `task`. */}
      <TouchableOpacity
        style={styles.button}
        onPress={createTask}
      >
        <Text style={styles.buttonText}>
          Add Task
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/tasks")}>
          <Text>View My Tasks</Text>
      </TouchableOpacity>

      {/* Temporary preview showing what is currently being typed. */}
      <Text style={styles.preview}>
        {task}
      </Text>

      {/* Ends the current Appwrite session. */}
      <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Styles used only by this screen.
 *
 * We can replace or improve these later when we begin
 * the dedicated UI/styling phase of the project.
 */
const styles = StyleSheet.create({
  container: {
    // Fill all available screen space.
    flex: 1,

    // Add space between the content and screen edges.
    padding: 24,

    // Position the screen content vertically in the center.
    justifyContent: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 16,
    marginTop: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#111111",
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },

  preview: {
    marginTop: 20,
    fontSize: 18,
  },
});