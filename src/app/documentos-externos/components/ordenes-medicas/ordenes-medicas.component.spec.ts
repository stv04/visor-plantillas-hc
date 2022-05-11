import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesMedicasComponent } from './ordenes-medicas.component';

describe('OrdenesMedicasComponent', () => {
  let component: OrdenesMedicasComponent;
  let fixture: ComponentFixture<OrdenesMedicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenesMedicasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenesMedicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
