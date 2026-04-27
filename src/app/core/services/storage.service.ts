import { Injectable } from '@angular/core';

/**
 * Service for handling local storage operations
 * Provides type-safe get/set methods for storing data
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly prefix = 'wfo-tracker-';

  /**
   * Save data to local storage
   */
  save<T>(key: string, data: T): void {
    try {
      const fullKey = this.prefix + key;
      localStorage.setItem(fullKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  /**
   * Load data from local storage
   */
  load<T>(key: string): T | null {
    try {
      const fullKey = this.prefix + key;
      const data = localStorage.getItem(fullKey);
      return data ? JSON.parse(data) as T : null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  }

  /**
   * Remove data from local storage
   */
  remove(key: string): void {
    try {
      const fullKey = this.prefix + key;
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  /**
   * Clear all app data from local storage
   */
  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}