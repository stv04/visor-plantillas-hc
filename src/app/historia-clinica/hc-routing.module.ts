import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormatosComponent } from './components/formatos/formatos.component';

const routes: Routes = [
  {
    path: "",
    children: [{
        path: "",
        component: FormatosComponent
    }, {
      path: ":idAfil",
      component: FormatosComponent
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
export class HcRoutingModule { }
