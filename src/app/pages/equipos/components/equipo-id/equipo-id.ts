import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EquipoServices } from '../../services/equipo.services';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../../interfaces/equipo.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-equipo-id',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './equipo-id.html',
})
export default class Equipoid implements OnInit {
  private fb = inject(FormBuilder);
  private equipoService = inject(EquipoServices);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public equipoForm: FormGroup;
  public roles = Object.values(Role);
  public isSubmitting = false;
  public isLoading = true;
  public equipoId: number = 0;

  constructor() {
    this.equipoForm= this.fb.group({
      id: [0],
      fullname: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      campeonatos: [0, [Validators.required, Validators.min(0)]],
      ciudad: ['', [Validators.required, Validators.minLength(3)]],
      role: [Role.Libertadores, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.equipoId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.equipoId ) {
      this.loadUser();
    }
  }

  loadUser(): void {
    this.equipoService.getEquipoid(this.equipoId ).subscribe({
      next: (equipo) => {
        if (equipo) {
          this.equipoForm.patchValue(equipo);
          this.isLoading = false;
        } else {
          this.router.navigate(['/equipos']);
        }
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.router.navigate(['/equipos']);
      }
    });
  }

  onSubmit(): void {
    if (this.equipoForm.valid) {
      this.isSubmitting = true;

      this.equipoService.updateEquipo(this.equipoId, this.equipoForm.value).subscribe({
        next: () => {
          this.router.navigate(['/equipos']);
        },
        error: (error) => {
          console.error('Error updating equipo:', error);
          this.isSubmitting = false;
        }
      });
    } else {
      Object.keys(this.equipoForm.controls).forEach(key => {
        this.equipoForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/equipos']);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.equipoForm.get(fieldName);

    if (control?.hasError('required')) {
      return `${fieldName} es requerido`;
    }

    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `${fieldName} debe tener al menos ${minLength} caracteres`;
    }

    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.equipoForm.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }
}
  