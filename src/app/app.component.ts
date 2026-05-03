import { Component } from '@angular/core';
import { WfoTrackerComponent } from './components/wfo-tracker/wfo-tracker.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WfoTrackerComponent],
  template: `
    <div class="app-container">
      <app-wfo-tracker></app-wfo-tracker>
    </div>
  `,
  styles: [`
    .app-container {
      width: 100%;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }

    @media (min-width: 768px) {
      .app-container {
        padding: 16px;
      }
    }

    @media (min-width: 1024px) {
      .app-container {
        padding: 24px;
      }
    }
  `]
})
export class AppComponent {}