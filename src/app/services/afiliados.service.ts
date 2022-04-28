import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AfiliadosService {

  public readonly endpoint:string = "http://181.129.245.90:8165";
  public afiliado:any = {};

  constructor(private http:HttpClient) { }

  getAfiliado(id:string):Observable<any> {
    const params = new HttpParams({
      fromObject: {ID_AFILIADO: id}
    })

    return this.http.get(this.endpoint + "/Afiliados/PorDocumento", {
      params
    });
  }

  setAfiliado(afil:any) {
    this.afiliado = afil
  }
}
