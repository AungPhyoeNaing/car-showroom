import { test, expect } from "@playwright/test";

test.describe("Automotive Showroom & Lead Flow E2E Tests", () => {
  test("should allow scheduling a test drive from a vehicle card", async ({ page }) => {
    // 1. Navigate to inventory showroom
    await page.goto("/inventory");
    await expect(page).toHaveTitle(/Apex Motors/);

    // 2. Click the test drive calendar icon on the first vehicle card
    const firstTestDriveButton = page.locator("button[title*='Schedule VIP Private Viewing']").first();
    await expect(firstTestDriveButton).toBeVisible();
    await firstTestDriveButton.click();

    // 3. Verify modal opens
    const modalHeading = page.locator("h2:has-text('VIP Private Viewing & Test Drive')");
    await expect(modalHeading).toBeVisible();

    // 4. Fill in booking form
    await page.fill("input[placeholder*='Lord Sterling']", "Sir Sterling Moss");
    await page.fill("input[placeholder*='555']", "+1 310 555 7788");
    await page.fill("input[placeholder*='client@luxuryestate']", "sterling@moss-heritage.com");
    await page.fill("input[type='date']", "2026-11-25");
    await page.fill("textarea", "Requesting track-ready tire compound setup for consultation.");

    // 5. Submit form
    const submitBtn = page.locator("button:has-text('Confirm Reservation')");
    await submitBtn.click();

    // 6. Verify confirmation pass & reference code
    const confirmationHeading = page.locator("h3:has-text('VIP Appointment Reserved')");
    await expect(confirmationHeading).toBeVisible({ timeout: 10000 });

    const refCode = page.locator("span:has-text('APX-TD-')");
    await expect(refCode).toBeVisible();
  });

  test("should allow adding vehicles to comparison dock and viewing side-by-side specs", async ({ page }) => {
    await page.goto("/inventory");

    // Add first 2 cars to compare
    const compareButtons = page.locator("button[title*='comparison']");
    await compareButtons.nth(0).click();
    await compareButtons.nth(1).click();

    // Verify compare dock appears
    const compareDock = page.locator("button:has-text('Compare (2/3)')");
    await expect(compareDock).toBeVisible();

    // Open side-by-side modal
    await compareDock.click();

    const compareTitle = page.locator("h2:has-text('Side-by-Side Fleet Comparison')");
    await expect(compareTitle).toBeVisible();

    // Verify spec comparison rows
    await expect(page.locator("text=0–60 MPH")).toBeVisible();
    await expect(page.locator("text=Horsepower")).toBeVisible();
    await expect(page.locator("text=Powertrain Blueprint")).toBeVisible();
  });
});
