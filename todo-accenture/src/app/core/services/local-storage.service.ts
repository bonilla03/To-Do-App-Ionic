import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  getItem<T>(key: string, fallbackValue: T): T {
    const storedValue = localStorage.getItem(key);

    if (!storedValue) {
      return fallbackValue;
    }

    try {
      return JSON.parse(storedValue) as T;
    } catch {
      return fallbackValue;
    }
  }

  setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
