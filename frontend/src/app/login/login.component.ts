import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
import { HomeService } from '../api.service';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    CommonModule,
    
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private homeService: HomeService) {}

  OnInit(): void {
    if (localStorage.getItem('loggedIn') === 'true') {
      this.router.navigate(['/'])
    }
  }

  onSubmit(): void {
    this.homeService
      .login(this.username, this.password)
      .then((success) => {
        if (success) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage = '用户名或密码错误';
        }
      })
      .catch((error) => {
        this.errorMessage = '用户名或密码错误';
        console.error('登录请求失败:', error);
      });
  }
}
