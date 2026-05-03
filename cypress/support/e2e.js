// Cypress support file

// Add custom commands
Cypress.Commands.add('getByTestId', (testId) => {
  return cy.get(`[data-testid="${testId}"]`);
});

Cypress.Commands.add('getByClass', (className) => {
  return cy.get(`.${className}`);
});

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing tests due to Angular errors
  if (err.message.includes('Angular is loading')) {
    return false;
  }
  return true;
});