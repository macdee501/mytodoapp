import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import React, { useEffect, useState } from "react";
import {
  account,
  DATABASE_ID,
  tablesDB,
  TASKS_TABLE_ID,
} from "@/lib/appwrite";
import { router } from "expo-router";

export default function TasksScreen() {
  /**
   * Stores all tasks retrieved from Appwrite.
   */
  const [tasks, setTasks] = useState<any[]>([]);

  /**
   * Tracks whether tasks are currently being loaded.
   */
  const [loading, setLoading] = useState(true);

  /**
   * Runs once when the screen first opens.
   */
  useEffect(() => {
    loadTasks();
  }, []);

  /**
   * Checks that a valid user session exists,
   * then retrieves the user's tasks from Appwrite.
   */
  async function loadTasks() {
    /**
     * First check authentication.
     *
     * Only redirect to Login if the user's
     * Appwrite session is no longer valid.
     */
    try {
      await account.get();
    } catch (error) {
      console.log("Authentication error:", error);

      router.replace("/login");
      return;
    }

    /**
     * Retrieve tasks separately.
     *
     * A database error should not automatically
     * be treated as a login error.
     */
    try {
      const response = await tablesDB.listRows({
        databaseId: DATABASE_ID,
        tableId: TASKS_TABLE_ID,
      });

      setTasks(response.rows);
    } catch (error) {
      console.log("Load tasks error:", error);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Toggles the completed status of a task.
   *
   * false becomes true
   * true becomes false
   */
  async function updateTask(
    taskId: string,
    currentStatus: boolean
  ) {
    try {
      await tablesDB.updateRow({
        databaseId: DATABASE_ID,
        tableId: TASKS_TABLE_ID,
        rowId: taskId,

        data: {
          completed: !currentStatus,
        },
      });

      /**
       * Reload the tasks after updating so
       * the UI displays the new status.
       */
      await loadTasks();
    } catch (error) {
      console.log("Update task error:", error);
    }
  }

  /**
   * Show a loading screen while Appwrite
   * retrieves the tasks.
   */
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          Loading tasks...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Screen header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          My Tasks
        </Text>

        <Text style={styles.subtitle}>
          {tasks.length}{" "}
          {tasks.length === 1 ? "task" : "tasks"}
        </Text>
      </View>

      {/* Scrollable task list */}
      <ScrollView
        style={styles.taskList}
        showsVerticalScrollIndicator={false}
      >
        {tasks.length === 0 ? (
          /**
           * Displayed when the user has
           * not created any tasks yet.
           */
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              No tasks yet
            </Text>

            <Text style={styles.emptyText}>
              Create a task from the home screen.
            </Text>
          </View>
        ) : (
          tasks.map((item) => (
            <View
              key={item.$id}
              style={[
                styles.taskCard,

                /**
                 * Completed tasks receive a slightly
                 * different appearance.
                 */
                item.completed && styles.completedCard,
              ]}
            >
              {/* Task title */}
              <Text
                style={[
                  styles.taskTitle,
                  item.completed && styles.completedTitle,
                ]}
              >
                {item.title}
              </Text>

              {/* Current status */}
              <Text
                style={[
                  styles.status,
                  item.completed
                    ? styles.completedStatus
                    : styles.activeStatus,
                ]}
              >
                {item.completed
                  ? "Completed"
                  : "Not completed"}
              </Text>

              {/* Complete / incomplete button */}
              <TouchableOpacity
                style={[
                  styles.completeButton,
                  item.completed &&
                    styles.incompleteButton,
                ]}
                onPress={() =>
                  updateTask(
                    item.$id,
                    item.completed
                  )
                }
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.completeButtonText,
                    item.completed &&
                      styles.incompleteButtonText,
                  ]}
                >
                  {item.completed
                    ? "Mark Incomplete"
                    : "Mark Complete"}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Return to Home screen */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>
          Back
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  /**
   * Main page container.
   */
  container: {
    flex: 1,
    backgroundColor: "#F4F4F5",
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 30,
  },

  /**
   * Header section.
   */
  header: {
    marginBottom: 24,
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#111111",
    letterSpacing: -1,
  },

  subtitle: {
    fontSize: 16,
    color: "#71717A",
    marginTop: 4,
  },

  /**
   * Allows the task list to scroll
   * when there are many tasks.
   */
  taskList: {
    flex: 1,
  },

  /**
   * Standard task card.
   */
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
  },

  /**
   * Completed tasks look slightly muted
   * while still remaining visible.
   */
  completedCard: {
    backgroundColor: "#F4F4F5",
    borderColor: "#D4D4D8",
  },

  taskTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111111",
  },

  /**
   * Completed task titles are crossed out
   * and shown in muted gray.
   */
  completedTitle: {
    textDecorationLine: "line-through",
    color: "#A1A1AA",
  },

  /**
   * Shared task status styling.
   */
  status: {
    fontSize: 14,
    marginTop: 6,
    marginBottom: 14,
  },

  activeStatus: {
    color: "#71717A",
  },

  completedStatus: {
    color: "#52525B",
  },

  /**
   * Primary action used to complete a task.
   */
  completeButton: {
    backgroundColor: "#111111",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },

  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  /**
   * Completed tasks use a secondary button
   * for changing them back to incomplete.
   */
  incompleteButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#18181B",
  },

  incompleteButtonText: {
    color: "#18181B",
  },

  /**
   * Empty state shown when there
   * are no tasks.
   */
  emptyContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111111",
  },

  emptyText: {
    fontSize: 14,
    color: "#71717A",
    marginTop: 6,
    textAlign: "center",
  },

  /**
   * Back button at the bottom.
   */
  backButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D4D4D8",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },

  backButtonText: {
    color: "#18181B",
    fontSize: 16,
    fontWeight: "600",
  },

  /**
   * Loading screen styles.
   */
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F4F4F5",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    fontSize: 16,
    color: "#71717A",
  },
});
