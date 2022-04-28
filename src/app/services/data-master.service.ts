import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataMasterService {

  private endpoint: string = "http://181.129.245.90:8165/DatosMaestros";
  public datosCargados:any = {};
  constructor(private http: HttpClient) { }

  get tipoDoc():any {
    return "hola";
  }

  dataMaster(TitleDad:string): Observable<any> {
    if(this.datosCargados[TitleDad]) return of(this.datosCargados[TitleDad]);

    const params = new HttpParams({
      fromObject: {TitleDad}
    });

    return this.http.get(this.endpoint, {
      params
    }).pipe(
      map((r:any) => {
        const respuesta = r[0][0];
        const datos = JSON.parse(respuesta["aR_DATO_DM"]);
        if(typeof this.datosCargados[TitleDad] !== "object") {
          this.datosCargados[TitleDad] = new Object(datos);
        } else {
          this.datosCargados[TitleDad] = datos;
        }

        return datos;
      })
    );
  }
}
