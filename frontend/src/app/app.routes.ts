import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SubComponent } from './movies-search-results/movies-search-results.component';
import { FindComponent } from './feed-actress/feed-actress';

import { LoginComponent } from './login/login.component';

import { MovieinformationComponent } from './movieinformation/movieinformation.component';

import { FeedMoviesComponent } from './feed-movies/feed-movies.component';

import { ActressPageComponent } from './actress-page/actress-page.component';

import { authGuard } from './auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent }, 
    { path: '', component: HomeComponent, canActivate: [authGuard] },
    { path: 'result',component: SubComponent, canActivate: [authGuard]},
    { path: 'feed/actress',component: FindComponent, canActivate: [authGuard]},
    { path: 'movies/:link/:id', component: MovieinformationComponent },  // 动态路由
    { path: 'feed/movies', component: FeedMoviesComponent },  // 动态路由
    { path: 'actress/:name', component: ActressPageComponent },  // 动态路由
];
