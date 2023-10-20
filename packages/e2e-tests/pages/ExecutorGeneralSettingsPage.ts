import {type Page, expect} from '@playwright/test';

export class ExecutorGeneralSettingsPage {
  public readonly page: Page;

  public constructor(page: Page) {
    this.page = page;
  }

  public async validateExecutorGeneralSettings(executorName: string, executorType: string): Promise<void> {
    const executorNameLocator = this.page.locator(
      `//input[@id="general-settings-name-type_name" and @value="${executorName}"]`
    );

    expect(executorNameLocator.isVisible()).toBeTruthy();

    const executorTypeLocator = this.page.locator(
      `//input[@id="general-settings-name-type_type" and @value="${executorType}"]`
    );
    expect(executorTypeLocator.isVisible()).toBeTruthy();
  }

  public async selectContainerImageTab(): Promise<void> {
    await this.page.click('div[data-test="sidebar-navigation-link:container-image"]');
  }

  public async validateContainerImageSettings(containerImage: string): Promise<void> {
    const containerImageLocator = this.page.locator(
      `//input[@id="container-image-settings-name-type_container_image" and @value="${containerImage}"]`
    );
    expect(containerImageLocator.isVisible()).toBeTruthy();
  }

  public async deleteExecutor(executorName: string): Promise<void> {
    await this.page.click('button[data-testid="configuration-card-confirm-button"]');
    await this.page.getByTestId('delete-entity-input').fill(executorName);
    await this.page.getByTestId('delete-action-btn').click();
  }
}