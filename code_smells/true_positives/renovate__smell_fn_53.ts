// @ts-nocheck
async function parseExtractedPackageIndex(
  extractedFile: string,
  _lastTimestamp: Date,
): Promise<Record<string, PackageDescription[]>> {
  const rl = readline.createInterface({
    input: fs.createCacheReadStream(extractedFile),
    terminal: false,
  });
  let currentPackage: PackageDescription = {};
  const allPackages: Record<string, PackageDescription[]> = {};
  for await (const line of rl) {
    if (line === '') {
      if (requiredPackageKeys.every((key) => key in currentPackage)) {
        if (!allPackages[currentPackage.Package!]) {
          allPackages[currentPackage.Package!] = [];
        }
        allPackages[currentPackage.Package!].push(currentPackage);
        currentPackage = {};
      }
    } else {
      for (const key of packageKeys) {
        if (line.startsWith(`${key}:`)) {
          currentPackage[key] = line.substring(key.length + 1).trim();
          break;
        }
      }
    }
  }
  if (requiredPackageKeys.every((key) => key in currentPackage)) {
    if (!allPackages[currentPackage.Package!]) {
      allPackages[currentPackage.Package!] = [];
    }
    allPackages[currentPackage.Package!].push(currentPackage);
  }
  return allPackages;
}