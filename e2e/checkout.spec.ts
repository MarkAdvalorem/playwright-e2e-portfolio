import { test, expect, type Page } from '@playwright/test';

// Product card on the inventory page, found by the product name it displays.
// First step towards the Page Objects of step 3.
const productCard = (page: Page, productName: string) =>
	page.getByTestId('inventory-item').filter({ hasText: productName });

test.describe('Checkout', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('https://www.saucedemo.com/');
		await page.getByPlaceholder('Username').fill('standard_user');
		await page.getByPlaceholder('Password').fill('secret_sauce');
		await page.getByRole('button', { name: 'Login' }).click();
	});

	test('Should complete an order with two products', async ({ page }) => {
		await test.step('Add two products and go to checkout', async () => {
			await productCard(page, 'Sauce Labs Backpack').getByRole('button', { name: 'Add to cart' }).click();
			await productCard(page, 'Test.allTheThings() T-Shirt (Red)')
				.getByRole('button', { name: 'Add to cart' })
				.click();
			await page.getByTestId('shopping-cart-link').click();
			await page.getByRole('button', { name: 'Checkout' }).click();
			await expect(page).toHaveURL(/checkout-step-one\.html/);
		});

		await test.step('Fill in shipping information', async () => {
			await page.getByPlaceholder('First Name').fill('Tsanta');
			await page.getByPlaceholder('Last Name').fill('Mark');
			await page.getByPlaceholder('Zip/Postal Code').fill('104');
			await page.getByRole('button', { name: 'Continue' }).click();
		});

		await test.step('Check the order summary', async () => {
			await expect(page).toHaveURL(/checkout-step-two\.html/);
			await expect(page.getByTestId('inventory-item-name')).toHaveText([
				'Sauce Labs Backpack',
				'Test.allTheThings() T-Shirt (Red)',
			]);
			await expect.soft(page.getByTestId('subtotal-label')).toHaveText('Item total: $45.98');
			await expect.soft(page.getByTestId('tax-label')).toHaveText('Tax: $3.68');
			await expect.soft(page.getByTestId('total-label')).toHaveText('Total: $49.66');
		});

		await test.step('Place the order', async () => {
			await page.getByRole('button', { name: 'Finish' }).click();
		});

		await test.step('Check the order confirmation', async () => {
			await expect(page).toHaveURL(/checkout-complete\.html/);
			await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
			await expect(page.getByRole('button', { name: 'Back Home' })).toBeVisible();
			await expect(page.getByRole('button', { name: 'Generate PDF order' })).toBeVisible();
		});
	});

	test('Should require the last name on the checkout form', async ({ page }) => {
		await test.step('Add two products and go to checkout', async () => {
			await productCard(page, 'Sauce Labs Backpack').getByRole('button', { name: 'Add to cart' }).click();
			await productCard(page, 'Test.allTheThings() T-Shirt (Red)')
				.getByRole('button', { name: 'Add to cart' })
				.click();
			await page.getByTestId('shopping-cart-link').click();
			await page.getByRole('button', { name: 'Checkout' }).click();
			await expect(page).toHaveURL(/checkout-step-one\.html/);
		});

		await test.step('Submit the form without a last name', async () => {
			await page.getByPlaceholder('First Name').fill('Tsanta');
			await page.getByPlaceholder('Zip/Postal Code').fill('104');
			await page.getByRole('button', { name: 'Continue' }).click();
		});

		await expect(page.getByRole('alert')).toHaveText('Error: Last Name is required');
		await expect(page).toHaveURL(/checkout-step-one\.html/);
	});
});