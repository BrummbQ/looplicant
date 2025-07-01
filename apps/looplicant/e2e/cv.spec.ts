import { test, expect } from "@playwright/test";

test("has title and redirect to cv", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(
    /Looplicant - AI Powered Application Assistant/
  );
  await expect(page).toHaveURL("/cv");
});


