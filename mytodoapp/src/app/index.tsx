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
    <View>
      <Text style={styles.welcome}>
        Welcome, {user?.name}
      </Text>

      <Text style={styles.title}>
        My Tasks
      </Text>

      <Text style={styles.subtitle}>
        What needs doing today?
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a task..."
        placeholderTextColor="#9CA3AF"
        value={task}
        onChangeText={setTask}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={createTask}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>
          + Add Task
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tasksButton}
        onPress={() => router.push("/tasks")}
        activeOpacity={0.8}
      >
        <Text style={styles.tasksButtonText}>
          View My Tasks
        </Text>
      </TouchableOpacity>
    </View>

    <TouchableOpacity
      style={styles.logoutButton}
      onPress={logout}
    >
      <Text style={styles.logoutText}>
        Logout
      </Text>
    </TouchableOpacity>
  </View>
);
}

const styles = StyleSheet.create({
  /**
   * Main screen container.
   */
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 30,
  },

  /**
   * Small greeting displayed above the page title.
   */
  welcome: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 6,
  },

  /**
   * Main heading.
   */
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#111827",
  },

  /**
   * Supporting text underneath the title.
   */
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 6,
    marginBottom: 28,
  },

  /**
   * Input used to enter a new task.
   */
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    color: "#111827",
  },

  /**
   * Main action button used to create a task.
   */
  addButton: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 14,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  /**
   * Secondary button used to open the task list.
   */
  tasksButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },

  tasksButtonText: {
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "600",
  },

  /**
   * Pushes the logout option toward the bottom
   * of the screen.
   */
  logoutButton: {
    marginTop: "auto",
    alignItems: "center",
    paddingVertical: 14,
  },

  logoutText: {
    color: "#DC2626",
    fontSize: 16,
    fontWeight: "500",
  },
});