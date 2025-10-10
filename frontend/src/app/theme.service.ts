// src/app/theme.service.ts
import { Injectable, OnDestroy } from '@angular/core';
export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService implements OnDestroy {
  private currentTheme: ThemeMode;
  private mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
  private listener = () => {
    if (this.currentTheme === 'system') {
      this.applyTheme('system');
    }
  };

  constructor() {
    const saved = localStorage.getItem('themeMode') as ThemeMode | null;
    this.currentTheme = saved || 'system';
    this.applyTheme(this.currentTheme);
    this.mediaQueryList.addEventListener('change', this.listener);
  }

  ngOnDestroy() {
    this.mediaQueryList.removeEventListener('change', this.listener);
  }

  isDarkTheme(): boolean {
    if (this.currentTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.currentTheme === 'dark';
  }

  getThemeIcon(): string {
    switch (this.currentTheme) {
      case 'light':
        return 'fa-sun';
      case 'dark':
        return 'fa-moon';
      case 'system':
        return 'fa-desktop';
    }
  }

  toggleTheme() {
    switch (this.currentTheme) {
      case 'light':
        this.currentTheme = 'dark';
        break;
      case 'dark':
        this.currentTheme = 'system';
        break;
      case 'system':
        this.currentTheme = 'light';
        break;
    }
    localStorage.setItem('themeMode', this.currentTheme);
    this.applyTheme(this.currentTheme);
  }

  private applyTheme(mode: ThemeMode) {
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme');

    if (mode === 'light') {
      body.classList.add('light-theme');
    } else if (mode === 'dark') {
      body.classList.add('dark-theme');
    } else {
      if (this.mediaQueryList.matches) {
        body.classList.add('dark-theme');
      } else {
        body.classList.add('light-theme');
      }
    }
  }
}
