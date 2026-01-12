// @ts-nocheck
export function safeJoin(basePath: string, ...paths: string[]): string {
  for (const pathSegment of paths) {
    if (path.isAbsolute(pathSegment)) {
      throw new Error(
        `Unsafe path: joining '${paths.join(`, `)}' with base '${basePath}' would escape the base directory`,
      );
    }
    if (pathSegment.startsWith(`~/`)) {
      throw new Error(
        `Unsafe path: joining '${paths.join(`, `)}' with base '${basePath}'' would escape the base directory`,
      );
    }
    if (/^[A-Za-z]:[/\\]/.test(pathSegment)) {
      throw new Error(
        `Unsafe path: joining '${paths.join(`, `)}' with base '${basePath}' would escape the base directory`,
      );
    }
    if (pathSegment.startsWith(`\\\\`)) {
      throw new Error(
        `Unsafe path: joining '${paths.join(`, `)}' with base '${basePath}' would escape the base directory`,
      );
    }
  }
  const joinedPath = path.join(basePath, ...paths);
  const resolvedBasePath = path.resolve(basePath);
  const resolvedJoinedPath = path.resolve(joinedPath);
  const relativePath = path.relative(resolvedBasePath, resolvedJoinedPath);
  if (relativePath.startsWith(`..`) || path.isAbsolute(relativePath)) {
    throw new Error(
      `Unsafe path: joining '${paths.join(`, `)}' with base '${basePath}' would escape the base directory`,
    );
  }
  return joinedPath;
}