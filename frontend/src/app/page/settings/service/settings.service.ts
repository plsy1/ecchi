import { Injectable } from '@angular/core';
import { EnvironmentConfig } from '../models/settings.interface';
import { CommonService } from '../../../common.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private common: CommonService) {}
  async updateEnvironment(env: EnvironmentConfig): Promise<boolean> {
    const url = `${this.common.apiUrl}/auth/updateEnvironment`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(env),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error:', errorData);
        return false;
      }

      const data = await response.json();
      return data.success ?? true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }


    async getEnvironment() {
    const url = `${this.common.apiUrl}/auth/getEnvironment`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data: EnvironmentConfig = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching keyword feeds:', error);
      throw error;
    }
  }

    async changePassword(
    username: string,
    old_password: string,
    new_password: string
  ): Promise<boolean> {
    const url = `${this.common.apiUrl}/auth/changepassword`;

    // 使用 FormData 发送表单数据
    const formData = new FormData();
    formData.append('username', username);
    formData.append('old_password', old_password);
    formData.append('new_password', new_password);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // 如果 422 或其他状态码
        const errorData = await response.json().catch(() => ({}));
        console.error('修改密码失败:', errorData);
        return false;
      }

      const data = await response.json();

      return data.message === 'Password updated successfully';
    } catch (error) {
      console.error('修改密码请求失败:', error);
      return false;
    }
  }


}
