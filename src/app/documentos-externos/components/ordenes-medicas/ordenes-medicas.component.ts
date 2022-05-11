import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-ordenes-medicas',
  templateUrl: './ordenes-medicas.component.html',
  styleUrls: ['./ordenes-medicas.component.css']
})
export class OrdenesMedicasComponent implements OnInit {
  public orden;
  public medicamento = {
    tipo_med: 0,
    tipo_orden: 0,
    titulo: "",
    presentacion: 11,
    dosis: 0,
    frecuencia: 0,
    tiempo: "",
    via: 11,
  };
  public readonly tipo_orden:string[] = [
    "Apoyo Dx", "Consulta", "Quirúrgico", "Otros procedimientos/Servicios",
    "Medicamentos", "Optometría"
  ];
  public readonly tipo_med:string[] = ["Orden", "Fórmula"];
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
  
  public ordenVacia = {
    tipo_orden: 0,
    procedimiento: "",
    observaciones: "",
    cantidad: "",
    pyp: true,
    noPos: true,
    especialidad: ""
  }
  
  public procedimientos: any = [];
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

  public medicamentos: any = [];
  public colMed: any = [
    "actions", "tipo_orden", "medicamentos", "observacion", "cantidad"
  ];
  
  @ViewChild(MatTable) table!: MatTable<any>;
  constructor() { 
    this.orden = Object.assign({}, this.ordenVacia) 
  }

  ngOnInit(): void {
  }

  get titulo() {
    return this.tipo_orden[this.orden.tipo_orden];
  }

  ordenar() {
    this.procedimientos.push(this.orden);
    console.log(this.orden);
    console.log(this.procedimientos);

    this.orden = Object.assign({}, this.ordenVacia);
    this.table.renderRows();
  }

}

