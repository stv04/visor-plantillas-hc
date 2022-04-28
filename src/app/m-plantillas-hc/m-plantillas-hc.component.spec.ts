import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MPlantillasHcComponent } from './m-plantillas-hc.component';

describe('MPlantillasHcComponent', () => {
  let component: MPlantillasHcComponent;
  let fixture: ComponentFixture<MPlantillasHcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MPlantillasHcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MPlantillasHcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
