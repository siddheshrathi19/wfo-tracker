import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WfoService } from '../../core/services/wfo.service';
import { MetricsComponent } from './metrics/metrics.component';
import { CalendarComponent } from './calendar/calendar.component';

@Component({
  selector: 'app-wfo-tracker',
  standalone: true,
  imports: [CommonModule, MetricsComponent, CalendarComponent],
  template: `
    <div class="container">
      <h1 class="title">🏢 WFO Tracker</h1>
      
      <app-metrics></app-metrics>
      
      <app-calendar></app-calendar>
    </div>
  `,
  styles: [`
    .container {
      background: white;
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .title {
      font-size: 22px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 12px;
    }
  `]
})
export class WfoTrackerComponent {
  protected readonly wfoService = inject(WfoService);
}