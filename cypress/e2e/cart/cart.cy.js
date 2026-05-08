import CartPage from '../../support/pages/CartPage'

const TEST_PRODUCT = {
  path: '/p/kavos-kapsules-nescafe-dolce-gusto-espresso-intenso-16-kapsuliu-112-g-75r86vmt',
  name: 'NESCAFE DOLCE GUSTO ESPRESSO INTENSO',
}

describe('Shopping cart', () => {
  beforeEach(() => {
    cy.fixture('users').then(({ loginUser }) => {
      cy.login(loginUser.email, loginUser.password)
    })
    cy.visit('/')
    cy.get('body').then(($body) => {
      if ($body.find('#CybotCookiebotDialogBodyButtonDecline').length) {
        cy.dismissCookieBanner()
      }
    })
  })

  it('adds a product to the cart and it appears in the cart', () => {
    CartPage.addProductToCart(TEST_PRODUCT.path)
    CartPage.visit()
    cy.contains(TEST_PRODUCT.name).should('be.visible')
  })

  it('increases the quantity of a product in the cart', () => {
    CartPage.addProductToCart(TEST_PRODUCT.path)
    CartPage.visit()
    CartPage.quantityInput.invoke('val').then((currentVal) => {
      const before = parseInt(currentVal, 10)
      CartPage.increaseQuantity(1)
      cy.wait(1000)
      CartPage.quantityInput.should('have.value', String(before + 1))
    })
  })

  it('removes a product from the cart', () => {
    CartPage.addProductToCart(TEST_PRODUCT.path)
    CartPage.visit()
    cy.get('[data-testid="cart-product-remove-button"]').then(($buttons) => {
      const countBefore = $buttons.length
      CartPage.removeFirstItem()
      cy.get('[data-testid="cart-product-remove-button"]')
        .should('have.length', countBefore - 1)
    })
  })
})
