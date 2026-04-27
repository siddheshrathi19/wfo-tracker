import { Injectable, signal, computed, effect } from '@angular/core';
import { StorageService } from './storage.service';

export type DayStatus = 'wfo' | 'leave' | null;

export interface DayEntry {
  date: string;
  status: DayStatus;
}

export interface WfoMetrics {
  workDays: number;
  leaveDays: number;
  effectiveDays: number;
  requiredDays: number;
  remainingDays: number;
  daysLeftInMonth: number;
  progressPercent: number;
}

@Injectable({
  providedIn: 'root'
})
export class WfoService {
  // Signals for reactive state
  private readonly _entries = signal<Map<string, DayStatus>>(new Map());
  private readonly _currentMonth = signal(new Date().getMonth());
  private readonly _currentYear = signal(new Date().getFullYear());
  private readonly _requiredDaysPerMonth = signal(12);

  // Public readonly signals
  readonly entries = this._entries.asReadonly();
  readonly currentMonth = this._currentMonth.asReadonly();
  readonly currentYear = this._currentYear.asReadonly();

  // Computed signals for derived state
  readonly metrics = computed<WfoMetrics>(() => {
    const entries = this._entries();
    const year = this._currentYear();
    const month = this._currentMonth();
    const baseRequired = this._requiredDaysPerMonth();

    const daysInMonth = this.getDaysInMonth(year, month);
    const today = new Date();
    const currentDay = today.getFullYear() === year && today.getMonth() === month 
      ? today.getDate() 
      : daysInMonth;

    let workDays = 0;
    let leaveDays = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = this.getDateKey(year, month, day);
      const status = entries.get(dateKey);
      
      if (status === 'wfo') workDays++;
      if (status === 'leave') leaveDays++;
    }

    // Calculate required WFO days: Every 2 leave/holiday days reduces 1 required WFO day
    const requiredDays = Math.max(0, baseRequired - Math.floor(leaveDays / 2));
    
    const effectiveDays = workDays;
    const remainingDays = Math.max(0, requiredDays - effectiveDays);
    
    // Calculate days left in current month (from today onwards)
    const now = new Date();
    let daysLeftInMonth = 0;
    if (now.getFullYear() === year && now.getMonth() === month) {
      for (let day = now.getDate(); day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          daysLeftInMonth++;
        }
      }
    }

    const progressPercent = requiredDays > 0 ? Math.round((effectiveDays / requiredDays) * 100) : 100;

    return {
      workDays,
      leaveDays,
      effectiveDays,
      requiredDays,
      remainingDays,
      daysLeftInMonth,
      progressPercent
    };
  });

  // Computed signal for month title
  readonly monthTitle = computed(() => {
    const date = new Date(this._currentYear(), this._currentMonth(), 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  });

  // Computed signal for calendar days
  readonly calendarDays = computed(() => {
    const year = this._currentYear();
    const month = this._currentMonth();
    const entries = this._entries();
    const today = new Date();
    
    const firstDay = new Date(year, month, 1);
    const daysInMonth = this.getDaysInMonth(year, month);
    const startDayOfWeek = firstDay.getDay();
    
    const days: Array<{
      day: number;
      dateKey: string;
      status: DayStatus;
      isToday: boolean;
      isWeekend: boolean;
      isCurrentMonth: boolean;
    }> = [];

    // Previous month days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthDays = this.getDaysInMonth(prevYear, prevMonth);
    
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const dateKey = this.getDateKey(prevYear, prevMonth, day);
      days.push({
        day,
        dateKey,
        status: entries.get(dateKey) || null,
        isToday: false,
        isWeekend: true,
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = this.getDateKey(year, month, day);
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isToday = today.getFullYear() === year && 
                      today.getMonth() === month && 
                      today.getDate() === day;

      days.push({
        day,
        dateKey,
        status: entries.get(dateKey) || null,
        isToday,
        isWeekend,
        isCurrentMonth: true
      });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    
    for (let day = 1; day <= remainingDays; day++) {
      const dateKey = this.getDateKey(nextYear, nextMonth, day);
      days.push({
        day,
        dateKey,
        status: entries.get(dateKey) || null,
        isToday: false,
        isWeekend: true,
        isCurrentMonth: false
      });
    }

    return days;
  });

  // Computed signal for selected day
  readonly selectedDay = signal<string | null>(null);

  // Computed signal for status message
  readonly statusMessage = computed(() => {
    const metrics = this.metrics();
    if (metrics.progressPercent >= 100) {
      return '🎉 Target achieved! Great work!';
    } else if (metrics.progressPercent >= 80) {
      return '💪 Almost there! Keep going!';
    } else if (metrics.effectiveDays > 0) {
      return `📊 ${metrics.progressPercent}% complete - ${metrics.remainingDays} days to go`;
    } else {
      return '📅 Start marking your WFO days!';
    }
  });

  constructor(private storageService: StorageService) {
    // Load saved entries from storage
    this.loadEntries();
    
    // Auto-save entries when they change
    effect(() => {
      const entries = this._entries();
      this.storageService.save('wfo-entries', Object.fromEntries(entries));
    });
  }

  private getDateKey(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  private getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  private loadEntries(): void {
    const saved = this.storageService.load<Record<string, DayStatus>>('wfo-entries');
    if (saved) {
      this._entries.set(new Map(Object.entries(saved)));
    }
  }

  // Public methods
  markDay(dateKey: string, status: DayStatus): void {
    this._entries.update(entries => {
      const newEntries = new Map(entries);
      if (status === null) {
        newEntries.delete(dateKey);
      } else {
        newEntries.set(dateKey, status);
      }
      return newEntries;
    });
  }

  markToday(): void {
    const today = new Date();
    const dateKey = this.getDateKey(today.getFullYear(), today.getMonth(), today.getDate());
    this.selectedDay.set(dateKey);
  }

  clearDay(dateKey: string): void {
    this.markDay(dateKey, null);
  }

  selectDay(dateKey: string): void {
    this.selectedDay.set(dateKey);
  }

  changeMonth(delta: number): void {
    this._currentMonth.update(month => {
      let newMonth = month + delta;
      let newYear = this._currentYear();
      
      if (newMonth > 11) {
        newMonth = 0;
        this._currentYear.update(y => y + 1);
      } else if (newMonth < 0) {
        newMonth = 11;
        this._currentYear.update(y => y - 1);
      }
      
      return newMonth;
    });
  }

  setRequiredDays(days: number): void {
    this._requiredDaysPerMonth.set(days);
  }

  getEntry(dateKey: string): DayStatus {
    return this._entries().get(dateKey) || null;
  }
}