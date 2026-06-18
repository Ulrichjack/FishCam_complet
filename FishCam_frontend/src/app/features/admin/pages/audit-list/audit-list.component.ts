import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { AuditLogStore } from '../../stores/audit-log.store';

@Component({
  selector: 'app-audit-list',
  standalone: true,
  imports: [DatePipe, LucideAngularModule],
  templateUrl: './audit-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditListComponent implements OnInit {
  
  readonly store = inject(AuditLogStore);

  // --- SIGNALS DE CALCUL POUR ADAPTER LA PAGINATION ---
  
  readonly currentPage = computed(() => {
    const pageData = this.store.logsPage();
    return pageData?.page?.number ?? pageData?.number ?? 0;
  });

  readonly totalPages = computed(() => {
    const pageData = this.store.logsPage();
    return pageData?.page?.totalPages ?? pageData?.totalPages ?? 1;
  });

  readonly isFirst = computed(() => {
    return this.currentPage() === 0;
  });

  readonly isLast = computed(() => {
    return this.currentPage() >= this.totalPages() - 1;
  });

  ngOnInit(): void {
    this.store.loadLogs(0);
  }

  onPageChange(page: number): void {
    this.store.loadLogs(page);
  }
}