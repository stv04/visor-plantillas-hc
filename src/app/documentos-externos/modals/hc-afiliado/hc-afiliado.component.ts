import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AfiliadosService } from 'src/app/services/afiliados.service';
import { FormulariosService } from 'src/app/services/formularios.service';

@Component({
  selector: 'app-hc-afiliado',
  templateUrl: './hc-afiliado.component.html',
  styleUrls: ['./hc-afiliado.component.css']
})
export class HcAfiliadoComponent implements OnInit {
  public cargando:boolean = true;
  public historialPorTipo: any[] = [];
  public columns: string[];

  private colGenerica:string[] = [
    "tipo_orden",
    "procedimiento",
    "observaciones",
    "cantidad",
    "especialidad",
    "historia"
  ];

  private colMedicamentos: string[] = [
    "tipo_orden", "medicamento", "observaciones", "cantidad", "historia"
  ]

  private colOpt: string[] = ["tipo_orden", "historia"];
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
  }

  obetenerHistorial() {
    const idAfil:number = this.afilServ.afiliado.nU_IDAFILIADO_AFIL;
    this.formServ.getHcPorDocExtAfil(idAfil, 1).subscribe(historial => {
      this.historialPorTipo = historial.filter(hist => hist.tipo_orden === this.data.tipo_orden);
      this.cargando = false;
    });
  }

  obtenerTipoOrden(orden: number): string {
    return this.tipo_ordenes[orden];
  }
}
