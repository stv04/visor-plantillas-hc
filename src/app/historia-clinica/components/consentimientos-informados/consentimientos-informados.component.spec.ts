import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentimientosInformadosComponent } from './consentimientos-informados.component';

describe('ConsentimientosInformadosComponent', () => {
  let component: ConsentimientosInformadosComponent;
  let fixture: ComponentFixture<ConsentimientosInformadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsentimientosInformadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentimientosInformadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
