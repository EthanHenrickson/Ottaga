import { test, expect } from '@playwright/test';
import { MainMap } from './pageMap/MainMap';

test('Verify Main Page functionality', async ({ page }) => {
  const MainPage = new MainMap(page)

  await MainPage.GoTo()

  await MainPage.ClickButton("Session Memory")
  await expect(page.locator(".valueBlock ")).toContainText("Experience personalized support")

  await MainPage.ClickButton("Stress and anxiety management")
  await expect(page.locator(".valueBlock ")).toContainText("Learn practical coping")

  await MainPage.ClickButton("Emotional support during difficult times")
  await expect(page.locator(".valueBlock ")).toContainText("Experience empathy and validation")

  await MainPage.ClickButton("Guided relaxation and mindfulness exercises")
  await expect(page.locator(".valueBlock ")).toContainText("Access a variety of mindfulness")
});