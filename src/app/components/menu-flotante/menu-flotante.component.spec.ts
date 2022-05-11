import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuFlotanteComponent } from './menu-flotante.component';

describe('MenuFlotanteComponent', () => {
  let component: MenuFlotanteComponent;
  let fixture: ComponentFixture<MenuFlotanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuFlotanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuFlotanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
