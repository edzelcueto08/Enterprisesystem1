import { Routes } from '@angular/router';

export const equiporoutes: Routes = [
{
    path: '',
    loadComponent: () => import('./components/equipo-list/equipo-list')

},
{
    path: 'equipo-create',
    loadComponent: () => import('./components/equipo-create/equipo-create')

},
{
    path: ':id',
    loadComponent: () => import('./components/equipo-id/equipo-id')

},
{
    path: '**',
    redirectTo: ''

}
];
export default equiporoutes;