import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { IHistClinPorDocExt } from 'src/app/interfaces/historiaClinica';
import { HcAfiliadoComponent } from '../../modals/hc-afiliado/hc-afiliado.component';

const ID_DOCEXTERNO:number = 1;

@Component({
  selector: 'app-ordenes-medicas',
  templateUrl: './ordenes-medicas.component.html',
  styleUrls: ['./ordenes-medicas.component.css']
})
export class OrdenesMedicasComponent implements OnInit {
  public tipo_orden:number = 0;
  public orden_seleccionada:number = 0;
  public procedimiento = this.fb.group({
    tipo_orden: [0],
    procedimiento: [""],
    observaciones: [""],
    cantidad: [""],
    pyp: [true],
    noPos: [true],
    especialidad: [""]
  });

  public medicamento = this.fb.group({
    tipo_med: [0],
    tipo_orden: [0],
    medicamento: [""],
    procedimiento: null,
    cantidad: 1,
    titulo: [""],
    presentacion: [11],
    dosis: [0],
    frecuencia: [0],
    tiempo: [""],
    via: [11],
    concentracion: [""],
    observaciones: ""
  });

  public optometria = this.fb.group({
    distVerticeOjoDer: null,
    distVerticeOjoIzq: null,

    // Ojo derecho lejos
    esferaOjoDerLejos: null,
    cilindroOjoDerLejos: null,
    ejeOjoDerLejos: null,
    agudezaVisualOjoDerLejos: null,
    
    // Ojos izquierdo lejos
    esferaOjoIzqLejos: null,
    cilindroOjoIzqLejos: null,
    ejeOjoIzqLejos: null,
    agudezaVisualOjoIzqLejos: null,
    
    // Ojos izquierdo cerca
    esferaOjoDerCerca: null,
    cilindroOjoDerCerca: null,
    ejeOjoDerCerca: null,
    agudezaVisualOjoDerCerca: null,
    
    // Ojos izquierdo cerca
    esferaOjoIzqCerca: null,
    cilindroOjoIzqCerca: null,
    ejeOjoIzqCerca: null,
    agudezaVisualOjoIzqCerca: null,

    adicionOjoDer: null,
    adicionOjoIzq: null,
    
    distNazopupilarOjoDer: null,
    distNazopupilarOjoIzq: null,

    uso: null,
    materila: null,
    tipo_lente: null,
    color_filtro: null,

    alturaOjoDer: null,
    alturaOjoIzq: null,

    observaciones: null,
  });
  
  public readonly tipo_ordenes:string[] = [
    "Apoyo Dx", "Consulta", "Quirúrgico", "Otros procedimientos/Servicios",
    "Medicamentos", "Optometría"
  ];
  public readonly tipos_med:string[] = ["Orden", "Fórmula"];
  public readonly procToOrder:string[] = ["Normal", "Código"];
  public readonly presentaciones:any[] = [
    [11, "AMPOLLAS"],
    [8, "BOLSA"],
    [35, "CAPSULAS"],
    [1, "CREMA"],
    [36, "EMULSIÓN"],
    [37, "ENJUAGUE BUCAL"],
    [3, "FRACO"],
    [38, "FRASCO AMPOLLA"],
    [39, "GEL"],
    [40, "GOTAS"],
    [2, "GRAGEA"],
    [41, "INHALADOR"],
    [42, "JABÓN LIQUIDO"],
    [43, "JALEA"],    
    [44, "JARABE"],
    [45, "LOCIÓN"],
    [46, "ÓVULOS"],
    [7, "PAQUETE"],    
    [47, "POLVO PARA SUSPENSIÓN"],
    [48, "SHAMPOO"],
    [49, "SOLUCIÓN"],
    [50, "SUPOSITORIOS"],
    [51, "SUSPENSIÓN"],
    [10, "TABLETAS"],
    [9, "UNIDAD"]
  ];
  public readonly vias:any[] = [
    [11, "ENDOTRAQUEAL"],
    [1, "ENDOVENOSA"],
    [5, "INHALADA"],
    [7, "INTRADERMICA"],
    [2, "INTRAMUSCULAR"],
    [6, "INTRANASAL"],
    [4, "INTRARECTAL"],
    [10, "IRRIGACION"],
    [3, "ORAL"],
    [9, "OTRA"],
    [8, "SUBCUTANEA"],
    [13, "TOPICA"]
  ];
  public readonly tipos_lente:{id: number, value: string}[] = [
    {
      id: 8,
      value: "Asférico"
    },
    {
      id: 4,
      value: "Bifocal"
    },
    {
      id: 3,
      value: "Monofocal"
    },
    {
      id: 7,
      value: "Multifocal"
    },
    {
      id: 6,
      value: "Ocupacional"
    },
    {
      id: 11,
      value: "Otro"
    },
    {
      id: 10,
      value: "Policarbonato"
    },
    {
      id: 5,
      value: "Progresivo"
    },
    {
      id: 9,
      value: "Ultradelgado"
    }
  ]
  
