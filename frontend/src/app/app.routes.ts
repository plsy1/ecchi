import { Routes } from '@angular/router';
import { TorrentsList } from './list-torrents-search-result/torrents-list.component';
import { MovieCards } from './card-movies/movie-cards.component';
import { FeedActress } from './page-feed-actress/feed-actress';
import { LoginComponent } from './page-login/login.component';
import { MovieinformationComponent } from './page-movie/movie-information.component';
import { FeedMoviesComponent } from './page-feed-movies/feed-movies.component';
import { ActressPageComponent } from './page-actress/actress-page.component';
import { authGuard } from './auth.guard';
import { PageExploreComponent } from './page-explore/page-explore.component';
import { PageDashboardComponent } from './page-dashboard/page-dashboard.component';
import { PageSettingComponent } from './page-setting/page-setting.component';
import { PageDownloadManagementComponent } from './page-download-management/page-download-management.component';

export const routes: Routes = [
  { path: 'dashboard', component: PageDashboardComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'torrents', component: TorrentsList, canActivate: [authGuard] },
  { path: 'explore', component: PageExploreComponent, canActivate: [authGuard] },
  { path: 'search/:keywords', component: MovieCards, canActivate: [authGuard] },
  { path: 'feed/actress', component: FeedActress, canActivate: [authGuard] },
  { path: 'movies/:id', component: MovieinformationComponent, canActivate: [authGuard] },
  { path: 'feed/movies', component: FeedMoviesComponent, canActivate: [authGuard] },
  { path: 'actress/:name', component: ActressPageComponent, canActivate: [authGuard] },
  { path: 'setting', component: PageSettingComponent, canActivate: [authGuard] },
  { path: 'download', component: PageDownloadManagementComponent, canActivate: [authGuard] },
];
