// @ts-nocheck
export function runShellCommand(command: string): Promise<string | null> {
  logger.log(`Running command: ${command}`);
  return new Promise((resolve) => {
    let output = ``;
    const process = spawn(command, {
      shell: true,
      stdio: [`ignore`, `pipe`, `pipe`],
    });
    process.stdout?.on(`data`, (data) => {
      output += data.toString();
    });
    process.stderr?.on(`data`, (data) => {
      logger.warn(`Stderr from '${command}': ${data.toString().trim()}`);
    });
    process.on(`error`, (error) => {
      logger.error(`Error executing command '${command}':`, error.message);
      resolve(null);
    });
    process.on(`close`, (code) => {
      if (code === 0) {
        logger.debug(
          `Command '${command}' succeeded with code ${code}: ${output.trim()}`,
        );
        resolve(output.trim());
      } else {
        logger.error(`Command '${command}' failed with code ${code}`);
        resolve(null);
      }
    });
  });
}