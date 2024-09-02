import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataDisplayComponent } from './components/data-display/data-display.component';

const routes: Routes = [
  { path: '', redirectTo: '/tab1', pathMatch: 'full' },
  { path: 'tab1', component: DataDisplayComponent, data: { tab: 'tab1' } },
  { path: 'tab2', component: DataDisplayComponent, data: { tab: 'tab2' } },
  { path: 'tab3', component: DataDisplayComponent, data: { tab: 'tab3' } },
  { path: '**', redirectTo: '/tab1' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
