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

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: TorrentsList, canActivate: [authGuard] },
  { path: 'explore', component: PageExploreComponent, canActivate: [authGuard] },
  { path: 'result', component: MovieCards, canActivate: [authGuard] },
  { path: 'feed/actress', component: FeedActress, canActivate: [authGuard] },
  { path: 'movies/:link/:id', component: MovieinformationComponent },
  { path: 'feed/movies', component: FeedMoviesComponent },
  { path: 'actress/:name', component: ActressPageComponent },
];
