// Page Object for the shopping cart page on ermitazas.lt
//
// The cart lives at /kurti-uzsakyma/krepselis. This object covers both:
//   - actions on a product detail page (adding to cart from there)
//   - actions on the cart page itself (quantity, removal)

class CartPage {
  // --- Selectors ---

  // On the product detail page — the orange "Į krepšelį" button.
  get addToCartButton() {
    return cy.get('[data-testid="add-to-cart-button"]').first();
  }

  // The cart page also renders "you might also like" widgets with their own
  // +/-/qty controls, so we always scope to the FIRST occurrence — that's
  // the cart row at the top of the page.
  get quantityInput() {
    return cy.get('[data-testid="cart-product-quantity"]').first();
  }
  get increaseButton() {
    return cy.get('[name="plus"]').first();
  }
  get decreaseButton() {
    return cy.get('[name="minus"]').first();
  }
  get removeButton() {
    return cy.get('[data-testid="cart-product-remove-button"]');
  }

  // The cart header text — "Prekių krepšelis (1 prekė)" / "(2 prekės)" /
  // "(0 prekių)" in Lithuanian declensions. We use the static prefix as
  // the anchor and assert on the parenthetical separately when needed.
  get cartHeader() {
    return cy.contains('Prekių krepšelis');
  }

  // --- Actions ---

  visit() {
    cy.visit('/kurti-uzsakyma/krepselis');
    cy.get('body').then(($body) => {
      if ($body.find('#CybotCookiebotDialogBodyButtonDecline').length) {
        cy.dismissCookieBanner();
      }
    });
  }

  /**
   * Visits a product detail page and clicks "Į krepšelį".
   * @param {string} productPath - the path portion of the product URL.
   */
  addProductToCart(productPath) {
    cy.visit(productPath);
    this.addToCartButton.click();
  }

  /**
   * Removes every item in the cart by repeatedly clicking the first
   * remove button until none remain. Used to ensure each test starts
   * from a known empty state — the cart persists across tests for
   * authenticated users.
   */
  emptyCart() {
    cy.get('body').then(($body) => {
      const removeRowsRecursively = () => {
        const $btn = Cypress.$('[data-testid="cart-product-remove-button"]');
        if ($btn.length === 0) return;
        cy.get('[data-testid="cart-product-remove-button"]').first().click();
        // Wait for the row to actually leave the DOM before recursing.
        cy.get('[data-testid="cart-product-remove-button"]')
          .should('have.length', $btn.length - 1)
          .then(removeRowsRecursively);
      };
      removeRowsRecursively();
    });
  }

  increaseQuantity(times = 1) {
    for (let i = 0; i < times; i++) {
      this.increaseButton.click();
    }
  }

  removeFirstItem() {
    this.removeButton.first().click();
  }
}

export default new CartPage();
