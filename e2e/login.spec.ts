import { test, expect } from "@playwright/test";

test.describe("Login", () => {
	test.beforeEach(async ({ page }) => {
		//visit saucedemo homepage
		await page.goto("https://www.saucedemo.com/");
	})

	test('Should login with valid credentials', async ({ page }) => {
		//fill form and login
		await page.getByPlaceholder('Username').fill('standard_user');
		await page.getByPlaceholder('Password').fill('secret_sauce');
		await page.getByRole('button', { name: 'Login' }).click();
		//check result
		await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
	})

	test('Should alert if wrong credentials ', async ({ page }) => {
		//fill form and login
		await page.getByPlaceholder('Username').fill('standard_user');
		await page.getByPlaceholder('Password').fill('sect_sauce');
		await page.getByRole('button', { name: 'Login' }).click();
		//check result
		await expect(page.getByTestId('error')).toHaveText('Epic sadface: Username and password do not match any user in this service');
		await expect(page.getByPlaceholder('Username')).toContainClass('error');
		await expect(page.getByPlaceholder('Password')).toContainClass('error');
	})

	test('Should show an error for a locked out user ', async ({ page }) => {
		//fill form and login
		await page.getByPlaceholder('Username').fill('locked_out_user');
		await page.getByPlaceholder('Password').fill('secret_sauce');
		await page.getByRole('button', { name: 'Login' }).click();
		//check result
		await expect(page.getByTestId('error')).toHaveText('Epic sadface: Sorry, this user has been locked out.');
		await expect(page.getByPlaceholder('Username')).toContainClass('error');
		await expect(page.getByPlaceholder('Password')).toContainClass('error');
	})

	test('Should show error if empty field', async ({ page }) => {
		//click login button
		await page.getByRole('button', { name: 'Login' }).click();
		//check result
		await expect(page.getByTestId('error')).toHaveText('Epic sadface: Username is required');
		await expect(page.getByPlaceholder('Username')).toContainClass('error');
		await expect(page.getByPlaceholder('Password')).toContainClass('error');
	})
})