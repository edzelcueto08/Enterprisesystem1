import { effect, Injectable, signal } from '@angular/core';
import { Stock } from '../interfaces/stock.interfaces';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  // ✅ Cargar datos desde localStorage al iniciar
  stocklist = signal<Stock[]>(loadFromLocalStorage());

  constructor() {
    // ✅ Crear el efecto dentro del constructor
    effect(() => {
      const data = JSON.stringify(this.stocklist());
      localStorage.setItem('stock', data);
    });
  }

  // ✅ Método para agregar un nuevo elemento al inventario
  addStock(stockItem: Stock) {
    this.stocklist.update((list) => [...list, stockItem]);
  }

  // ✅ Método para limpiar inventario y localStorage
  clearStock() {
    this.stocklist.set([]);
    localStorage.removeItem('stock');
  }
}

// ✅ Función auxiliar que carga datos del localStorage
function loadFromLocalStorage(): Stock[] {
  const stored = localStorage.getItem('stock');
  return stored ? JSON.parse(stored) : [];
}
