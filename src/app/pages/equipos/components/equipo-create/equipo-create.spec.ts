import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import EquipoCreate from './equipo-create';
import { EquipoServices } from '../../services/equipo.services';


class MockEquipoService {
  addEquipo = jasmine.createSpy('addEquipo').and.returnValue(of(true));
}

describe('EquipoCreate Component', () => {
  let fixture: ComponentFixture<EquipoCreate>;
  let component: EquipoCreate;
  let service: MockEquipoService;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, EquipoCreate],
      providers: [
        { provide: EquipoServices, useClass: MockEquipoService },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EquipoCreate);
    component = fixture.componentInstance;
    service = TestBed.inject(EquipoServices) as unknown as MockEquipoService;

    fixture.detectChanges(); 
  });

  it('Debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe marcar formulario inválido si fullname está vacío', () => {
    const fullname = component.equipoForm.controls['fullname'];
    fullname.setValue('');
    component.equipoForm.updateValueAndValidity();
    expect(component.equipoForm.invalid).toBeTrue();
  });

  
  
});
