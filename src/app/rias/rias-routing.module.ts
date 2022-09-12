import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MaestrosBasicosComponent } from './components/maestros-basicos/maestros-basicos.component';
import { AsignacionRiasComponent } from './components/asignacion-rias/asignacion-rias.component';

const routes: Routes = [
  {
    path: "",
    children: [{
      path: "GruposEtareos",
      component: MaestrosBasicosComponent
    }, {
      path: "AsignacionRias",
      component: AsignacionRiasComponent
    }]
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class RiasRoutingModule { }
