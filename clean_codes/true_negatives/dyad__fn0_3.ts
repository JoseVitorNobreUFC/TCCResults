// @ts-nocheck
export async function executeAddDependency({
  packages,
  message,
  appPath,
}: {
  packages: string[];
  message: Message;
  appPath: string;
}) {
  const packageStr = packages.join(` `);
  const { stdout, stderr } = await execPromise(
    `(pnpm add ${packageStr}) || (npm install --legacy-peer-deps ${packageStr})`,
    {
      cwd: appPath,
    },
  );
  const installResults = stdout + (stderr ? `\n${stderr}` : ``);
  const updatedContent = message.content.replace(
    new RegExp(
      `<dyad-add-dependency packages='${packages.join(
        ` `,
      )}'>[^<]*</dyad-add-dependency>`,
      `g`,
    ),
    `<dyad-add-dependency packages='${packages.join(
      ` `,
    )}'>${installResults}</dyad-add-dependency>`,
  );
  await db
    .update(messages)
    .set({ content: updatedContent })
    .where(eq(messages.id, message.id));
}