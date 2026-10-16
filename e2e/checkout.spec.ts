import { test, expect } from "@playwright/test";

test.describe("Checkout", () => {
	test.beforeEach(async ({ page }) => {
		//visit saucedemo homepage
		await page.goto("https://www.saucedemo.com/");
		//fill form and login
		await page.locator('[data-test="username"]').fill('standard_user');
		await page.locator('[data-test="password"]').fill('secret_sauce');
		await page.locator('[data-test="login-button"]').click();
	})

	test('Should choose product, go to cart and checkout it', async ({ page }) => {
		//choose 2 products
		await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
		await page.locator('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]').click();
		//open cart
		await page.locator('[data-test="shopping-cart-link"]').click();
		//checkout it
		await page.locator('[data-test="checkout"]').click();
		await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
		//fill form and validate
		await test.step('Fill in shipping information', async () => {
			await page.locator('[data-test="firstName"]').fill('Tsanta');
			await page.locator('[data-test="lastName"]').fill('Mark');
			await page.locator('[data-test="postalCode"]').fill('104');
			await page.locator('[data-test="continue"]').click();
		})
		await test.step('Check final shipping information', async () => {
			await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
			await expect(page.locator('[data-test="cart-list"]')).toBeVisible();
			await expect(page.locator('[data-test="total-info-label"]')).toContainText('Price Total');
			await expect(page.locator('[data-test="subtotal-label"]')).toContainText('Item total: $45.98');
			await expect(page.locator('[data-test="tax-label"]')).toContainText('Tax: $3.68');
			await expect(page.locator('[data-test="total-label"]')).toContainText('Total: $49.66');
			await page.locator('[data-test="finish"]').click();
		})
		//check message
		await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
		await expect(page.locator('[data-test="complete-header"]')).toContainText('Thank you for your order!');
		await expect(page.locator('[data-test="complete-text"]')).toContainText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
		await expect(page.locator('[data-test="back-to-products"]')).toBeVisible()
		await expect(page.locator('[data-test="generate-pdf-order"]')).toBeVisible()
	})

	test('Should verify checkout validation form', async ({ page }) => {
		//choose 2 products
		await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
		await page.locator('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]').click();
		//open cart
		await page.locator('[data-test="shopping-cart-link"]').click();
		//checkout it
		await page.locator('[data-test="checkout"]').click();
		await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
		//fill form and validate
		await page.locator('[data-test="firstName"]').fill('Tsanta');
		await page.locator('[data-test="postalCode"]').fill('104');
		await page.locator('[data-test="continue"]').click();
		//check result
		await expect(page.locator('[data-test="error"]')).toHaveText('Error: Last Name is required');
	})

})