import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICotizante } from '../interfaces/afiliado';

@Injectable({
  providedIn: 'root'
})
export class AfiliadosService {
  private readonly endpoint:string = "http://181.129.245.90:8165";

  public afiliado!:ICotizante;
  public idAfiliado:number = 0;
  public afiliadoObserver:BehaviorSubject<any> = new BehaviorSubject({})

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
    this.idAfiliado = this.afiliado.nU_IDAFILIADO_AFIL;
    this.afiliadoObserver.next(afil);
  }
}
