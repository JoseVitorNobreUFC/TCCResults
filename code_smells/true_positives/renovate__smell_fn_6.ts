// @ts-nocheck
  async function processGroupBlock(
    line: string,
    repositoryUrl?: string,
    trimGroupLine = false,
  ): Promise<void> {
    const groupMatch = regEx(/^group\s+(.*?)\s+do/).exec(line);
    if (groupMatch) {
      const depTypes = groupMatch[1]
        .split(',')
        .map((group) => group.trim())
        .map((group) => group.replace(regEx(/^:/), ''));
      const groupLineNumber = lineNumber;
      let groupContent = '';
      let groupLine = '';
      while (
        lineNumber < lines.length &&
        (trimGroupLine ? groupLine.trim() !== 'end' : groupLine !== 'end')
      ) {
        lineNumber += 1;
        groupLine = lines[lineNumber];
        if (!isString(groupLine)) {
          logger.debug(
            { content, packageFile, type: 'groupLine' },
            'Bundler parsing error',
          );
          groupLine = 'end';
        }
        if (trimGroupLine ? groupLine.trim() !== 'end' : groupLine !== 'end') {
          groupContent += formatContent(groupLine);
        }
      }
      const groupRes = await extractPackageFile(groupContent);
      if (groupRes) {
        res.deps = res.deps.concat(
          groupRes.deps.map((dep) => {
            const depObject = {
              ...dep,
              depTypes,
              managerData: {
                lineNumber:
                  Number(dep.managerData?.lineNumber) + groupLineNumber + 1,
              },
            };
            if (repositoryUrl) {
              depObject.registryUrls = [repositoryUrl];
            }
            return depObject;
          }),
        );
      }
    }
  }