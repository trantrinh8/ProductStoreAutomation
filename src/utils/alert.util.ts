import type { Dialog, Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class AlertUtil {
  static async acceptNextDialog(
    page: Page,
    trigger: () => Promise<void>,
    expectedMessage?: string,
  ): Promise<string> {
    const handledDialogPromise = page
      .waitForEvent("dialog")
      .then(async (dialog) => {
        const message = dialog.message();

        if (expectedMessage) {
          expect(message).toContain(expectedMessage);
        }

        await dialog.accept();
        return message;
      });

    const [message] = await Promise.all([handledDialogPromise, trigger()]);
    return message;
  }

  static async acceptDialog(
    dialog: Dialog,
    expectedMessage?: string,
  ): Promise<string> {
    const message = dialog.message();

    if (expectedMessage) {
      expect(message).toContain(expectedMessage);
    }

    await dialog.accept();
    return message;
  }
}
