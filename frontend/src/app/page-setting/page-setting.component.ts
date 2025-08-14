import { environment } from './../../environments/environment.prod';
import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

interface EnvironmentConfig {
  PROWLARR_URL: string;
  PROWLARR_KEY: string;
  DOWNLOAD_PATH: string;

  QB_HOST: string;
  QB_PORT: string;
  QB_USERNAME: string;
  QB_PASSWORD: string;
  QB_KEYWORD_FILTER: string[];

  TELEGRAM_TOKEN: string;
  TELEGRAM_CHAT_ID: string;

  EMBY_URL: string;
  EMBY_API_KEY: string;
}


@Component({
  selector: 'app-page-setting',
  standalone: true,
  imports: [CommonModule, FormsModule,MatCardModule,MatFormFieldModule,MatInputModule,MatButtonModule],
  templateUrl: './page-setting.component.html',
  styleUrls: ['./page-setting.component.css']
})
export class PageSettingComponent {
  username: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';
  isLoading: boolean = false;


  env: EnvironmentConfig = {
    PROWLARR_URL: '',
    PROWLARR_KEY: '',
    DOWNLOAD_PATH: '',
    QB_HOST: '',
    QB_PORT: '',
    QB_USERNAME: '',
    QB_PASSWORD: '',
    QB_KEYWORD_FILTER: [],
    TELEGRAM_TOKEN: '',
    TELEGRAM_CHAT_ID: '',
    EMBY_URL: "",
    EMBY_API_KEY: ""
  };

  ngOnInit() {
    this.apiService.getEnvironment()
      .then((data: EnvironmentConfig) => {
        this.env = data;
      })
      .catch(error => {
        console.error('获取环境变量失败:', error);
      });
  }


  async saveEnv() {
    console.log('保存环境变量:', this.env);
    try {
      const success = await this.apiService.updateEnvironment(this.env);
      if (success) {
      } else {
      }
    } catch (error) {
      console.error('保存环境变量出错:', error);
    }
  }

  constructor(private apiService: ApiService) {
    // 假设用户名从 localStorage 获取
    this.username = localStorage.getItem('username') || '';
  }

  async onChangePassword() {
    this.message = '';

    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.message = '请填写完整信息';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.message = '两次输入的新密码不一致';
      return;
    }

    this.isLoading = true;

  try {
    const success = await this.apiService.changePassword(
      this.username,
      this.oldPassword,
      this.newPassword
    );

    this.message = success
      ? '密码修改成功'
      : '密码修改失败，请检查旧密码';

    if (success) {
      // 清空表单
      this.oldPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    }
  } catch (error) {
    console.error(error);
    this.message = '修改密码时发生错误，请稍后再试';
  } finally {
    this.isLoading = false;
  }
  }
}