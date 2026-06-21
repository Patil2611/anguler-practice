import { Routes } from '@angular/router';
import { Home } from './home/home';
import { About } from './about/about';
import { Contact } from './contact/contact';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'about', component: About},
  { path: 'contact', component: Contact}, // Placeholder for contact page
  // Wildcard route for unknown routes
  { path: "**", component: Home}
];
