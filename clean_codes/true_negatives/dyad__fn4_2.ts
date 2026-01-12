// @ts-nocheck
return new Promise<void>((resolve) => {
  const timeout = setTimeout(() => {
    console.warn(
      `Timeout waiting for process (PID: ${process.pid}) to close. Force killing may be needed.`,
    );
    resolve();
  }, 5000);
  process.on(`close`, (code, signal) => {
    clearTimeout(timeout);
    console.log(
      `Received 'close' event for process (PID: ${process.pid}) with code ${code}, signal ${signal}.`,
    );
    resolve();
  });
  process.on(`error`, (err) => {
    clearTimeout(timeout);
    console.error(
      `Error during stop sequence for process (PID: ${process.pid}): ${err.message}`,
    );
    resolve();
  });
  if (process.pid) {
    console.log(
      `Attempting to tree-kill process tree starting at PID ${process.pid}.`,
    );
    treeKill(process.pid, `SIGTERM`, (err: Error | undefined) => {
      if (err) {
        console.warn(
          `tree-kill error for PID ${process.pid}: ${err.message}`,
        );
      } else {
        console.log(
          `tree-kill signal sent successfully to PID ${process.pid}.`,
        );
      }
    });
  } else {
    console.warn(`Cannot tree-kill process: PID is undefined.`);
  }
});