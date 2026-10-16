import { test, expect } from "@playwright/test";

test.describe("Cart", () => {
	test.beforeEach(async ({ page }) => {
		//visit saucedemo homepage
		await page.goto("https://www.saucedemo.com/");
		//fill form and login
		await page.locator('[data-test="username"]').fill('standard_user');
		await page.locator('[data-test="password"]').fill('secret_sauce');
		await page.locator('[data-test="login-button"]').click();
	})

	test('Should add products into cart', async ({ page }) => {
		//choose backpack from list
		await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
		//check result
		await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
		await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
	})

	test('Should add two products and remove one', async ({ page }) => {
		//choose 2 products
		await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
		await page.locator('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]').click();
		//remove one
		await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

		//check result
		await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
		await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
		await expect(page.locator('[data-test="remove-test.allthethings()-t-shirt-(red)"]')).toBeVisible();

	})

	test('Should open cart and verify products', async ({ page }) => {
		//choose 2 products
		await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
		await page.locator('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]').click();
		//open cart
		await page.locator('[data-test="shopping-cart-link"]').click();
		//check result
		await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
		await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText([
			'Sauce Labs Backpack',
			'Test.allTheThings() T-Shirt (Red)'
		]);
		await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText([
			'$29.99',
			'$15.99'
		]);
	})


})