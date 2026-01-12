// @ts-nocheck
async function createNamespace(name) {
  const yaml = `
    apiVersion: v1
    kind: Namespace
    metadata:
      name: ${name}
    `;
  const page = this.page;
  await page.waitForSelector('span:has-text(`Namespaces`)');
  await page.click('span:has-text(`Namespaces`)');
  await page.waitForLoadState('load');
  const pageContent = await this.page.content();
  if (pageContent.includes(name)) {
    throw new Error(`Test failed: Namespace '${ name }' already exists.`);
  }
  await page.getByText('Create', { exact: true }).click();
  await page.waitForLoadState('load');
  const checkedSpan = await page.$('span.Mui-checked');
  if (!checkedSpan) {
    await expect(page.getByText('Use minimal editor')).toBeVisible();
    await page.getByText('Use minimal editor').click();
  }
  await page.waitForLoadState('load');
  await page.waitForSelector('textarea[aria-label=`yaml Code`]', { state: 'visible' });
  await expect(page.getByRole('textbox', { name: 'yaml Code' })).toBeVisible();
  await page.fill('textarea[aria-label=`yaml Code`]', yaml);
  await expect(page.getByRole('button', { name: 'Apply' })).toBeVisible();
  await page.getByRole('button', { name: 'Apply' }).click();
  await page.waitForSelector(`a:has-text('${ name }')`);
  await expect(page.locator(`a:has-text('${ name }')`)).toBeVisible();
}