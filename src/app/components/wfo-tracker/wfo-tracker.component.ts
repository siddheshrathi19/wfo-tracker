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
    :host {
      display: block;
      width: 100%;
    }

    .container {
      background: white;
      border-radius: 16px;
      padding: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      max-width: 720px;
      width: 100%;
      margin: 0 auto;
    }

    .title {
      font-size: 18px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 10px;
      color: #1e293b;
    }

    /* Mobile (< 768px) */
    @media (max-width: 767px) {
      .container {
        border-radius: 12px;
        padding: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      }

      .title {
        font-size: 16px;
        margin-bottom: 8px;
      }
    }

    /* Tablet (768px - 1023px) */
    @media (min-width: 768px) and (max-width: 1023px) {
      .container {
        max-width: 600px;
        padding: 16px;
      }

      .title {
        font-size: 20px;
        margin-bottom: 12px;
      }
    }

    /* Desktop (1024px+) */
    @media (min-width: 1024px) {
      .container {
        max-width: 520px;
        padding: 20px;
        border-radius: 20px;
      }

      .title {
        font-size: 24px;
        margin-bottom: 16px;
      }
    }
  `]
})
export class WfoTrackerComponent {
  protected readonly wfoService = inject(WfoService);
}