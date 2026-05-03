# WFO Tracker - Work From Office Tracking Application

A responsive Angular application to track Work From Office (WFO) days, leave/holidays, and calculate required mandatory days dynamically.

## Features

- 📅 **Calendar View** - Visual calendar to mark WFO and leave days
- 📊 **Metrics Dashboard** - Real-time tracking of working days, leave days, effective days, and required days
- 🔄 **Dynamic Calculation** - Every 2 leave/holiday days reduces 1 mandatory WFO day
- ⌨️ **Keyboard Shortcuts** - Quick marking with W (WFO), L (Leave), Del (Clear), Arrow keys (navigate months)
- 📱 **Fully Responsive** - Works on all devices: mobile, tablet, iPad, laptop, desktop
- 🧪 **E2E Testing** - Comprehensive Cypress test suite

## Responsive Design

The app is optimized for all screen sizes:

| Device | Screen Width | Behavior |
|--------|--------------|----------|
| Mobile | < 768px | No scroll, fits on screen |
| Tablet | 768px - 1023px | Centered, scroll if needed |
| Desktop/Laptop | ≥ 1024px | Centered, larger UI |

## WFO Calculation Logic

- **Default Required Days**: 12 days per month
- **Leave/Holiday Impact**: Every 2 leave days reduces 1 required WFO day

| Leave Days | Required WFO Days |
|------------|-------------------|
| 0 | 12 |
| 1 | 12 |
| 2 | 11 |
| 3 | 11 |
| 4 | 10 |
| ... | ... |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `W` | Mark selected day as WFO |
| `L` | Mark selected day as Leave |
| `Delete` / `Backspace` | Clear selected day |
| `←` | Previous month |
| `→` | Next month |

## Installation

```bash
npm install
```

## Running the Application

```bash
# Development server
npm start

# Build for production
npm run build
```

## Running E2E Tests with Cypress

### Run tests in headless mode (1 click)
```bash
npm run test:e2e
```

### Run tests with UI (headed mode)
```bash
npm run test:e2e:headed
```

### Open Cypress UI
```bash
npm run cy:open
```

## Test Coverage

The Cypress E2E test suite includes **60+ tests** covering:

### UI Rendering Tests
- Main title display
- Metrics component display
- Calendar component display
- All 4 metric cards
- Action buttons
- Month navigation
- Progress bar

### Responsive Design Tests
- Mobile (375x667)
- Tablet (768x1024)
- Laptop (1366x768)
- Desktop (1920x1080)
- iPad Pro (1024x1366)

### Functionality Tests
- WFO day marking
- Leave day marking
- Clear day functionality
- Required days calculation
- Progress tracking
- Month navigation
- Keyboard shortcuts
- Edge cases

## Project Structure

```
wfo-tracker/
├── cypress/
│   ├── e2e/
│   │   └── wfo-tracker.cy.js    # Main E2E test file
│   └── support/
│       ├── commands.js          # Custom Cypress commands
│       └── e2e.js               # Support file
├── cypress.config.js            # Cypress configuration
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── wfo-tracker/
│   │   │       ├── calendar/
│   │   │       ├── metrics/
│   │   │       └── wfo-tracker.component.ts
│   │   ├── core/
│   │   │   └── services/
│   │   │       ├── wfo.service.ts
│   │   │       └── storage.service.ts
│   │   └── app.component.ts
│   ├── styles.css
│   └── index.html
├── angular.json
├── package.json
└── README.md
```

## Technology Stack

- **Framework**: Angular 21
- **Language**: TypeScript
- **Testing**: Cypress (E2E)
- **Styling**: CSS (responsive)
- **State Management**: Angular Signals

## License

MIT