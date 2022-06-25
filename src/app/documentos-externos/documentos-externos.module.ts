import { NgModule } from '@angular/core';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../modules/material.module';
import { IncapacidadesComponent } from './components/incapacidades/incapacidades.component';
import { OrdenesMedicasComponent } from './components/ordenes-medicas/ordenes-medicas.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { ConsentimientosInformadosComponent } from './components/consentimientos-informados/consentimientos-informados.component';
import { HcAfiliadoComponent } from './modals/hc-afiliado/hc-afiliado.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { DatePipe } from '@angular/common';
import { CargarAfiliadoDirective } from './directivas/cargar-afiliado.directive';



@NgModule({
  declarations: [
    IncapacidadesComponent,
    OrdenesMedicasComponent,
    ConsentimientosInformadosComponent,
    HcAfiliadoComponent,
    CargarAfiliadoDirective,
  ],
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SweetAlert2Module
  ],
  providers: [DatePipe],
  exports: [
    IncapacidadesComponent,
    OrdenesMedicasComponent,
    ConsentimientosInformadosComponent
  ]
})
export class DocumentosExternosModule { }