  public dataProcedimientos: any = [];
  public colProc:any = [
    "actions",
    "tipo_orden",
    "procedimiento",
    "observaciones",
    "cantidad",
    "pyp",
    "noPos",
    "especialidad"
  ];

  public dataMedicamentos: any = [];
  public colMed: any = [
    "actions", "tipo_orden", "medicamento", "observaciones", "cantidad"
  ];
  
  public dataOptometria: any = [];
  public colOpt: any = [
    "actions", "tipo_orden"
  ];

  medicamentos = new MatTableDataSource<any>(this.dataMedicamentos);
  procedimientos = new MatTableDataSource<any>(this.dataProcedimientos);
  optometrias = new MatTableDataSource<any>(this.dataOptometria);
  
  @ViewChild(MatTable) table!: MatTable<any>;
  constructor(private dialog:MatDialog, private fb: FormBuilder) {  }

  ngOnInit(): void {
  }

  get titulo() {
    return this.tipo_ordenes[this.tipo_orden];
  }

  obtenerTipoOrden(orden: number): string {
    return this.tipo_ordenes[orden];
  }

  @ViewChild("warnSwal")
  public readonly warnSwal!: SwalComponent;
  ordenar() {
    if(this.tipo_orden < 4) {
      this.procedimiento.setControl("tipo_orden", new FormControl(this.tipo_orden));
      this.dataProcedimientos.push(this.procedimiento.value);
      console.log(this.procedimiento.value);
  
      this.procedimientos.data = this.dataProcedimientos;
      this.orden_seleccionada = 1-1;

      this.procedimiento.reset();

    } else if (this.tipo_orden == 4) {
      this.medicamento.setControl("tipo_orden", new FormControl(this.tipo_orden));

      this.dataMedicamentos.push(this.medicamento.value);
  
      this.medicamentos.data = this.dataMedicamentos;
      this.orden_seleccionada = 1;

      this.medicamento.reset();
    } else if (this.tipo_orden == 5) {

      if(this.dataOptometria.length > 0) {
        this.warnSwal.fire();
        return;
      }

      this.optometria.setControl("tipo_orden", new FormControl(this.tipo_orden));

      this.dataOptometria.push(this.optometria.value);
  
      this.optometrias.data = this.dataOptometria;
      this.orden_seleccionada = 2;

      this.optometria.reset();
    }

  }

  historialDocumentos() {
    this.dialog.open(HcAfiliadoComponent);
  }

  editarOrden(el: any) {
    this.procedimiento.patchValue(el);
  }

  guardarOrdenesMedicas(): IHistClinPorDocExt {
    const listadoOrdenes:any[] = [...this.dataMedicamentos, ...this.dataProcedimientos, ...this.dataOptometria];
    const estado = listadoOrdenes.length ? 1 : 0;

    const guardado:IHistClinPorDocExt = {
      nU_ESTADO_HCXDE: estado,
      nU_IDHISTORIACLINICA_HCXDE: 0,
      nU_IDDOCEXTERNO_HCXDE: ID_DOCEXTERNO,
      tX_INFODILIGENCIADA_HCXDE: JSON.stringify(listadoOrdenes),
      nU_IDHCXDC_HCXDE: 0
    }

    return guardado;
  }

}

