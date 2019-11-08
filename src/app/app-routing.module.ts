import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
 { path: '', redirectTo: '/login', pathMatch: 'full' },
 { path: 'home', component: HomeComponent },
 { path: '**', redirectTo: '/home', pathMatch: 'full' },
    
 { path: 'login', loadChildren: './login/login.module#LoginModule' }

];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
