import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { StockService } from '../../services/stockServices';
import { StockList } from '../../components/stockList/stockList';

@Component({
  selector: 'app-stock-reactive',
  standalone: true,
  imports: [ReactiveFormsModule, StockList],
  templateUrl: './stock-reactive.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class StockReactive {
  private fb = inject(FormBuilder);
  public stockService = inject(StockService);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    cuantity: [0, [Validators.required, Validators.min(0)]],
    existance: [0, [Validators.required, Validators.min(0)]],
  });

  get name() { return this.form.get('name'); }
  get cuantity() { return this.form.get('cuantity'); }
  get existance() { return this.form.get('existance'); }

  submit(){
    if(this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    // generate id
    const current = this.stockService.stocklist();
    const nextId = current.length ? Math.max(...current.map(s => s.id)) + 1 : 1;
    this.stockService.addStock({
      id: nextId,
      name: String(raw.name ?? ''),
      cuantity: Number(raw.cuantity ?? 0),
      existance: Number(raw.existance ?? 0),
    });
    this.form.reset({ name: '', cuantity: 0, existance: 0 });
  }

  clearAll(){
    this.stockService.clearStock();
  }
}
