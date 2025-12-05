import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-pagination',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flex justify-center gap-2 mt-4" *ngIf="totalPages > 1">
      <button 
        class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
        [disabled]="currentPage === 0"
        (click)="onPageChange(currentPage - 1)">
        Previous
      </button>
      
      <span class="px-3 py-1">
        Page {{ currentPage + 1 }} of {{ totalPages }}
      </span>
      
      <button 
        class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
        [disabled]="currentPage >= totalPages - 1"
        (click)="onPageChange(currentPage + 1)">
        Next
      </button>
    </div>
  `
})
export class PaginationComponent {
    @Input() currentPage = 0;
    @Input() totalPages = 1;
    @Output() pageChange = new EventEmitter<number>();

    onPageChange(page: number): void {
        if (page >= 0 && page < this.totalPages) {
            this.pageChange.emit(page);
        }
    }
}
