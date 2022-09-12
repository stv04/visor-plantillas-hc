import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AfiliadosService } from 'src/app/services/afiliados.service';
import { FormulariosService } from 'src/app/services/formularios.service';

@Component({
  selector: 'app-hc-afiliado',
  templateUrl: './hc-afiliado.component.html',
  styleUrls: ['./hc-afiliado.component.css']
})
export class HcAfiliadoComponent implements OnInit {
  public cargando:boolean = true;
  public historial:any[] = [];
  public historialPorTipo: MatTableDataSource<any> = new MatTableDataSource();
  public columns: string[];

  private colGenerica:string[] = [
    "tipo_orden",
    "procedimiento",
    "observaciones",
    "cantidad",
    "especialidad",
    "historia", 
    "fecha"
  ];

  private colMedicamentos: string[] = [
    "tipo_orden", "medicamento", "observaciones", "cantidad", "historia", "fecha"
  ]

  private colOpt: string[] = ["tipo_orden", "historia", "fecha"];
  public colPorTipoOrden:string[][] = [
    this.colGenerica, this.colGenerica, this.colGenerica, this.colGenerica,
    this.colMedicamentos, this.colOpt
  ]
  
  public readonly tipo_ordenes:string[] = [
    "Apoyo Dx", "Consulta", "Quirúrgico", "Otros procedimientos/Servicios",
    "Medicamentos", "Optometría"
  ];

  constructor(
    private formServ: FormulariosService, 
    private afilServ: AfiliadosService,
    @Inject(MAT_DIALOG_DATA) private data:{tipo_orden:number}
  ) {
    this.columns = this.colPorTipoOrden[this.data.tipo_orden];
  }

  ngOnInit(): void {
    this.obetenerHistorial();
    this.historialPorTipo.sort = this.sort;
  }

  @ViewChild(MatSort) sort!: MatSort;

  obtenerFecha(fech:string):Date {
    const fecha = new Date(fech.trim());
    console.log(fecha);
    return fecha
  }

  obetenerHistorial() {
    const idAfil:number = this.afilServ.afiliado.nU_IDAFILIADO_AFIL;
    this.formServ.getHcPorDocExtAfil(idAfil, 1).subscribe(historial => {
      this.historial = historial.filter(hist => hist.tipo_orden === this.data.tipo_orden);
      this.historialPorTipo.data = this.historial;
      
      this.cargando = false;
    });
  }

  obtenerTipoOrden(orden: number): string {
    return this.tipo_ordenes[orden];
  }
}
