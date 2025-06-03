import { test, expect } from "@playwright/test";

test("should redirect unauthorized user to login", async ({ page }) => {
  await page.goto("/import");

  await expect(page).toHaveTitle(
    /Looplicant - AI Powered Application Assistant/
  );
  await expect(page).toHaveURL(/login/);
  await expect(
    page.getByRole("heading", { name: "Login with Email" })
  ).toBeVisible();
});
