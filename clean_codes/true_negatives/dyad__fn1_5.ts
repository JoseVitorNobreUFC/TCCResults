// @ts-nocheck
async (
  _,
  { name, appId }: CreateNeonProjectParams,
): Promise<NeonProject> => {
  const neonClient = await getNeonClient();
  logger.info(`Creating Neon project: ${name} for app ${appId}`);
  try {
    const orgId = await getNeonOrganizationId();
    const response = await retryOnLocked(
      () =>
        neonClient.createProject({
          project: {
            name: name,
            org_id: orgId,
          },
        }),
      `Create project ${name} for app ${appId}`,
    );
    if (!response.data.project) {
      throw new Error(
        `Failed to create project: No project data returned.`,
      );
    }
    const project = response.data.project;
    const developmentBranch = response.data.branch;
    const previewBranchResponse = await retryOnLocked(
      () =>
        neonClient.createProjectBranch(project.id, {
          endpoints: [{ type: EndpointType.ReadOnly }],
          branch: {
            name: `preview`,
            parent_id: developmentBranch.id,
          },
        }),
      `Create preview branch for project ${project.id}`,
    );
    if (
      !previewBranchResponse.data.branch ||
      !previewBranchResponse.data.connection_uris
    ) {
      throw new Error(
        `Failed to create preview branch: No branch data returned.`,
      );
    }
    const previewBranch = previewBranchResponse.data.branch;
    await db
      .update(apps)
      .set({
        neonProjectId: project.id,
        neonDevelopmentBranchId: developmentBranch.id,
        neonPreviewBranchId: previewBranch.id,
      })
      .where(eq(apps.id, appId));
    logger.info(
      `Successfully created Neon project: ${project.id} and development branch: ${developmentBranch.id} for app ${appId}`,
    );
    return {
      id: project.id,
      name: project.name,
      connectionString: response.data.connection_uris[0].connection_uri,
      branchId: developmentBranch.id,
    };
  } catch (error: any) {
    const errorMessage = getNeonErrorMessage(error);
    const message = `Failed to create Neon project for app ${appId}: ${errorMessage}`;
    logger.error(message);
    throw new Error(message);
  }
}