// @ts-nocheck
export async function fetchTaskCounts(): Promise<Record<string, number>> {
  try {
    const allTasksResult = await fetchTasks();
    const statusGroups = {
      ALL: Object.values(TaskStatus),
      ACTIVE: [TaskStatus.PENDING, TaskStatus.RUNNING, TaskStatus.NEEDS_HELP, TaskStatus.NEEDS_REVIEW],
      COMPLETED: [TaskStatus.COMPLETED],
      CANCELLED_FAILED: [TaskStatus.CANCELLED, TaskStatus.FAILED],
    };
    const counts: Record<string, number> = {
      ALL: allTasksResult.total,
      ACTIVE: 0,
      COMPLETED: 0,
      CANCELLED_FAILED: 0,
    };
    const groupPromises = Object.entries(statusGroups).map(async ([groupKey, statuses]) => {
      if (groupKey === 'ALL') {
        return { groupKey, count: allTasksResult.total };
      }
      const result = await fetchTasks({ statuses, limit: 1 });
      return { groupKey, count: result.total };
    });
    const groupCounts = await Promise.all(groupPromises);
    groupCounts.forEach(({ groupKey, count }) => {
      counts[groupKey] = count;
    });
    return counts;
  } catch (error) {
    console.error(`Failed to fetch task counts:`, error);
    return {
      ALL: 0,
      ACTIVE: 0,
      COMPLETED: 0,
      CANCELLED_FAILED: 0,
    };
  }
}