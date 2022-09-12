import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HcAfiliadoComponent } from './hc-afiliado.component';

describe('HcAfiliadoComponent', () => {
  let component: HcAfiliadoComponent;
  let fixture: ComponentFixture<HcAfiliadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HcAfiliadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HcAfiliadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
