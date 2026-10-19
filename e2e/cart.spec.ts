import { test, expect, type Page } from '@playwright/test';

// Product card on the inventory page, found by the product name it displays.
// First step towards the Page Objects of step 3.
const productCard = (page: Page, productName: string) =>
	page.getByTestId('inventory-item').filter({ hasText: productName });

test.describe('Cart', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('https://www.saucedemo.com/');
		await page.getByPlaceholder('Username').fill('standard_user');
		await page.getByPlaceholder('Password').fill('secret_sauce');
		await page.getByRole('button', { name: 'Login' }).click();
	});

	test('Should add a product to the cart', async ({ page }) => {
		const backpack = productCard(page, 'Sauce Labs Backpack');

		await backpack.getByRole('button', { name: 'Add to cart' }).click();

		await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
		await expect(backpack.getByRole('button', { name: 'Remove' })).toBeVisible();
	});

	test('Should add two products and remove one', async ({ page }) => {
		const backpack = productCard(page, 'Sauce Labs Backpack');
		const tShirt = productCard(page, 'Test.allTheThings() T-Shirt (Red)');

		await test.step('Add two products then remove the backpack', async () => {
			await backpack.getByRole('button', { name: 'Add to cart' }).click();
			await tShirt.getByRole('button', { name: 'Add to cart' }).click();
			await backpack.getByRole('button', { name: 'Remove' }).click();
		});

		await test.step('Check that only the T-shirt remains in the cart', async () => {
			await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
			await expect(backpack.getByRole('button', { name: 'Add to cart' })).toBeVisible();
			await expect(tShirt.getByRole('button', { name: 'Remove' })).toBeVisible();
		});
	});

	test('Should open the cart and show the added products', async ({ page }) => {
		await test.step('Add two products and open the cart', async () => {
			await productCard(page, 'Sauce Labs Backpack').getByRole('button', { name: 'Add to cart' }).click();
			await productCard(page, 'Test.allTheThings() T-Shirt (Red)')
				.getByRole('button', { name: 'Add to cart' })
				.click();
			await page.getByTestId('shopping-cart-link').click();
		});

		await test.step('Check product names and prices in the cart', async () => {
			await expect(page).toHaveURL(/cart\.html/);
			await expect(page.getByTestId('inventory-item-name')).toHaveText([
				'Sauce Labs Backpack',
				'Test.allTheThings() T-Shirt (Red)',
			]);
			await expect(page.getByTestId('inventory-item-price')).toHaveText(['$29.99', '$15.99']);
		});
	});

	test('Should hide the cart badge when the cart is emptied', async ({ page }) => {
		const backpack = productCard(page, 'Sauce Labs Backpack');
		const tShirt = productCard(page, 'Test.allTheThings() T-Shirt (Red)');
		await test.step('Add something into cart', async () => {
			await backpack.getByRole('button', { name: 'Add to cart' }).click();
			await tShirt.getByRole('button', { name: 'Add to cart' }).click();
		});

		await test.step('Remove all products from cart and check cart badge', async () => {
			await backpack.getByRole('button', { name: 'Remove' }).click();
			await tShirt.getByRole('button', { name: 'Remove' }).click();
			await expect(page.getByTestId('shopping-cart-badge')).toBeHidden();
		})
	})
});