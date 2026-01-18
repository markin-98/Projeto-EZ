import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiMockService } from '../../../core/services/api-mock.service';
import { AuthService } from '../../../core/services/auth.service';
import { finalize } from 'rxjs/operators';

type OrderStatus = 'PAGO' | 'PENDENTE' | 'CANCELADO';

type Order = { id: string; data: number; cliente: string; valor: number; status: OrderStatus; };

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit {
  loading = false;
  errorMsg: string | null = null;

  userEmail: string | null = null;

  period: 7 | 30 = 7;

  kpis = { receita: 0, pedidos: 0, ticketMedio: 0 };

  orders: Order[] = [];
  filtered: Order[] = [];

  search = '';
  sort: 'VALOR_DESC' | 'VALOR_ASC' = 'VALOR_DESC';

  constructor(
    private api: ApiMockService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.load(7);
  }

  load(period: 7 | 30 = this.period): void {
    this.period = period;
    this.errorMsg = null;
    this.loading = true;

    this.api.getDashboard(this.period)
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      }))

      .subscribe({
        next: (res) => {
          this.userEmail = res.userEmail;
          this.kpis = res.kpis;
          this.orders = res.orders;
          this.applyFilters();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMsg = err?.message ?? 'Erro inesperado.';
          this.cdr.detectChanges();
        }
      });
  }

  setSearch(v: string): void {
    this.search = v;
    this.applyFilters();
  }

  toggleSort(): void {
    this.sort = this.sort === 'VALOR_DESC' ? 'VALOR_ASC' : 'VALOR_DESC';
    this.applyFilters();
  }

  applyFilters(): void {
    const term = this.search.trim().toLowerCase();

    let data = this.orders
      .filter(o => term ? o.cliente.toLowerCase().includes(term) : true);

    data = data.sort((a, b) => {
      if (this.sort === 'VALOR_DESC') return b.valor - a.valor;
      return a.valor - b.valor;
    });

    this.filtered = data;
  }

  logout(): void {
    this.auth.logout();
  }
}
