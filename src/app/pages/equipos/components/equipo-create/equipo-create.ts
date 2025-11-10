import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EquipoServices } from '../../services/equipo.services';
import { Router } from '@angular/router';
import { Role } from '../../interfaces/equipo.interface';
import { CommonModule } from '@angular/common';
import { map, switchMap, finalize } from 'rxjs/operators';
import { Equipo } from '../../interfaces/equipo.interface';

@Component({
  selector: 'app-equipo-create',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './equipo-create.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EquipoCreate {
  private fb = inject(FormBuilder);
  private equipoService = inject(EquipoServices);
  private router = inject(Router);

  public equipoForm: FormGroup;
  public roles = Object.values(Role);
  public isSubmitting = false;

  constructor() {
    this.equipoForm = this.fb.group({
     
      fullname: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      campeonatos: [0, [Validators.required, Validators.min(0)]],
      ciudad: ['', [Validators.required, Validators.minLength(3)]],
      role: [Role.Libertadores, [Validators.required]],
    });
  }

  onSubmit(): void {
    this.equipoForm.markAllAsTouched();
    if (!this.equipoForm.valid) return;

    this.isSubmitting = true;

    const raw = this.equipoForm.value;
    const base = {
      ...raw,
      campeonatos: Number(raw.campeonatos),
    } as Omit<Equipo, 'id'>;

    
   this.equipoService.getEquipos().pipe(
  // calcula el mayor id numérico aunque vengan como "1","2",...
  map(list => (list?.length ? Math.max(...list.map(e => Number((e as any).id) || 0)) : 0) + 1),

  // 👇 Fuerza id como STRING antes de crear
  switchMap(nextId => this.equipoService.createEquipo({
        id: String(nextId),               // <-- aquí está la clave
        ...base
      } as any)),

      finalize(() => (this.isSubmitting = false))
    ).subscribe({
      next: () => this.router.navigate(['/equipos']),
      error: err => console.error('No se agregó el equipo', err),
    });
  }

  onCancel(): void {
    this.router.navigate(['/equipos']);
  }

  getErrorMessage(fieldname: string): string {
    const control = this.equipoForm.get(fieldname);
    if (control?.hasError('required')) return `${fieldname} es requerido`;
    if (control?.hasError('minlength')) {
      const n = control.errors?.['minlength'].requiredLength;
      return `${fieldname} debe tener al menos ${n} caracteres`;
    }
    if (control?.hasError('min')) return `${fieldname} no puede ser negativo`;
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.equipoForm.get(fieldName);
    return !!(control?.invalid && (control?.touched || this.isSubmitting));
  }
}
