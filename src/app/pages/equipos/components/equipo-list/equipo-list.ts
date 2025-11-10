import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { EquipoServices } from '../../services/equipo.services';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Equipo } from '../../interfaces/equipo.interface';
import { AsyncPipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-equipo-list',
  imports: [AsyncPipe, TitleCasePipe  ],
  templateUrl: './equipo-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export  default class EquipoList {
private equiposervice= inject(EquipoServices);
private router = inject(Router);

public equipos$:Observable<Equipo[]>=this.equiposervice.getEquipos();
public isDeleting = signal<number | null>(null);

onAddEquipo(): void{
    this.router.navigate(['/equipos/equipo-create']);
  }
  onEditequipo(id: number): void {
    this.router.navigate(['/equipos', id]);
  }

  onDeleteequipo(id: number): void {
    if (confirm('¿Está seguro que desea eliminar este Equipo?')) {
      this.isDeleting.set(id);

      this.equiposervice.deleteequipo(id).subscribe({
        next: () => {
          // Reload users list
          this.equipos$ = this.equiposervice.getEquipos();
          this.isDeleting.set(null);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.isDeleting.set(null);
          alert('Error al eliminar el usuario');
        }
      });
    }
  }
 }
