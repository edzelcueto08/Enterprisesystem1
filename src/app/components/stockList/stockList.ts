import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { Stock } from '../../interfaces/stock.interfaces';
import { StockService } from '../../services/stockServices';

@Component({
  selector: 'stock-list',
  imports: [],
  templateUrl: './stockList.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockList {
  stockTitle = signal<string>('Listado del stock');
  stockList = input.required<Stock[]>();
}
