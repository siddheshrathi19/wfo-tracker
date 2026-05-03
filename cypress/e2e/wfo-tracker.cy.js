// ============================================================================
// WFO Tracker - Comprehensive E2E Test Suite
// ============================================================================
// This test suite covers all functionality including:
// - UI rendering and components
// - Responsive design for all devices
// - WFO and Leave day marking
// - Required days calculation
// - Progress tracking
// - Month navigation
// - Keyboard shortcuts
// ============================================================================

describe('WFO Tracker - E2E Test Suite', () => {
  
  // ==================== Setup ====================
  
  beforeEach(() => {
    // Clear local storage before each test
    cy.clearLocalStorage();
    cy.visit('/');
  });

  // ==================== UI Rendering Tests ====================
  
  describe('UI Rendering', () => {
    it('should display the main title', () => {
      cy.get('.title').should('contain', 'WFO Tracker');
    });

    it('should display the metrics component', () => {
      cy.get('app-metrics').should('be.visible');
    });

    it('should display the calendar component', () => {
      cy.get('app-calendar').should('be.visible');
    });

    it('should display all 4 metric cards', () => {
      cy.get('.metric').should('have.length', 4);
      cy.get('.metric.work').should('contain', 'Working Days');
      cy.get('.metric.leave').should('contain', 'Leave/Holiday');
      cy.get('.metric.effective').should('contain', 'Effective');
      cy.get('.metric.required').should('contain', 'Required');
    });

    it('should display action buttons', () => {
      cy.get('button.btn.today').should('be.visible');
      cy.get('button.btn.wfo').should('be.visible');
      cy.get('button.btn.leave').should('be.visible');
      cy.get('button.btn.clear').should('be.visible');
    });

    it('should display month navigation', () => {
      cy.get('.nav-btn').should('have.length', 2);
    });

    it('should display calendar with 7 day headers', () => {
      cy.get('.day-header').should('have.length', 7);
    });

    it('should display progress bar', () => {
      cy.get('.progress').should('be.visible');
      cy.get('.bar').should('be.visible');
    });
  });

  // ==================== Responsive Design Tests ====================
  
  describe('Responsive Design - Mobile', () => {
    beforeEach(() => {
      cy.viewport(375, 667); // iPhone SE
    });

    it('should render correctly on mobile', () => {
      cy.get('.container').should('be.visible');
      cy.get('.title').should('be.visible');
      cy.get('app-metrics').should('be.visible');
      cy.get('app-calendar').should('be.visible');
    });

    it('should have proper mobile layout', () => {
      cy.get('.metrics').should('have.css', 'grid-template-columns', 'repeat(4, 1fr)');
    });

    it('should have action buttons in grid', () => {
      cy.get('.actions').should('have.css', 'grid-template-columns', 'repeat(4, 1fr)');
    });
  });

  describe('Responsive Design - Tablet', () => {
    beforeEach(() => {
      cy.viewport(768, 1024); // iPad
    });

    it('should render correctly on tablet', () => {
      cy.get('.container').should('be.visible');
      cy.get('.title').should('be.visible');
    });

    it('should have proper tablet layout', () => {
      cy.get('.metrics').should('have.css', 'grid-template-columns', 'repeat(4, 1fr)');
    });
  });

  describe('Responsive Design - Laptop', () => {
    beforeEach(() => {
      cy.viewport(1366, 768); // Laptop
    });

    it('should render correctly on laptop', () => {
      cy.get('.container').should('be.visible');
      cy.get('.title').should('be.visible');
    });

    it('should have proper laptop layout', () => {
      cy.get('.container').should('not.have.css', 'border-radius', '0px');
    });
  });

  describe('Responsive Design - Desktop', () => {
    beforeEach(() => {
      cy.viewport(1920, 1080); // Desktop
    });

    it('should render correctly on desktop', () => {
      cy.get('.container').should('be.visible');
      cy.get('.title').should('be.visible');
    });

    it('should have proper desktop layout', () => {
      cy.get('.container').should('have.css', 'max-width').and('not.equal', '100%');
    });
  });

  describe('Responsive Design - iPad Pro', () => {
    beforeEach(() => {
      cy.viewport(1024, 1366); // iPad Pro
    });

    it('should render correctly on iPad Pro', () => {
      cy.get('.container').should('be.visible');
    });
  });

  // ==================== WFO Day Marking Tests ====================
  
  describe('Mark WFO Days', () => {
    it('should mark a day as WFO when clicking calendar day and WFO button', () => {
      // Click on a day in the calendar
      cy.get('.calendar .day').not('.weekend').first().click();
      // Click WFO button
      cy.get('button.btn.wfo').click();
      // Verify the day is marked
      cy.get('.calendar .day.wfo-day').should('have.length.gte', 1);
    });

    it('should increment working days metric when marking WFO', () => {
      cy.get('.metric.work .value').then(($val) => {
        const initialValue = parseInt($val.text());
        cy.get('.calendar .day').not('.weekend').first().click();
        cy.get('button.btn.wfo').click();
        cy.get('.metric.work .value').should('have.text', (initialValue + 1).toString());
      });
    });

    it('should increment effective days metric when marking WFO', () => {
      cy.get('.metric.effective .value').then(($val) => {
        const initialValue = parseInt($val.text());
        cy.get('.calendar .day').not('.weekend').first().click();
        cy.get('button.btn.wfo').click();
        cy.get('.metric.effective .value').should('have.text', (initialValue + 1).toString());
      });
    });

    it('should mark multiple WFO days', () => {
      // Mark first day
      cy.get('.calendar .day').not('.weekend').eq(0).click();
      cy.get('button.btn.wfo').click();
      // Mark second day
      cy.get('.calendar .day').not('.weekend').eq(1).click();
      cy.get('button.btn.wfo').click();
      // Verify both are marked
      cy.get('.calendar .day.wfo-day').should('have.length', 2);
    });
  });

  // ==================== Leave Day Marking Tests ====================
  
  describe('Mark Leave Days', () => {
    it('should mark a day as Leave when clicking calendar day and Leave button', () => {
      cy.get('.calendar .day').not('.weekend').first().click();
      cy.get('button.btn.leave').click();
      cy.get('.calendar .day.leave-day').should('have.length.gte', 1);
    });

    it('should increment leave days metric when marking leave', () => {
      cy.get('.metric.leave .value').then(($val) => {
        const initialValue = parseInt($val.text());
        cy.get('.calendar .day').not('.weekend').first().click();
        cy.get('button.btn.leave').click();
        cy.get('.metric.leave .value').should('have.text', (initialValue + 1).toString());
      });
    });

    it('should not affect work days when marking leave', () => {
      cy.get('.metric.work .value').then(($val) => {
        const initialValue = parseInt($val.text());
        cy.get('.calendar .day').not('.weekend').first().click();
        cy.get('button.btn.leave').click();
        cy.get('.metric.work .value').should('have.text', initialValue.toString());
      });
    });
  });

  // ==================== Clear Day Tests ====================
  
  describe('Clear Day', () => {
    it('should clear a marked WFO day', () => {
      // Mark a day
      cy.get('.calendar .day').not('.weekend').first().click();
      cy.get('button.btn.wfo').click();
      // Clear it
      cy.get('button.btn.clear').click();
      // Verify it's cleared
      cy.get('.calendar .day.wfo-day').should('have.length', 0);
    });

    it('should clear a marked leave day', () => {
      // Mark a day as leave
      cy.get('.calendar .day').not('.weekend').first().click();
      cy.get('button.btn.leave').click();
      // Clear it
      cy.get('button.btn.clear').click();
      // Verify it's cleared
      cy.get('.calendar .day.leave-day').should('have.length', 0);
    });
  });

  // ==================== Required Days Calculation Tests ====================
  
  describe('Required Days Calculation', () => {
    it('should show 12 required days with 0 leaves', () => {
      cy.get('.metric.required .value').should('have.text', '12');
    });

    it('should show 12 required days with 1 leave', () => {
      // Mark 1 leave day
      cy.get('.calendar .day').not('.weekend').first().click();
      cy.get('button.btn.leave').click();
      // Required should still be 12
      cy.get('.metric.required .value').should('have.text', '12');
    });

    it('should show 11 required days with 2 leaves', () => {
      // Mark 2 leave days
      cy.get('.calendar .day').not('.weekend').eq(0).click();
      cy.get('button.btn.leave').click();
      cy.get('.calendar .day').not('.weekend').eq(1).click();
      cy.get('button.btn.leave').click();
      // Required should be 11
      cy.get('.metric.required .value').should('have.text', '11');
    });

    it('should show 11 required days with 3 leaves', () => {
      // Mark 3 leave days
      cy.get('.calendar .day').not('.weekend').eq(0).click();
      cy.get('button.btn.leave').click();
      cy.get('.calendar .day').not('.weekend').eq(1).click();
      cy.get('button.btn.leave').click();
      cy.get('.calendar .day').not('.weekend').eq(2).click();
      cy.get('button.btn.leave').click();
      // Required should be 11
      cy.get('.metric.required .value').should('have.text', '11');
    });

    it('should show 10 required days with 4 leaves', () => {
      // Mark 4 leave days
      for (let i = 0; i < 4; i++) {
        cy.get('.calendar .day').not('.weekend').eq(i).click();
        cy.get('button.btn.leave').click();
      }
      // Required should be 10
      cy.get('.metric.required .value').should('have.text', '10');
    });
  });

  // ==================== Progress Tracking Tests ====================
  
  describe('Progress Tracking', () => {
    it('should show 0% progress initially', () => {
      cy.get('.bar').should('have.attr', 'style').and('contain', 'width: 0%');
    });

    it('should update progress when marking WFO days', () => {
      // Mark 6 WFO days
      for (let i = 0; i < 6; i++) {
        cy.get('.calendar .day').not('.weekend').eq(i).click();
        cy.get('button.btn.wfo').click();
      }
      // Progress should be around 50%
      cy.get('.info-value.highlight').should('contain', '50');
    });

    it('should show 100% progress when target achieved', () => {
      // Mark 12 WFO days
      for (let i = 0; i < 12; i++) {
        cy.get('.calendar .day').not('.weekend').eq(i).click();
        cy.get('button.btn.wfo').click();
      }
      // Progress should be 100%
      cy.get('.info-value.highlight').should('contain', '100');
    });

    it('should show remaining days correctly', () => {
      cy.get('.info-item').first().should('contain', 'Remaining');
      cy.get('.info-item').first().should('contain', '12');
    });
  });

  // ==================== Month Navigation Tests ====================
  
  describe('Month Navigation', () => {
    it('should navigate to next month', () => {
      cy.get('.month-title').then(($title) => {
        const initialMonth = $title.text();
        cy.get('.nav-btn').last().click();
        cy.get('.month-title').should('not.contain', initialMonth);
      });
    });

    it('should navigate to previous month', () => {
      cy.get('.month-title').then(($title) => {
        const initialMonth = $title.text();
        cy.get('.nav-btn').first().click();
        cy.get('.month-title').should('not.contain', initialMonth);
      });
    });

    it('should navigate multiple months', () => {
      cy.get('.nav-btn').last().click();
      cy.get('.nav-btn').last().click();
      cy.get('.nav-btn').last().click();
      // Should have navigated 3 months
      cy.get('.month-title').should('be.visible');
    });
  });

  // ==================== Keyboard Shortcut Tests ====================
  
  describe('Keyboard Shortcuts', () => {
    it('should mark WFO with W key', () => {
      cy.get('.calendar .day').not('.weekend').first().click();
      cy.get('body').type('w');
      cy.get('.calendar .day.wfo-day').should('have.length.gte', 1);
    });

    it('should mark leave with L key', () => {
      cy.get('.calendar .day').not('.weekend').first().click();
      cy.get('body').type('l');
      cy.get('.calendar .day.leave-day').should('have.length.gte', 1);
    });

    it('should clear day with Delete key', () => {
      // Mark a day
      cy.get('.calendar .day').not('.weekend').first().click();
      cy.get('button.btn.wfo').click();
      // Clear with Delete
      cy.get('.calendar .day.wfo-day').first().click();
      cy.get('body').type('{del}');
      cy.get('.calendar .day.wfo-day').should('have.length', 0);
    });

    it('should navigate months with arrow keys', () => {
      cy.get('.month-title').then(($title) => {
        const initialMonth = $title.text();
        cy.get('body').type('{rightarrow}');
        cy.get('.month-title').should('not.contain', initialMonth);
      });
    });
  });

  // ==================== Edge Cases Tests ====================
  
  describe('Edge Cases', () => {
    it('should handle marking weekend days', () => {
      cy.get('.calendar .day.weekend').first().click();
      cy.get('button.btn.wfo').click();
      // Should still work
      cy.get('.calendar .day.weekend.wfo-day').should('have.length.gte', 1);
    });

    it('should handle marking same day multiple times', () => {
      cy.get('.calendar .day').not('.weekend').first().click();
      cy.get('button.btn.wfo').click();
      cy.get('button.btn.leave').click();
      // Should update to leave
      cy.get('.calendar .day.leave-day').should('have.length.gte', 1);
    });

    it('should handle many WFO days', () => {
      // Mark 15 WFO days (more than required)
      for (let i = 0; i < 15; i++) {
        cy.get('.calendar .day').not('.weekend').eq(i).click();
        cy.get('button.btn.wfo').click();
      }
      // Progress should not exceed 100%
      cy.get('.info-value.highlight').should('contain', '100');
    });

    it('should handle many leave days reducing required to zero', () => {
      // Mark 24 leave days
      for (let i = 0; i < 24; i++) {
        cy.get('.calendar .day').not('.weekend').eq(i).click();
        cy.get('button.btn.leave').click();
      }
      // Required should be 0
      cy.get('.metric.required .value').should('have.text', '0');
    });
  });

  // ==================== Status Message Tests ====================
  
  describe('Status Messages', () => {
    it('should show initial status message', () => {
      cy.get('.status').should('be.visible');
      cy.get('.status').should('not.be.empty');
    });

    it('should update status when WFO days are marked', () => {
      cy.get('.calendar .day').not('.weekend').first().click();
      cy.get('button.btn.wfo').click();
      cy.get('.status').should('contain', 'complete');
    });

    it('should show achievement message when target is met', () => {
      // Mark 12 WFO days
      for (let i = 0; i < 12; i++) {
        cy.get('.calendar .day').not('.weekend').eq(i).click();
        cy.get('button.btn.wfo').click();
      }
      cy.get('.status').should('contain', 'achieved');
    });
  });

  // ==================== Today Button Tests ====================
  
  describe('Today Button', () => {
    it('should select today when clicking Today button', () => {
      cy.get('button.btn.today').click();
      // The selected day should be highlighted
      cy.get('.day.selected').should('be.visible');
    });
  });

  // ==================== Visual Design Tests ====================
  
  describe('Visual Design', () => {
    it('should have proper color scheme for WFO days', () => {
      cy.get('.calendar .day').not('.weekend').first().click();
      cy.get('button.btn.wfo').click();
      cy.get('.calendar .day.wfo-day').first().should('have.css', 'background-color');
    });

    it('should have proper color scheme for leave days', () => {
      cy.get('.calendar .day').not('.weekend').first().click();
      cy.get('button.btn.leave').click();
      cy.get('.calendar .day.leave-day').first().should('have.css', 'background-color');
    });

    it('should have proper gradient for progress bar', () => {
      cy.get('.bar').should('have.css', 'background-image');
    });

    it('should have proper shadows on metric cards', () => {
      cy.get('.metric').first().should('have.css', 'box-shadow');
    });
  });
});