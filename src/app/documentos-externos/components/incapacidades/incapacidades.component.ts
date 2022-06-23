import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IHistClinPorDocExt } from 'src/app/interfaces/historiaClinica';

const ID_INCAPACIDADES: number = 3;

@Component({
  selector: 'app-incapacidades',
  templateUrl: './incapacidades.component.html',
  styleUrls: ['./incapacidades.component.css']
})
export class IncapacidadesComponent implements OnInit {
  private fechaActual = this.dp.transform(new Date().getTime(), "yyyy-MM-dd");

  public incapacidadesForm = this.fb.group({
    tipo_doc: [0, Validators.required],
    identificacion: [, Validators.required],
    nombre_apellido: ["", Validators.required],
    edad: ["", Validators.required],
    genero: ["", Validators.required],
    telefono: [, Validators.required],
    tipo_usuario: [, Validators.required],

    area_dependecia: [, Validators.required],
    aseguradora: [, Validators.required],
    num_consecutivo: [, Validators.required],
    fecha_gen: [this.fechaActual, Validators.required],

    tipo_busqueda_dx: [, Validators.required],
    tipo_incapacidad: [, Validators.required],
    causa_externa: [, Validators.required],
    dias_acumulados: [, Validators.required],
    diagnostico: [, Validators.required],
    fecha_inicial: [this.fechaActual, Validators.required],
    fecha_final: [this.fechaActual, Validators.required],
    dias_incapacidad: [0],
    opcion_procedimientos: [],

    check_convalidacion: [],
    profesiona_inc: [],
    numero_prorroga: [],
    observaciones: [],
    
    firma_digital: [],
    nombre_profesional: [],
    especialidad: [],
    registro_medico: []
  });

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

  constructor(private fb: FormBuilder, private dp: DatePipe) { }

  ngOnInit(): void {
    // this.guardarIncapacidades();
    this.calculoFecha();
    console.log(this.incapacidadesForm);
  }

  get numeroLiteral():string {
    const dias = this.incapacidadesForm.value.dias_incapacidad;
    if(dias < 0) {
      return "";
    };
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

  calculoFecha():void {
    const calcular = (f:string, i:string):void => {
      const dividendo = 1000 * 60 * 60 * 24;

      const diferencia = new Date(f).getTime() - new Date(i).getTime();

      this.incapacidadesForm.get("dias_incapacidad")?.setValue(diferencia / dividendo);
    }

    this.incapacidadesForm.get("fecha_final")?.valueChanges.subscribe(fechaF => {
      const fechaI = this.incapacidadesForm.get("fecha_inicial")?.value;
      calcular(fechaF, fechaI);
    });
    
    this.incapacidadesForm.get("fecha_inicial")?.valueChanges.subscribe(fechaI => {
      const fechaF = this.incapacidadesForm.get("fecha_final")?.value;
      calcular(fechaF, fechaI);
    });

    
  }

  get validarIncapacidades(): boolean {
    return this.formatoDiligenciado && this.incapacidadesForm.valid;
  }

  get formatoDiligenciado(): boolean {
    const controles = this.incapacidadesForm.controls;
    let diligenciado = false;

    for (const clave in controles) {
      const control = controles[clave];
      if(control.touched && control.value) {
        diligenciado = true;
        break;
      }
    }

    return diligenciado;
  }

  get incapacidades(): IHistClinPorDocExt {
    const estado = this.formatoDiligenciado ? 1 : 0;
    return {
      nU_ESTADO_HCXDE: estado,
      nU_IDHISTORIACLINICA_HCXDE: 0,
      nU_IDDOCEXTERNO_HCXDE: ID_INCAPACIDADES,
      tX_INFODILIGENCIADA_HCXDE: JSON.stringify(this.incapacidadesForm.value),
      nU_IDHCXDC_HCXDE: 0
    };
  }
}
