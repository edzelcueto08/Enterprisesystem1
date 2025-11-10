import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Equipo } from '../interfaces/equipo.interface';

@Injectable({
  providedIn: 'root'
})
export class EquipoServices {

private httprequest= inject (HttpClient);
public url: string='http://localhost:3000/equipos';

getEquipos():Observable<Equipo[]>{
  return this.httprequest.get<Equipo[]>(this.url);
}
getEquipoid (id: number): Observable<Equipo> {
    return this.httprequest.get<Equipo>(`${this.url}/${id}`);
  }
createEquipo(equipo:Equipo) : Observable<Equipo>{
  return this.httprequest.post<Equipo>(this.url, equipo)
}
updateEquipo(id: number, equipo: Equipo): Observable<Equipo> {
    return this.httprequest.put<Equipo>(`${this.url}/${id}`, equipo);
  }

deleteequipo(id: number): Observable<void> {
    return this.httprequest.delete<void>(`${this.url}/${id}`);
  }

}
