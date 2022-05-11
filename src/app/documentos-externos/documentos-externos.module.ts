import { NgModule } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MaterialModule } from '../modules/material.module';
import { IncapacidadesComponent } from './components/incapacidades/incapacidades.component';
import { OrdenesMedicasComponent } from './components/ordenes-medicas/ordenes-medicas.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { ConsentimientosInformadosComponent } from './components/consentimientos-informados/consentimientos-informados.component';



@NgModule({
  declarations: [
    IncapacidadesComponent,
    OrdenesMedicasComponent,
    ConsentimientosInformadosComponent,
  ],
  imports: [
    MaterialModule,
    FormsModule,
  ],
  exports: [
    IncapacidadesComponent,
    OrdenesMedicasComponent,
    ConsentimientosInformadosComponent
  ]
})
export class DocumentosExternosModule { }
