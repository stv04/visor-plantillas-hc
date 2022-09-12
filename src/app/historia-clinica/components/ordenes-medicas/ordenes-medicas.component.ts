import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
  @Input() lectura:boolean = false;
  @Input() informacion = [];

  public tipo_orden:number = 0;
  public orden_seleccionada:number = 0;
  public procedimiento = this.fb.group({
    tipo_orden: [0],
    procedimiento: ["", Validators.required],
    observaciones: ["", Validators.required],
    cantidad: ["", Validators.required],
    pyp: [true],
    noPos: [true],
    especialidad: [""]
  });

  public medicamento = this.fb.group({
    tipo_med: [0, Validators.required],
    tipo_orden: [0],
    medicamento: ["", Validators.required],
    procedimiento: null,
    cantidad: null,
    titulo: [""],
    presentacion: [11, Validators.required],
    dosis: [0, Validators.required],
    frecuencia: [0, Validators.required],
    tiempo: ["", Validators.required],
    periodo: [, Validators.required],
    via: [11, Validators.required],
    concentracion: [""],
    observaciones: ""
  });

  public optometria = this.fb.group({
    distVerticeOjoDer: [null, Validators.required],
    distVerticeOjoIzq: [null, Validators.required],

    // Ojo derecho lejos
    esferaOjoDerLejos: [null, Validators.required],
    cilindroOjoDerLejos: [null, Validators.required],
    ejeOjoDerLejos: [null, Validators.required],
    agudezaVisualOjoDerLejos: [null, Validators.required],
    
    // Ojos izquierdo lejos
    esferaOjoIzqLejos: [null, Validators.required],
    cilindroOjoIzqLejos: [null, Validators.required],
    ejeOjoIzqLejos: [null, Validators.required],
    agudezaVisualOjoIzqLejos: [null, Validators.required],
    
    // Ojos derecho cerca
    esferaOjoDerCerca: [null, Validators.required],
    cilindroOjoDerCerca: [null, Validators.required],
    ejeOjoDerCerca: [null, Validators.required],
    agudezaVisualOjoDerCerca: [null, Validators.required],
    
    // Ojos izquierdo cerca
    esferaOjoIzqCerca: [null, Validators.required],
    cilindroOjoIzqCerca: [null, Validators.required],
    ejeOjoIzqCerca: [null, Validators.required],
    agudezaVisualOjoIzqCerca: [null, Validators.required],

    adicionOjoDer: [null, Validators.required],
    adicionOjoIzq: [null, Validators.required],
    
    distNazopupilarOjoDer: [null, Validators.required],
    distNazopupilarOjoIzq: [null, Validators.required],

    uso: [null, Validators.required],
    material: [null, Validators.required],
    tipo_lente: [null, Validators.required],
    color_filtro: [null, Validators.required],

    alturaOjoDer: [null, Validators.required],
    alturaOjoIzq: [null, Validators.required],

    observaciones: [null, Validators.required],
  });

  private editando: number[]|undefined[] = [];
  
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
    this.revisarInformacionDiligenciada();
  }

  get titulo() {
    return this.tipo_ordenes[this.tipo_orden];
  }

  // fórmula para catidad de medicamentos: Dosis*Periodo / (Frecuencia * conversor)
  get cantidadMedicamentos():number {
    const med = this.medicamento;
    const dosis:number = med.get("dosis")?.value;
    const periodo:number = med.get("periodo")?.value;
    const frecuencia:number = med.get("frecuencia")?.value;
    const tiempo:number = med.get("tiempo")?.value;

    let conversor:number;

    switch(tiempo) {
      case 1:
        conversor = 1 / (24 * 60);
        break;
      case 2:
        conversor = 1 / 24;
        break;

      default:
        conversor = 1;
        break;
    }

    return Math.floor(dosis * periodo / (frecuencia * conversor));
  }

  obtenerTipoOrden(orden: number): string {
    return this.tipo_ordenes[orden];
  }

  @ViewChild("warnSwal")
  public readonly warnSwal!: SwalComponent;
  ordenar():void {
    const isEditing:number|undefined = this.editando[this.tipo_orden];
    if(this.tipo_orden < 4) {
      this.procedimiento.setControl("tipo_orden", new FormControl(this.tipo_orden));
      
      if(isEditing !== undefined) {
        this.dataProcedimientos[isEditing] = this.procedimiento.value
        this.editando[this.tipo_orden] = undefined;
      } else {
        this.dataProcedimientos.push(this.procedimiento.value);
      }
  
      this.procedimientos.data = this.dataProcedimientos;
      this.orden_seleccionada = 0;

      console.log(this.dataProcedimientos);
      this.procedimiento.reset();

    } else if (this.tipo_orden == 4) {
      this.medicamento.setControl("tipo_orden", new FormControl(this.tipo_orden));

      if(isEditing !== undefined) {
        this.dataMedicamentos[isEditing] = this.medicamento.value
        this.editando[this.tipo_orden] = undefined;
      } else {
        this.dataMedicamentos.push(this.medicamento.value);
      }
  
      this.medicamentos.data = this.dataMedicamentos;
      this.orden_seleccionada = 1;

      this.medicamento.reset();
    } else if (this.tipo_orden == 5) {
      this.optometria.setControl("tipo_orden", new FormControl(this.tipo_orden));
      
      if(this.dataOptometria.length > 0 && isEditing === undefined) {
        this.warnSwal.fire();
        return;
      }
      
      if(isEditing !== undefined) {
        this.dataOptometria[isEditing] = this.optometria.value
        this.editando[this.tipo_orden] = undefined;
      } else {
        this.dataOptometria.push(this.optometria.value);
      }
        
      this.optometrias.data = this.dataOptometria;
      this.orden_seleccionada = 2;

      this.optometria.reset();
    }

  }

  historialDocumentos() {
    this.dialog.open(HcAfiliadoComponent, {
      width: "60%",
      data: {tipo_orden: this.tipo_orden}
    });
  }

  editarOrden(contenido: any, pos:number) {
    const tipo_orden:number = contenido.tipo_orden;
    this.tipo_orden = tipo_orden;
    this.editando[tipo_orden] = pos;
    
    if(tipo_orden < 4) {
      this.procedimiento.patchValue(contenido);
    } else if (tipo_orden == 4) {
      this.medicamento.patchValue(contenido);
    } else if (tipo_orden == 5) {
      this.optometria.patchValue(contenido);
    }
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

  revisarInformacionDiligenciada() {
    if(this.lectura) {
      if(!this.informacion) return;

      this.procedimientos.data = this.informacion.filter((info:any) => info.tipo_orden < 4);
      this.medicamentos.data = this.informacion.filter((info:any) => info.tipo_orden === 4);
      this.optometrias.data = this.informacion.filter((info:any) => info.tipo_orden === 5);

      this.colProc.shift();
      this.colMed.shift();
      this.colOpt.shift();
    }
  }

}

