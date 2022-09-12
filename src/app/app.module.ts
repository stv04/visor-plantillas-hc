import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './historia-clinica/components/header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ContentComponent } from './content/content.component';
import { ContainerComponent } from './container/container.component';
import { BuscarHistoriaClinicaComponent } from './buscar-historia-clinica/buscar-historia-clinica.component';
import { MPlantillasHcComponent } from './m-plantillas-hc/m-plantillas-hc.component';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

// Módulos
import { MaterialModule } from './modules/material.module';
import { DropPerfilComponent } from './drop-perfil/drop-perfil.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuFlotanteComponent } from './components/menu-flotante/menu-flotante.component';
import { DocumentosExternosModule } from './documentos-externos/documentos-externos.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    ContentComponent,
    ContainerComponent,
    BuscarHistoriaClinicaComponent,
    MPlantillasHcComponent,
    DropPerfilComponent,
    MenuFlotanteComponent,
  ],
  imports: [
    BrowserModule,
    DocumentosExternosModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSummernoteModule,
    SweetAlert2Module.forRoot(),
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
