import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { forkJoin, map, mergeMap, Observable, tap } from 'rxjs';
import { IGrupEtPorRias, IGrupEtPorRiasVisual, IGrupoEtareo, IRias } from 'src/app/interfaces/rias';
import { IFlatNode, IRiasTreeNode } from 'src/app/interfaces/utils';
import { FormulariosService } from 'src/app/services/formularios.service';

interface IRelacion {
  pk: number,
  nombre: string,
  tipo: string,
  
}

@Component({
  selector: 'app-asignacion-rias',
  templateUrl: './asignacion-rias.component.html',
  styleUrls: ['./asignacion-rias.component.css']
})
export class AsignacionRiasComponent {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  private _rias: string = "rias";
  private _grupoEtareo: string = "etareo";

  listaCompletaRias: IRias[] = [];
  listaRias: IRias[] = [];
  listaGruposEtareo: IGrupoEtareo[] = [];

  listaRelaciones:IRelacion[] = [];
  relacion: IGrupEtPorRias = {
    nU_PK_GRERI: -1,
    nU_PK_GRET: -1,
    nU_PK_RIAS: -1
  }

  listaGruposAsociados:IGrupEtPorRiasVisual[] = [];

  listaRiasSrc: MatTreeFlatDataSource<IRiasTreeNode, IFlatNode>;
  private gruposEtAsociados = new Map<number|undefined, IRiasTreeNode>();
  treeControl = new FlatTreeControl<IFlatNode>(
    node => node.level,
    node => node.expandable
  );
  treeFlatener: MatTreeFlattener<IRiasTreeNode, IFlatNode>;

  constructor(
    private api: FormulariosService
  ) { 
    this.treeFlatener = new MatTreeFlattener(
      this._transformer,
      node => node.level,
      node => node.expandable,
      node => node.children
    );
    this.listaRiasSrc = new MatTreeFlatDataSource(this.treeControl, this.treeFlatener)
    forkJoin([this.api.rias, this.api.gruposEtareos])
    .pipe(
      tap(observer => {
        [this.listaCompletaRias, this.listaGruposEtareo] = observer;
         
        this.listaRias = this.listaCompletaRias.filter(r => !r.nU_PADREATENCION_RIAS)
      })
    )
    .subscribe(observer => {
      this.listarGruposAsociados().subscribe(x => console.log(x));
    })

    // this.accordion.ngOnChanges(c => console.log(c));
  }

  get tieneRias():boolean {return this.relacion.nU_PK_RIAS > 0}
  get tieneEtareo():boolean {return this.relacion.nU_PK_GRET > 0}

  private _transformer = (node: IRiasTreeNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      
      pkPadre: -1,
      pk: -1
    };
  };

  listarGruposAsociados = ():Observable<IRiasTreeNode[]> => {
    return this.api.gruposEtPorRias
    .pipe(
      map(this.buscarRias)
    )
  }

  buscarRias = (grupos:IGrupEtPorRias[]): IRiasTreeNode[] => {
    const relaciones: IRiasTreeNode[] = [];
    
    grupos.forEach(val => {
      const grupoEt = this.listaGruposEtareo.find(et => et.nU_PK_GRET === val.nU_PK_GRET);
  
      const lista = this.api.compactarRiasEnArbol(val.nU_PK_RIAS, true);
      if(this.gruposEtAsociados.has(grupoEt?.nU_PK_GRET)) {
        const relacion = this.gruposEtAsociados.get(grupoEt?.nU_PK_GRET);
        if(!relacion) return
        relacion.children = relacion.children?.concat(lista)
        
      } else {
        const relacion:IRiasTreeNode = {
          name: grupoEt?.tX_NOMBRE_GRET || "",
          pk: grupoEt?.nU_PK_GRET || -1,
          pkPadre: -1,
          children: lista
        }
  
        this.gruposEtAsociados.set(relacion.pk, relacion);
        relaciones.push(relacion);
      }
    
    });

    this.listaRiasSrc.data = relaciones;

    return relaciones;
  }

  buscarRiasHijas(grupo:IGrupEtPorRiasVisual):IGrupEtPorRiasVisual[] {
    let children:IGrupEtPorRiasVisual[] = [];

    const rias = this.listaCompletaRias.find(r => r.nU_PK_RIAS === grupo.nU_PK_RIAS);
    if(!rias) return children;

    const hijos = this.listaCompletaRias.filter(ria => ria.nU_PADREATENCION_RIAS === rias.nU_PK_RIAS);
    
    hijos.forEach(hijo => {
      children = children.concat(grupo);
    });


    return children;
  }

  // relacionarRiasHijas = (grupos: IGrupEtPorRiasVisual): IGrupEtPorRiasVisual[] => {

  // }

  asociarRias(obj:IRias) {
    this.relacion.nU_PK_RIAS = obj.nU_PK_RIAS;
    this.listaRelaciones.push({
      pk: obj.nU_PK_RIAS,
      nombre: "Rias | " + obj.tX_ATENCION_RIAS,
      tipo: this._rias
    });
    this.accordion.closeAll();
  }

  asociarGrupEt(obj: IGrupoEtareo) {
    this.relacion.nU_PK_GRET = obj.nU_PK_GRET;
    this.listaRelaciones.push({
      pk: obj.nU_PK_GRET,
      nombre: "Etareo | " + obj.tX_NOMBRE_GRET,
      tipo: this._grupoEtareo
    });
    this.accordion.closeAll();

  }

  eliminarRelacion(pk:number, tipo:string) {
    const i = this.listaRelaciones.findIndex(asoc => asoc.pk === pk && asoc.tipo === tipo);
    if(i !== -1) this.listaRelaciones.splice(i, 1);
    switch(tipo) {
      case this._rias:
        this.relacion.nU_PK_RIAS = -1;
      break;

      case this._grupoEtareo:
        this.relacion.nU_PK_GRET = -1;
      break;
    }
  }

  guardarRelacion() {
    if(this.relacion.nU_PK_RIAS == -1) return;
    
    this.api.postGrupoEtPorRias(this.relacion)
    .subscribe(() => location.reload());
  }

  public hasChild = (_:number, node: IFlatNode) => node.expandable

}
