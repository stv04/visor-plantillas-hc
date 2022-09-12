import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AfiliadosService } from 'src/app/services/afiliados.service';

@Directive({
  selector: '[appCargarAfiliado]'
})
export class CargarAfiliadoDirective implements OnInit{
  @Input() campo:string = "";
  @Input() coversion:string = "";

  constructor(private elRef: ElementRef, private afilServ: AfiliadosService) { }

  ngOnInit(): void {
    this.cargarInformacion();
  }

  cargarInformacion() {
    const el = this.elRef.nativeElement;
    const afiliado = this.afilServ.afiliado;

    el.value = 123;
    console.log(el);
    if(el.value) el.disabled = true;
  }
}
