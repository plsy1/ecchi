import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './page/home/home.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { SettingsComponent } from './page/settings/settings.component';
import { PerformerSubscriptionComponent } from './page/performer-subscription/performer-subscription.component';
import { ProductionSubscriptionComponent } from './page/production-subscription/production-subscription.component';
import { TorrentListComponent } from './page/torrent-list/torrent-list.component';
import { LoginComponent } from './page/login/login.component';
import { ExploreComponent } from './page/explore/explore.component';
import { DownloadComponent } from './page/download/download.component';
import { KeywordsSearchComponent } from './page/keywords-search/keywords-search.component';
import { PerformerInformationComponent } from './page/performer-information/performer-information.component';
import { ProductionInformationComponent } from './page/production-information/production-information.component';
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'explore', component: ExploreComponent },
      {
        path: 'subscription/performer',
        component: PerformerSubscriptionComponent,
      },
      {
        path: 'subscription/production',
        component: ProductionSubscriptionComponent,
      },
      { path: 'torrents', component: TorrentListComponent, canActivate: [authGuard]},
      { path: 'download', component: DownloadComponent },
      { path: 'keywords', component: KeywordsSearchComponent },
      { path: 'keywords/:value', component: KeywordsSearchComponent },
      { path: 'performer/:name', component: PerformerInformationComponent },
      { path: 'production/:id', component: ProductionInformationComponent },
    ],
  },
        { path: 'login', component: LoginComponent },
  // { path: '**', redirectTo: '' },
];
