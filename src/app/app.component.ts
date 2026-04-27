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
      max-width: 420px;
      margin: 0 auto;
    }
  `]
})
export class AppComponent {}