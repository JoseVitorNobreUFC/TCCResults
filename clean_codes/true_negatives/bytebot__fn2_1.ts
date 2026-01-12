// @ts-nocheck
async function handleCron() {
  const now = new Date();
  const scheduledTasks = await this.tasksService.findScheduledTasks();
  for (const scheduledTask of scheduledTasks) {
    if (scheduledTask.scheduledFor && scheduledTask.scheduledFor < now) {
      this.logger.debug(
        `Task ID: ${scheduledTask.id} is scheduled for ${scheduledTask.scheduledFor}, queuing it`,
      );
      await this.tasksService.update(scheduledTask.id, {
        queuedAt: now,
      });
    }
  }
  if (this.agentProcessor.isRunning()) {
    return;
  }
  const task = await this.tasksService.findNextTask();
  if (task) {
    if (task.files.length > 0) {
      this.logger.debug(
        `Task ID: ${task.id} has files, writing them to the desktop`,
      );
      for (const file of task.files) {
        await writeFile({
          path: `/home/user/Desktop/${file.name}`,
          content: file.data,
        });
      }
    }
    await this.tasksService.update(task.id, {
      status: TaskStatus.RUNNING,
      executedAt: new Date(),
    });
    this.logger.debug(`Processing task ID: ${task.id}`);
    this.agentProcessor.processTask(task.id);
  }
}