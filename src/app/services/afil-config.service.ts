import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ICotizante } from '../interfaces/afiliado';
import { AfiliadosService } from './afiliados.service';
import { DataMasterService } from './data-master.service';

interface ICampos {
  titulo:string,
  conversion?:string|any[],
  separador?:string
}

interface IParamsRecibidos {
  nombre:string,
  id:number,
  titulo:string,
  campos:ICampos[],
  eval?:string,
  separador?:string
}

interface ICotizanteEx extends ICotizante {
  [key:string]: any;
}


@Injectable({
  providedIn: 'root'
})
export class AfilConfigService {
  private estructuraConversion:IParamsRecibidos[] = [{
    id: 0,
    titulo: "nombre",
    nombre: 'Nombre',
    campos: [{titulo: "tX_PRIMNOMBRE_AFIL"}],
  }, {
    id: 1,
    titulo: "apellido",
    nombre: "Apellido",
    campos: [{titulo: "tX_PRIMAPELLI_AFIL"}],
  }, {
    id: 2,
    titulo: "tipo_doc",
    nombre: "Tipo doc.",
    campos: [
      {titulo: "nU_IDTIPOIDEN_TIPOIDEN", conversion: "TIPO-DE-IDENTIFICACION"}
    ],
  }, {
    id: 3,
    titulo: "nombre_completo",
    nombre: "Nombre completo",
    campos: [
      {titulo: "tX_PRIMNOMBRE_AFIL"}, 
      {titulo: "tX_NOMIDENTI_AFIL"}, 
      {titulo: "tX_PRIMAPELLI_AFIL"}, 
      {titulo: "tX_SEGAPELLI_AFIL"}
    ],
    separador: " "
  }, {
    id: 4,
    titulo: "numero_iden",
    nombre: "Número identificación",
    campos: [{titulo: "tX_IDENTIFICACION_AFIL"}],
  }, {
    id: 5,
    titulo: "regimen",
    nombre: "Regimen",
    campos: [
      {titulo: "nU_IDREGIMEN_REGIMEN", conversion: "REGIMEN"}
    ],
  }, {
    id: 6,
    titulo: "edo_civil",
    nombre: "Estado civil",
    campos: [
      {titulo: "nU_ESTADO_AFIL", conversion: "ESTADO CIVIL"}
    ],
  }, {
    id: 7,
    titulo: "edad",
    nombre: "Edad",
    campos: [
      {titulo: "fE_FECHANACIMIENTO_AFIL"}
    ],
    eval: "edad"
  }, {
    id: 8,
    titulo: "sexo",
    nombre: "Sexo",
    campos: [
      {titulo: "nU_IDGENERO_GENEROS", conversion: "SEXO"}
    ],
  }, {
    id: 9,
    titulo: "hemoclasificacion",
    nombre: "Hemoclasificación",
    campos: [
      {titulo: "nU_IDTIPOSANGRE_TIPOSANGRE", conversion: "TIPOS-DE-SANGRE"},
      {titulo: "nU_IDRH_RHS", conversion: "RH"}
    ],
  }, {
    id: 10,
    titulo: "direccion",
    nombre: "Dirección",
    campos: [
      {
        titulo: "tX_DIRECCION_AFIL",
        conversion: ["TIPO-DE-VIA-PRINCIPAL", "", "LETRA-DE-VIA", "", "LETRA-DE-VIA", "", "", "LETRA-DE-VIA", "", "", ""]
      }
    ],
  }, {
    id: 11,
    titulo: "telefono",
    nombre: "Telefono",
    campos: [
      {titulo: "nU_TELEFONO_AFIL"}
    ],
  }, {
    id: 12,
    titulo: "celular",
    nombre: "Celular",
    campos: [
      {titulo: "nU_CELULAR_AFIL"}
    ],
  }, {
    id: 13,
    titulo: "tipo_usuario",
    nombre: "Tipo de usuario",
    campos: [
      {titulo: "nU_IDAFILIADO_AFIL"},
      {titulo: "nU_IDCOTIZANTE_AFIL"},
    ],
    eval: "tipo-usuario", 
    separador: ","
  }, {
    id: 14,
    titulo: "fecha_gen",
    nombre: "Fecha generación",
    campos: [
      {titulo: "fE_FECHACREACION_AFIL"}
    ],
  }];

  constructor(private afilServ: AfiliadosService, private dataMastServ: DataMasterService) { }

  public async obtenerServicios(tituloEstructura: string):Promise<any> {
    const consulta:IParamsRecibidos | undefined = this.estructuraConversion.find(est => tituloEstructura === est.titulo);
   
    if(!consulta) return;

    const campos:ICampos[] = consulta.campos;
    const afil = this.afilServ.afiliado as ICotizanteEx;
    
    if(afil) {
      const values = [];
      let i = 0;
      for await (let c of campos) {
        const title:string = c.titulo;
        const conversion = c.conversion;
        const separador:string = c.separador || " ";

        values[i] = afil[title];
        
        if(conversion) {
          const consulta:number|string = values[i];
          values[i] = await this.conversorDatosMaestros(conversion, consulta, separador); 
        }

        i++
      }

      const value = this.evaluarValor(values.join(consulta.separador || ""), consulta.eval || "");
      return value;
    }
    
  }

  private async conversorDatosMaestros(conversion:string|any[], consulta:number|string, separador:string) {
    let datosMaestros
    if(typeof conversion === "string") {
      datosMaestros = await lastValueFrom(this.dataMastServ.dataMaster(conversion));
      return datosMaestros[consulta][0];
    } else {
      const arrayConv = conversion.map(conv => {
        if(!conv) return Promise.resolve(conv);

        return lastValueFrom(this.dataMastServ.dataMaster(conv))
      });

      const consultas:any[] = (<string> consulta).replace(/\[|\]/g, "").split(",");
      const datosConvertidos = await Promise.all(arrayConv);

      return datosConvertidos.map((d, i) => {
        const valor = consultas[i];
        if(valor == -1 || d === null) return "";
        if(d === "") return valor;

        return d[valor][0];
      }).join(separador);
    }
  }

  private evaluarValor(valor:string, evaluador:string): string {
    switch(evaluador) {
      case "edad":
        const fecha = valor.split("/").reverse().join("-");
        const now = new Date().getTime();
        const birth = new Date(fecha).getTime();

        const age = Math.floor((now - birth) * 3.2e-11);
        return age.toString();

      case "tipo-usuario":
        const [afil, coti] = valor.split(",");
        return afil == coti ? "Afiliado" : "Cotizante";

      default: 
        return valor
    }
  }
}
