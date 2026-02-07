import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Prediccion } from './prediccion';

describe('Prediccion', () => {
  let component: Prediccion;
  let fixture: ComponentFixture<Prediccion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prediccion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Prediccion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
