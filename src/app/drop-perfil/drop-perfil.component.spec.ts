import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropPerfilComponent } from './drop-perfil.component';

describe('DropPerfilComponent', () => {
  let component: DropPerfilComponent;
  let fixture: ComponentFixture<DropPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropPerfilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
