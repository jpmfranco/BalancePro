import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Proyeccion } from './proyeccion';

describe('Proyeccion', () => {
  let component: Proyeccion;
  let fixture: ComponentFixture<Proyeccion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Proyeccion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Proyeccion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
