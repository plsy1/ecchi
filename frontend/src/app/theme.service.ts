// src/app/theme.service.ts
import { Injectable } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private currentTheme: ThemeMode;

  constructor() {
    const saved = localStorage.getItem('themeMode') as ThemeMode | null;
    this.currentTheme = saved || 'system';
    this.applyTheme(this.currentTheme);
  }

  isDarkTheme(): boolean {
    if (this.currentTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.currentTheme === 'dark';
  }

  getThemeIcon(): string {
    switch (this.currentTheme) {
      case 'light': return 'fa-sun';
      case 'dark': return 'fa-moon';
      case 'system': return 'fa-desktop';
    }
  }

  toggleTheme() {
    switch (this.currentTheme) {
      case 'light': this.currentTheme = 'dark'; break;
      case 'dark': this.currentTheme = 'system'; break;
      case 'system': this.currentTheme = 'light'; break;
    }
    localStorage.setItem('themeMode', this.currentTheme);
    this.applyTheme(this.currentTheme);
  }

  private applyTheme(mode: ThemeMode) {
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme');
    if (mode === 'light') body.classList.add('light-theme');
    if (mode === 'dark') body.classList.add('dark-theme');
    // system 模式不加任何类，让 CSS media query 生效
  }
}