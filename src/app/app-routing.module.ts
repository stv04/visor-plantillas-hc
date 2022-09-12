import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormatosComponent } from './historia-clinica/components/formatos/formatos.component';

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./historia-clinica/historia-clinica.module").then(m => m.HistoriaClinicaModule)
  },
  {
    path: "MaestrosBasicos",
    loadChildren: () => import("./rias/rias.module").then(m => m.RiasModule)
  },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
