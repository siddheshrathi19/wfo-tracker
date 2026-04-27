import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WfoService } from '../../../core/services/wfo.service';

@Component({
  selector: 'app-metrics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metrics.component.html',
  styleUrl: './metrics.component.css'
})
export class MetricsComponent {
  protected readonly wfoService = inject(WfoService);

  markSelectedDay(status: 'wfo' | 'leave'): void {
    const selectedDay = this.wfoService.selectedDay();
    if (selectedDay) {
      this.wfoService.markDay(selectedDay, status);
    }
  }

  clearSelectedDay(): void {
    const selectedDay = this.wfoService.selectedDay();
    if (selectedDay) {
      this.wfoService.clearDay(selectedDay);
    }
  }
}