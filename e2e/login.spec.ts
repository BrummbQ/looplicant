import { test, expect, APIRequestContext, Page } from "@playwright/test";

test.describe("Login Page E2E", () => {
  const LOGIN_PAGE_URL = "/login"; // Adjust if your login page path is different

  // MailDev API endpoint (default web port)
  const MAILDEV_API_URL = "http://localhost:1080";
  const TEST_EMAIL = `test-user@looplicant.com`;

  // Helper to clear MailDev inbox
  async function clearMailbox(maildevRequest: APIRequestContext) {
    await maildevRequest.delete(`${MAILDEV_API_URL}/email/all`);
  }

  // Helper to get emails from MailDev
  async function getEmailsFromMailbox(
    maildevRequest: APIRequestContext,
    page: Page,
    recipient: string,
    maxRetries = 10,
    retryDelay = 500
  ) {
    for (let i = 0; i < maxRetries; i++) {
      const response = await maildevRequest.get(`${MAILDEV_API_URL}/email`);
      const emails = await response.json();
      const filteredEmails = emails.filter(
        (e: any) => e.to.some((to: any) => to.address === recipient) // MailDev structures 'to' differently
      );
      if (filteredEmails.length > 0) {
        return filteredEmails;
      }
      await page.waitForTimeout(retryDelay);
    }
    throw new Error(
      `No emails found for ${recipient} after ${maxRetries} retries.`
    );
  }

  function extractMagicLinkFromEmail(emailHtml: string): string | null {
    // This regex looks for an <a href="..."> tag where the href starts with
    // http://localhost:9002/api/auth/callback/nodemailer and captures the entire URL
    // It also accounts for `&amp;` vs `&` in the URL
    const magicLinkRegex =
      /href="(http:\/\/localhost:9002\/api\/auth\/callback\/nodemailer\?callbackUrl=[^"]*?(?:&amp;|&)token=[^"]*?(?:&amp;|&)email=[^"]*?)"/i;

    const match = emailHtml.match(magicLinkRegex);

    if (match && match[1]) {
      // Decode HTML entities like &amp; back to &
      return match[1].replace(/&amp;/g, "&");
    }
    return null;
  }

  test.beforeEach(async ({ page, request }) => {
    // Clear MailDev inbox before each test
    await clearMailbox(request);
    // Navigate to the login page before each test
    await page.goto(LOGIN_PAGE_URL);
    // Ensure the page is loaded and basic elements are visible
    await expect(
      page.getByRole("heading", { name: "Login with Email" })
    ).toBeVisible();
  });

  test("should display the login form correctly and login", async ({
    page,
    request,
  }) => {
    const emailInput = page.getByRole("textbox");
    const sendEmailButton = page.getByRole("button", { name: "Send Email" });
    await expect(emailInput).toBeVisible();
    await expect(sendEmailButton).toBeVisible();

    await emailInput.fill(TEST_EMAIL);
    await expect(sendEmailButton).not.toBeDisabled(); // Button initially enabled
    await sendEmailButton.click();
    await page.waitForTimeout(2000); // Give time for email sending

    const emails = await getEmailsFromMailbox(request, page, TEST_EMAIL);
    expect(emails.length).toBeGreaterThan(0);
    const email = emails[0];
    expect(email.from[0].address).toContain("noreply@looplicant.com");
    expect(email.to[0].address).toBe(TEST_EMAIL);
    expect(email.subject).toContain("Sign in to");
    const emailBody = email.html;

    const magicLink = extractMagicLinkFromEmail(emailBody);
    expect(magicLink).not.toBeNull();
    expect(magicLink).toContain(
      "http://localhost:9002/api/auth/callback/nodemailer"
    );

    const navigationPromise = page.waitForURL("**/import");

    await page.goto(magicLink as string);
    await navigationPromise;
    await expect(page).toHaveURL("/import");
  });
});
