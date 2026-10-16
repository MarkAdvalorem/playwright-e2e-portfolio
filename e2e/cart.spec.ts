import { test, expect } from '@playwright/test';

test.describe('Login', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('https://www.saucedemo.com/');
	});

	test('Should login with valid credentials', async ({ page }) => {
		await page.getByPlaceholder('Username').fill('standard_user');
		await page.getByPlaceholder('Password').fill('secret_sauce');
		await page.getByRole('button', { name: 'Login' }).click();

		await expect(page).toHaveURL(/inventory\.html/);
		await expect(page.getByTestId('title')).toHaveText('Products');
	});

	test('Should show an error with invalid credentials', async ({ page }) => {
		await page.getByPlaceholder('Username').fill('standard_user');
		await page.getByPlaceholder('Password').fill('wrong_password');
		await page.getByRole('button', { name: 'Login' }).click();

		await expect(page.getByRole('alert')).toHaveText(
			'Epic sadface: Username and password do not match any user in this service'
		);
		await expect(page.getByPlaceholder('Username')).toContainClass('error');
		await expect(page.getByPlaceholder('Password')).toContainClass('error');
	});

	test('Should show an error for a locked out user', async ({ page }) => {
		await page.getByPlaceholder('Username').fill('locked_out_user');
		await page.getByPlaceholder('Password').fill('secret_sauce');
		await page.getByRole('button', { name: 'Login' }).click();

		await expect(page.getByRole('alert')).toHaveText('Epic sadface: Sorry, this user has been locked out.');
		await expect(page.getByPlaceholder('Username')).toContainClass('error');
		await expect(page.getByPlaceholder('Password')).toContainClass('error');
	});

	test('Should show an error when fields are empty', async ({ page }) => {
		await page.getByRole('button', { name: 'Login' }).click();

		await expect(page.getByRole('alert')).toHaveText('Epic sadface: Username is required');
		await expect(page.getByPlaceholder('Username')).toContainClass('error');
		await expect(page.getByPlaceholder('Password')).toContainClass('error');
	});
});