import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DayStatus, WfoService } from '../../../core/services/wfo.service';

interface CalendarDay {
  day: number;
  dateKey: string;
  status: DayStatus;
  isToday: boolean;
  isWeekend: boolean;
  isCurrentMonth: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  protected readonly wfoService = inject(WfoService);
  
  readonly weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  selectDay(day: CalendarDay): void {
    if (!day.isCurrentMonth) {
      this.wfoService.navigateToDate(day.dateKey);
    }
    this.wfoService.selectDay(day.dateKey);
  }

  trackByDateKey(index: number, day: CalendarDay): string {
    return day.dateKey;
  }
}