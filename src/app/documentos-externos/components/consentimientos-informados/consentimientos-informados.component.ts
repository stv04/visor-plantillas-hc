import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-consentimientos-informados',
  templateUrl: './consentimientos-informados.component.html',
  styleUrls: ['./consentimientos-informados.component.css']
})
export class ConsentimientosInformadosComponent implements OnInit {

  public consentimiento = {
    tipo_consentimiento: 342
  }

  public readonly consentimientos:any[] = [
    {
      id: 339,
      value: "Consentimiento Denegacion Odontologia"
    },
    {
      id: 340,
      value: "Consentimiento Procedimiento en Salud"
    },
    {
      id: 341,
      value: "Consentimiento Prueba Elisa VIH"
    },
    {
      id: 342,
      value: "Consentimiento Informado Laboratorio Corporal Humano"
    },
    {
      id: 421,
      value: "prueba 28 oct"
    },
    {
      id: 423,
      value: "PRUEBA CONSENTIMIENTO 28 OCT IMAGEN"
    },
    {
      id: 425,
      value: "VIH"
    },
    {
      id: 426,
      value: "prueba temporal"
    },
    {
      id: 427,
      value: "Consentimiento Procedimiento en Salud NUEVO"
    },
    {
      id: 429,
      value: "Consentimiento Informado Movilidad Internacional"
    }
  ];

  public consentimientosSeleccionados:any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  consentimientoSeleccionado(id: number):boolean {
    return this.consentimiento.tipo_consentimiento === id;
  }

  autorizar():void {
    const con:number = this.consentimiento.tipo_consentimiento;
    const seleccionado:any = this.consentimientos.find(c => c.id === con);
    const exist = this.consentimientosSeleccionados.some(s => s.id === seleccionado.id);

    if(exist) return;
    this.consentimientosSeleccionados.push(seleccionado);
  }

  quitarConsentimiento( id:number ) {
    const index:number = this.consentimientosSeleccionados.findIndex((cons:any) => cons.id === id);
    console.log(index);
    if(index === -1) return;


    this.consentimientosSeleccionados.splice(index, 1);
  }

}
