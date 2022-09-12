import { DomPortal, Portal, TemplatePortal } from '@angular/cdk/portal';
import { FlatTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { tap } from 'rxjs';
import { IRias } from 'src/app/interfaces/rias';
import { IFlatNode, IRiasTreeNode } from 'src/app/interfaces/utils';
import { FormulariosService } from 'src/app/services/formularios.service';



@Component({
  selector: 'app-crear-rias',
  templateUrl: './crear-rias.component.html',
  styleUrls: ['../../../main-dialog.css']
})
export class CrearRiasComponent implements OnInit {
  portal!: Portal<any>

  listaRias:IRias[] = [];
  ctrlForm = {
    nU_PK_RIAS: -1,
    tX_TIPOATENCION_RIAS: "",
    tX_ATENCION_RIAS: "",
    nU_PADREATENCION_RIAS: 0,
    nU_PK_TIPRIA: 0
  }
  form: FormArray = this.fb.array([this.fb.group(this.ctrlForm)])

  flatNodeMap = new Map<IFlatNode, IRiasTreeNode>();
  nestedNodeMap = new Map<IRiasTreeNode, IFlatNode>();

  treeControl = new FlatTreeControl<IFlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlatener:MatTreeFlattener<IRiasTreeNode, IFlatNode>;
  nodesRias:IRiasTreeNode[] = [];

  listaRiasSrc: MatTreeFlatDataSource<IRiasTreeNode, IFlatNode>;

  filtrador:string = "";
  constructor(
    private api: FormulariosService,
    private fb: FormBuilder
  ) {
    this.treeFlatener = new MatTreeFlattener(
      this._transformer,
      node => node.level,
      node => node.expandable,
      node => node.children
    );

    this.listaRiasSrc = new MatTreeFlatDataSource(this.treeControl, this.treeFlatener);

  }

  private _transformer = (node: IRiasTreeNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.pk === node.pk ? existingNode : new IFlatNode();
    flatNode.create = node.pk < 0;
    flatNode.expandable = !!node.children?.length;
    flatNode.level = level;
    flatNode.name = node.name;
    flatNode.pk = node.pk;
    flatNode.pkPadre = node.pkPadre;
    flatNode.idxForm = node.idxForm;

    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  ngOnInit(): void {
    this.listarRias();
  }

  filtrarRias() {
    if(!this.filtrador) {
      this.nodesRias = this.renderData();
      this.listaRiasSrc.data = this.nodesRias;
      return;
    }

    const ria = this.listaRias.find(r => new RegExp(this.filtrador, "gi").test(r.tX_ATENCION_RIAS));

    if(!ria) return;

    this.nodesRias = this.renderData(ria.nU_PK_RIAS, true);
    this.listaRiasSrc.data = this.nodesRias;
  }

  listarRias() {
    this.api.rias
    .pipe(tap(r => {
      this.listaRias = r;
      this.nodesRias = this.renderData();
      this.listaRiasSrc.data = this.nodesRias;
    }))
    .subscribe();
  }

  public renderData(padre:number = 0, isPadre:boolean = false) {
    const children:IRiasTreeNode[] = [];

    this.listaRias.filter(r => isPadre ? r.nU_PK_RIAS === padre : r.nU_PADREATENCION_RIAS === padre)
    .forEach(rias => {
      const hijos = this.listaRias.filter(ria => ria.nU_PADREATENCION_RIAS === rias.nU_PK_RIAS);
      
      const node:IRiasTreeNode = {
        name: rias.tX_ATENCION_RIAS,
        pk: rias.nU_PK_RIAS,
        pkPadre: rias.nU_PADREATENCION_RIAS
      }
      
      if(hijos.length) node.children = this.renderData(rias.nU_PK_RIAS);
      
      children.push(node);
    });

    return children;
  }

  formulario(indx: number): FormGroup {
    return this.form.at(indx) as FormGroup
  }

  addNewRias(node: IFlatNode) {
    const parent = this.flatNodeMap.get(node);
    this.form.push(this.fb.group(this.ctrlForm));

    const ultimoForm = this.form.length - 1;

    this.form.at(ultimoForm).get("nU_PADREATENCION_RIAS")?.patchValue(node.pk);

    const nuevo:IFlatNode = {
      name: "",
      pk: -1,
      pkPadre: node.pk,
      create: true,
      expandable: false,
      level: node.level,
      idxForm: ultimoForm
    }

    if(!parent) return;
    if(parent?.children) {
      parent.children.push(nuevo);
    } else {
      parent.children = [nuevo];
    }

    this.listaRiasSrc.data = this.nodesRias;
    this.treeControl.expand(node);
  }

  guardarRias(idxForm: number) {
    const formRias = this.form.at(idxForm).value;

    this.api.postRias(formRias)
    .subscribe(() => {
      this.form.clear();
      this.form.push(this.fb.group(this.ctrlForm));
      this.listarRias();
    })
  }

  public hasChild = (_:number, node: IFlatNode) => node.expandable

  public creatingContent = (_: number, nodeData:IFlatNode) => nodeData.create
}
