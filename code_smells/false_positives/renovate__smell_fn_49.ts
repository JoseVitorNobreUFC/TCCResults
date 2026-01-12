// @ts-nocheck
export async function getJavaConstraint(
  gradleVersion: string | null | undefined,
  gradlewFile: string,
): Promise<string> {
  const major = gradleVersion ? gradleVersioning.getMajor(gradleVersion) : null;
  const minor = gradleVersion ? gradleVersioning.getMinor(gradleVersion) : null;
  if (major) {
    if (major > 8 || (major === 8 && minor && minor >= 8)) {
      const toolChainVersion = await getJvmConfiguration(gradlewFile);
      if (toolChainVersion) {
        return `^${toolChainVersion}.0.0`;
      }
    }
    if (major > 6 || (major === 6 && minor && minor >= 7)) {
      const languageVersion = await getJavaLanguageVersion(gradlewFile);
      if (languageVersion) {
        return `^${languageVersion}.0.0`;
      }
    }
    if (major > 8 || (major === 8 && minor && minor >= 5)) {
      return '^21.0.0';
    }
    if (major > 7 || (major === 7 && minor && minor >= 3)) {
      return '^17.0.0';
    }
    if (major === 7) {
      return '^16.0.0';
    }
    if (major > 0 && major < 5) {
      return '^8.0.0';
    }
  }
  return '^11.0.0';
}