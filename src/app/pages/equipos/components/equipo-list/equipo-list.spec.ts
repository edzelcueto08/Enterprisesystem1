import { ComponentFixture, TestBed } from "@angular/core/testing";
import EquipoList from "./equipo-list";
import { EquipoServices } from "../../services/equipo.services";
import { Router } from "@angular/router";
import { Role, Equipo } from "../../interfaces/equipo.interface";
import { of } from "rxjs";

describe('Componente Lista de Equipos', () => {
  let componente: EquipoList;
  let fixture: ComponentFixture<EquipoList>;
  let servicioEquipos: jasmine.SpyObj<EquipoServices>;
  let enrutador: jasmine.SpyObj<Router>;

  const equiposMock: Equipo[] = [
    { id: 1, fullname: "Club Bolívar", username: "Bolívar", password: "password123", campeonatos: 30, ciudad: "La Paz", role: Role.Libertadores },
    { id: 3, fullname: "Wilstermann", username: "Wilster", password: "password123", campeonatos: 15, ciudad: "Cochabamba", role: Role.Libertadores },
  ];

  beforeEach(async () => {
    const servicioSpy = jasmine.createSpyObj('EquipoServices', ['getEquipos', 'deleteequipo']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EquipoList],
      providers: [
        { provide: EquipoServices, useValue: servicioSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    servicioEquipos = TestBed.inject(EquipoServices) as jasmine.SpyObj<EquipoServices>;
    enrutador = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    servicioEquipos.getEquipos.and.returnValue(of(equiposMock));

    fixture = TestBed.createComponent(EquipoList);
    componente = fixture.componentInstance;
  });

  it('Debe crear el componente correctamente', () => {
    expect(componente).toBeTruthy();
  });

  it('Debe cargar los equipos al inicializar', (done) => {
    fixture.detectChanges();

    componente.equipos$.subscribe(equipos => {
      expect(equipos).toEqual(equiposMock);
      expect(equipos.length).toBe(2);
      expect(servicioEquipos.getEquipos).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('Debe inicializar la señal isDeleting como nula', () => {
    expect(componente.isDeleting()).toBeNull();
  });

  it('Debe navegar a la página de creación de equipo cuando se llama onAddEquipo', () => {
    componente.onAddEquipo();
    expect(enrutador.navigate).toHaveBeenCalledWith(['/equipos/equipo-create']);
  });

  it('Debe navegar a la página de edición del equipo con el id correcto cuando se llama onEditequipo', () => {
    const idEquipo = 5;

    componente.onEditequipo(idEquipo);

    expect(enrutador.navigate).toHaveBeenCalledWith(['/equipos', idEquipo]);
  });

 

  it('No debe eliminar el equipo cuando se cancela la confirmación', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    componente.onDeleteequipo(1);

    expect(servicioEquipos.deleteequipo).not.toHaveBeenCalled();
  });
});
