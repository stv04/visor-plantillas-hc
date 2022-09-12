import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaestrosBasicosComponent } from './components/maestros-basicos/maestros-basicos.component';
import { MaterialModule } from '../modules/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RiasRoutingModule } from './rias-routing.module';
import { CrearRiasComponent } from './dialogs/crear-rias/crear-rias.component';
import { AsignacionRiasComponent } from './components/asignacion-rias/asignacion-rias.component';



@NgModule({
  declarations: [
    MaestrosBasicosComponent,
    CrearRiasComponent,
    AsignacionRiasComponent
  ],
  imports: [
    RiasRoutingModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class RiasModule { }
