import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkThemeSubject = new BehaviorSubject<boolean>(false);
  isDarkTheme$ = this.darkThemeSubject.asObservable();

  constructor() {
    // Check if user has already set theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    this.setTheme(isDark);
  }

  toggleTheme() {
    this.setTheme(!this.darkThemeSubject.value);
  }

  private setTheme(isDark: boolean) {
    this.darkThemeSubject.next(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }

  isDark(): boolean {
    return this.darkThemeSubject.value;
  }
}
