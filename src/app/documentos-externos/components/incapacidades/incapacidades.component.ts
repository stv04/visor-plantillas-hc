import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-incapacidades',
  templateUrl: './incapacidades.component.html',
  styleUrls: ['./incapacidades.component.css']
})
export class IncapacidadesComponent implements OnInit {
  public readonly tipoIncapacidad:any[] = [
    {
        "id": "01",
        "value": "Enfermedad General"
    },
    {
        "id": "02",
        "value": "Accidente de Trabajo"
    },
    {
        "id": "03",
        "value": "Enfermedad Profesional"
    },
    {
        "id": "04",
        "value": "Licencia de Maternidad"
    },
    {
        "id": "05",
        "value": "Licencia de Paternidad"
    },
    {
        "id": "06",
        "value": "Descanso remunerado por Aborto"
    },
    {
        "id": "07",
        "value": "Accidente de Transito"
    }
  ]

  public readonly causasExt:any[] = [
    {
      "id": "01",
      "value": "ACCIDENTE DE TRABAJO"
    },
    {
      "id": "02",
      "value": "ACCIDENTE DE TRANSITO"
    },
    {
      "id": "03",
      "value": "ACCIDENTE RABICO"
    },
    {
      "id": "04",
      "value": "ACCIDENTE OFIDICO"
    },
    {
      "id": "05",
      "value": "OTRO TIPO DE ACCIDENTE"
    },
    {
      "id": "06",
      "value": "EVENTO CATASTROFICO"
    },
    {
      "id": "07",
      "value": "LESION POR AGRESION"
    },
    {
      "id": "08",
      "value": "LESION AUTO INFLIGIDA"
    },
    {
      "id": "09",
      "value": "SOSPECHA DE MALTRATO FISICO"
    },
    {
      "id": "10",
      "value": "SOSPECHA DE ABUSO SEXUAL"
    },
    {
      "id": "11",
      "value": "SOSPECHA DE VIOLENCIA SEXUAL"
    },
    {
      "id": "13",
      "value": "ENFERMEDAD GENERAL"
    },
    {
      "id": "14",
      "value": "ENFERMEDAD PROFESIONAL"
    },
    {
      "id": "15",
      "value": "OTRA"
    },
    {
      "id": "4",
      "value": "EVENTO CATASTROFICO"
    }
  ]

  public incapacidadForm = {
    diasIncapacidad: 1
  }

  constructor() { }

  ngOnInit(): void {
  }

  get numeroLiteral():string {
    const dias = this.incapacidadForm.diasIncapacidad;
    if(!dias) return "";
    const diasStr:string = dias.toString();
    const termino = dias === 1 ? "día" : "dias";
    
    const unidades = ["Cero", "Un", "Dos", "Tres", "Cuatro", "Cinco", "Seis", "Siete", "Ocho", "Nueve"];
    const decenas = [null, "Dieci", "Veint", "Treint", "Cuarent", "Cincuent", "Sesent", "Setent", "Ochent", "Novent"];

    
    let res;
    const [dec, un] = diasStr.split("").map(v => parseInt(v));
    
    const defineDias = (separador:string, finalI:string) => {
      switch(un) {
        case 0:
          res = decenas[dec] + finalI;
          break;
        default: 
          res = decenas[dec] + separador + unidades[un].toLowerCase();
      }
    }

    if(dias < 10 && dias >= 0) {
      res = unidades[dias];
    } else if (dias >= 10 && dias < 20) {
      const [decena, unidad] = diasStr.split("").map(v => parseInt(v));

      switch(dias) {
        case 10:
          res = "Diez";
          break;
        case 11:
          res = "Once";
          break;
        case 12:
          res = "Doce";
          break;
        case 13:
          res = "Trece";
          break;
        case 14:
          res = "Catorce";
          break;
        case 15:
          res = "Quince";
          break;
        default:
          res = decenas[decena] + unidades[unidad].toLowerCase();
      }
    } else if(dias >= 20 && dias < 30) {
      defineDias("i","e");
    } else {
      defineDias("a y ","a");
    }
    return res + " " + termino;

    
  }

}
