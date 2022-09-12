import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil, tap } from 'rxjs';
import { IGrupoEtareo } from 'src/app/interfaces/rias';
import { IColDefinition } from 'src/app/interfaces/utils';
import { FormulariosService } from 'src/app/services/formularios.service';
import { CrearRiasComponent } from '../../dialogs/crear-rias/crear-rias.component';

@Component({
  selector: 'app-maestros-basicos',
  templateUrl: './maestros-basicos.component.html',
  styleUrls: ['./maestros-basicos.component.css']
})
export class MaestrosBasicosComponent implements OnInit {

  public colsDefinition:IColDefinition[] = [
    {
    titulo: "Item",
    campo: "tX_NOMBRE_GRET"
    },
    {
    titulo: "Sexo",
    campo: "tX_GENERO_GRET"
    }
  ]

  form:FormGroup = this.fb.group({
    nU_PK_GRET: -1,
    tX_NOMBRE_GRET: "",
    tX_GENERO_GRET: "",
    nU_EDADINICIAL_GRET: null,
    nU_EDADFINAL_GRET: null,
    nU_UNIDADMEDIDA_GRET: 0,
    tX_AUTOMATICO_GRET: 0
  });

  listaGrupoEtareo:IGrupoEtareo[] = [];

  public cols = this.colsDefinition.map(col => col.campo).concat(["edadInicial", "edadFinal"])

  public dataSource:MatTableDataSource<any> = new MatTableDataSource();


  private stop = new Subject();
  constructor(
    private formServ:FormulariosService,
    private dg: MatDialog,
    private fb: FormBuilder,
    private api: FormulariosService
  ) { }

  ngOnInit(): void {
    this.listarGruposEtareos();
  }

  listarGruposEtareos() {
    this.formServ.gruposEtareos
    .pipe(takeUntil(this.stop), tap(g => this.listaGrupoEtareo = g))
    .subscribe(() => {
      this.dataSource.data = this.listaGrupoEtareo;
    })
  }

  renderEdades(unidad: number, edad: number):string {
    const calc = (t: number) => Math.floor(edad / t);
    switch(unidad) {
      case 1:
        return calc(28) + " Mes" + (calc(28) > 1 ? "es" : "");

      case 2:
        return calc(365) + " Año" + (calc(365) > 1 ? "s" : "");
      default:
        return calc(1) + " Día" + (calc(1) > 1 ? "s" : "");
    }
  }

  abrirCrearRias() {
    this.dg.open(CrearRiasComponent);
  }

  guardarGrupoEtareo() {
    const grupo:IGrupoEtareo = this.form.value;
    const tipoEdad = grupo.nU_UNIDADMEDIDA_GRET;
    switch(tipoEdad) {
      case 1:
        grupo.nU_EDADINICIAL_GRET = grupo.nU_EDADINICIAL_GRET * 28;
        grupo.nU_EDADFINAL_GRET = grupo.nU_EDADFINAL_GRET * 28;
      break;

      case 2:
        grupo.nU_EDADINICIAL_GRET = grupo.nU_EDADINICIAL_GRET * 365;
        grupo.nU_EDADFINAL_GRET = grupo.nU_EDADFINAL_GRET * 365;
      break;

      default:
      break;
    }

    console.log(grupo);
    // return;
    this.api.postGrupoEtareo(grupo)
    .subscribe(r => {
      console.log(r);
      this.form.reset();
      this.listarGruposEtareos();
    });
  }

}
