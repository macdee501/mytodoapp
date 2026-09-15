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
    backgroundColor: "#F5F7FA",
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
    color: "#111827",
  },

  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
  },

  /**
   * Allows the task cards to scroll
   * when the list becomes long.
   */
  taskList: {
    flex: 1,
  },

  /**
   * Individual task card.
   */
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
  },

  /**
   * Slightly muted appearance for
   * completed tasks.
   */
  completedCard: {
    backgroundColor: "#F9FAFB",
  },

  taskTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },

  /**
   * Completed titles are crossed out
   * while remaining visible for history.
   */
  completedTitle: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },

  /**
   * Shared status styling.
   */
  status: {
    fontSize: 14,
    marginTop: 6,
    marginBottom: 14,
  },

  activeStatus: {
    color: "#6B7280",
  },

  completedStatus: {
    color: "#16A34A",
  },

  /**
   * Primary action for completing
   * an active task.
   */
  completeButton: {
    backgroundColor: "#2563EB",
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
   * Completed tasks get a secondary-style
   * button for restoring them.
   */
  incompleteButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#2563EB",
  },

  incompleteButtonText: {
    color: "#2563EB",
  },

  /**
   * Empty state shown when there
   * are no tasks.
   */
  emptyContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },

  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 6,
  },

  /**
   * Back button at the bottom of the screen.
   */
  backButton: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },

  backButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },

  /**
   * Loading screen styles.
   */
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
});