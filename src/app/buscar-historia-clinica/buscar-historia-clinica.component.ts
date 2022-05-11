import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MPlantillasHcComponent } from '../m-plantillas-hc/m-plantillas-hc.component';
import { AfiliadosService } from '../services/afiliados.service';

@Component({
  selector: 'app-buscar-historia-clinica',
  templateUrl: './buscar-historia-clinica.component.html',
  styleUrls: ['./buscar-historia-clinica.component.css']
})
export class BuscarHistoriaClinicaComponent implements OnInit {

  filtrarFecha:boolean = true;
  title:string = "";
  constructor(
    public dialog: MatDialog,
    private afilServ: AfiliadosService
  ) {}

  ngOnInit(): void {
  }

  openDialog() {
    this.dialog.open(MPlantillasHcComponent);
  }

  get afil() {
    return Object.entries(this.afilServ.afiliado).length;
  }

}
