import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ContentComponent } from './content/content.component';
import { ContainerComponent } from './container/container.component';
import { BuscarHistoriaClinicaComponent } from './buscar-historia-clinica/buscar-historia-clinica.component';
import { MPlantillasHcComponent } from './m-plantillas-hc/m-plantillas-hc.component';

// Módulos
import { MaterialModule } from './modules/material.module';
import { DropPerfilComponent } from './drop-perfil/drop-perfil.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    ContentComponent,
    ContainerComponent,
    BuscarHistoriaClinicaComponent,
    MPlantillasHcComponent,
    DropPerfilComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
