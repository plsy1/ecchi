// src/app/theme.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkClass = 'dark-theme';

  constructor() {
    // 初始化：读取 localStorage 保存的主题
    const isDark = localStorage.getItem('isDarkTheme') === 'true';
    this.setDarkTheme(isDark);
  }

  isDarkTheme(): boolean {
    return document.body.classList.contains(this.darkClass);
  }

  toggleTheme(): void {
    const isDark = this.isDarkTheme();
    this.setDarkTheme(!isDark);
  }

  setDarkTheme(isDark: boolean): void {
    if (isDark) {
      document.body.classList.add(this.darkClass);
    } else {
      document.body.classList.remove(this.darkClass);
    }
    localStorage.setItem('isDarkTheme', isDark.toString());
  }
}
