// Custom Cypress commands

// Mark a day as WFO
Cypress.Commands.add('markWfoDay', (day) => {
  cy.get('.calendar .day')
    .contains(new RegExp(`^${day}$`, 'g'))
    .click();
  cy.get('button.btn.wfo').click();
});

// Mark a day as Leave
Cypress.Commands.add('markLeaveDay', (day) => {
  cy.get('.calendar .day')
    .contains(new RegExp(`^${day}$`, 'g'))
    .click();
  cy.get('button.btn.leave').click();
});

// Clear a day
Cypress.Commands.add('clearDay', (day) => {
  cy.get('.calendar .day')
    .contains(new RegExp(`^${day}$`, 'g'))
    .click();
  cy.get('button.btn.clear').click();
});

// Navigate to next month
Cypress.Commands.add('goToNextMonth', () => {
  cy.get('.nav-btn').last().click();
});

// Navigate to previous month
Cypress.Commands.add('goToPreviousMonth', () => {
  cy.get('.nav-btn').first().click();
});