// @ts-nocheck
export function handleRegistryContent(ctx: Ctx): Ctx {
  const methodName = loadFromTokenMap(ctx, 'methodName')[0].value;
  let groupId = loadFromTokenMap(ctx, 'groupId')[0].value;
  let matcher: ContentDescriptorMatcher = 'simple';
  if (methodName.includes('Regex')) {
    matcher = 'regex';
    groupId = `^${groupId}$`.replaceAll('\\\\', '\\');
    if (!isValidContentDescriptorRegex('group', groupId)) {
      return ctx;
    }
  } else if (methodName.includes('AndSubgroups')) {
    matcher = 'subgroup';
  }
  const mode = methodName.startsWith('include') ? 'include' : 'exclude';
  const spec: ContentDescriptorSpec = { mode, matcher, groupId };
  if (methodName.includes('Module') || methodName.includes('Version')) {
    spec.artifactId = loadFromTokenMap(ctx, 'artifactId')[0].value;
    if (matcher === 'regex') {
      spec.artifactId = `^${spec.artifactId}$`.replaceAll('\\\\', '\\');
      if (!isValidContentDescriptorRegex('module', spec.artifactId)) {
        return ctx;
      }
    }
  }
  if (methodName.includes('Version')) {
    spec.version = loadFromTokenMap(ctx, 'version')[0].value;
    if (matcher === 'regex') {
      spec.version = `^${spec.version}$`.replaceAll('\\\\', '\\');
      if (!isValidContentDescriptorRegex('version', spec.version)) {
        return ctx;
      }
    }
  }
  ctx.tmpRegistryContent.push(spec);
  return ctx;
}