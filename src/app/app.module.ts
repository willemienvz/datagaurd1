import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataDisplayComponent } from './components/data-display/data-display.component';
import { SidePanelComponent } from './components/side-panel/side-panel.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { LogoComponent } from './components/logo/logo.component';
@NgModule({
  declarations: [
    AppComponent,
    DataDisplayComponent,
    SidePanelComponent,
    LogoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatSlideToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
