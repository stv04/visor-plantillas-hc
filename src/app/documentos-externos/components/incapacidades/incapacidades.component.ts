import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IHistClinPorDocExt } from 'src/app/interfaces/historiaClinica';
import { AfilConfigService } from 'src/app/services/afil-config.service';
import { AfiliadosService } from 'src/app/services/afiliados.service';

const ID_INCAPACIDADES: number = 3;

@Component({
  selector: 'app-incapacidades',
  templateUrl: './incapacidades.component.html',
  styleUrls: ['./incapacidades.component.css']
})
export class IncapacidadesComponent implements OnInit {
  private fechaActual = this.dp.transform(new Date().getTime(), "yyyy-MM-dd");

  private dias_acumulados:number = Math.round(Math.random() * 5);
  public incapacidadesForm:FormGroup = this.fb.group({
    tipo_doc: ["", Validators.required],
    identificacion: ["", Validators.required],
    nombre_apellido: ["", Validators.required],
    edad: ["", Validators.required],
    genero: ["", Validators.required],
    telefono: ["", Validators.required],
    tipo_usuario: ["", Validators.required],

    area_dependecia: [],
    aseguradora: [],
    num_consecutivo: [],
    fecha_gen: [this.fechaActual, Validators.required],

    tipo_busqueda_dx: [, Validators.required],
    tipo_incapacidad: [, Validators.required],
    causa_externa: [, Validators.required],
    dias_acumulados: [],
    diagnostico: [, Validators.required],
    fecha_inicial: [this.fechaActual],
    fecha_final: [this.fechaActual],
    dias_incapacidad: [1, Validators.required],
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

  private incapacidadesFormDisabled:FormGroup = this.fb.group({});

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

  constructor(private fb: FormBuilder, private dp: DatePipe, private afilConfServ: AfilConfigService) { }

  ngOnInit(): void {
    // this.guardarIncapacidades();
    this.calculoFecha();
    this.preCargarInformacionAfiliado();
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

  get validarIncapacidades(): boolean {
    return !this.formatoDiligenciado || this.incapacidadesForm.valid;
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
      tX_INFODILIGENCIADA_HCXDE: JSON.stringify(this.formulario),
      nU_IDHCXDC_HCXDE: 0
    };
  }

  get formulario() {
    // this.incapacidadesForm.enable();
    const valoresInhabilitados = this.incapacidadesFormDisabled.value;
    console.log(valoresInhabilitados);
    // this.incapacidadesFormDisabled.enable();
    const values = Object.assign(valoresInhabilitados, this.incapacidadesForm.value);

    return values
  }

  calculoFecha():void {
    const diasEnMilli = 1000 * 60 * 60 * 24;
    const fechaICtrl = this.incapacidadesForm.get("fecha_inicial");
    const fechaFCtrl = this.incapacidadesForm.get("fecha_final");

    const diasIncCtrl = this.incapacidadesForm.get("dias_incapacidad");
    const diasAcumCtrl = this.incapacidadesForm.get("dias_acumulados");
    const diasInc = diasIncCtrl?.value;

    if(this.fechaActual) {
      this.cargarCampoInhabilitar("fecha_inicial", this.fechaActual);
      this.cargarCampoInhabilitar("fecha_final", this.fechaActual);
    }

    const calcular = (value:number):void => {
      if(!value) value = 1;
      const fechaI = fechaICtrl?.value;
      const newFechaF = new Date(fechaI).getTime() + (diasEnMilli * value);

      fechaFCtrl?.setValue(this.dp.transform(newFechaF, "yyyy-MM-dd"));
      diasAcumCtrl?.setValue(this.dias_acumulados + value);
    }
    
    diasIncCtrl?.valueChanges.subscribe(calcular);
  
    calcular(diasInc);
  }

  preCargarInformacionAfiliado() {
    const valores: string[][] = [
      ["tipo_doc", "tipo_doc"],
      ["identificacion", "numero_iden"],
      ["nombre_apellido", "nombre_completo"],
      ["edad", "edad"],
      ["genero", "sexo"],
      ["telefono", "telefono"],
      ["tipo_usuario", "tipo_usuario"],
    ];
    
    valores.forEach(([controlName, campo]) => this.cargarInfoAfil(controlName, campo));
    this.afilConfServ.obtenerServicios("fecha_gen")
    .then(res => {
      if(!res) return;

      const controlFecha = this.incapacidadesForm.get("fecha_gen");
      const fechaRecibida = new Date(res).getTime();
      controlFecha?.setValue(this.dp.transform(fechaRecibida, "yyyy-MM-dd"));
      controlFecha?.disable();

      this.incapacidadesFormDisabled.setControl("fecha_gen", new FormControl(fechaRecibida));


    });

  }
  
  async cargarInfoAfil(nameEl:string, campo:string): Promise<void> {
    const consulta = await this.afilConfServ.obtenerServicios(campo);
    this.cargarCampoInhabilitar(nameEl, consulta);
  }

  cargarCampoInhabilitar(nameEl: string, value: string) {
    const control = this.incapacidadesForm.get(nameEl);
    
    if(!value || !control) return;

    control.patchValue(value);
    control.disable();

    this.incapacidadesFormDisabled.setControl(nameEl, new FormControl(value));
  }
}
