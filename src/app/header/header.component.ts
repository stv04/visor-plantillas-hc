import { Component, OnInit } from '@angular/core';
import { AfiliadosService } from '../services/afiliados.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public height:any = "60px";
  public form:any = {
    nU_IDTIPOIDEN_TIPOIDEN: 0,
    tX_IDENTIFICACION_AFIL: "", //868383
    tX_NOMIDENTI_AFIL: "",
    codigo: ""
  }
  constructor(private afilServ: AfiliadosService) { }

  ngOnInit(): void {
  }

  toggleHeaderHeight():void {
    const headerHeight = document.getElementById("header-hc")?.scrollHeight;
    if(this.height !== "60px") {
      this.height = "60px";
    } else {
      this.height = headerHeight + "px";
    }
  }

  getAfil(idAfil:string) {
    const afiliado = this.afilServ.afiliado;
    if(afiliado?.tX_IDENTIFICACION_AFIL === idAfil) return;

    this.afilServ.getAfiliado(idAfil).subscribe(res => {
      if(res.length) {
        this.form = Object.assign({}, res[0]);
        this.form.tX_NOMIDENTI_AFIL = res[0].tX_NOMIDENTI_AFIL + " " + res[0].tX_PRIMAPELLI_AFIL.toLowerCase();
        console.log(this.form);
        this.afilServ.setAfiliado(res[0]);
      }
    });
  }

}
