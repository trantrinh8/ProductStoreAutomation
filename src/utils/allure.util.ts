import { test, type Page, type TestInfo } from "@playwright/test";

export class AllureUtil {
  static async step<T>(title: string, action: () => Promise<T>): Promise<T> {
    return test.step(title, action);
  }

  static async attachScreenshot(
    testInfo: TestInfo,
    page: Page,
    name = "screenshot",
  ): Promise<void> {
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach(name, {
      body: screenshot,
      contentType: "image/png",
    });
  }
}
