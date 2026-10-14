import { Component, Input, OnChanges, output } from '@angular/core';
import { MATERIAL_MODULES } from '@shared/material.module';
import { Wish } from '@components/list/list.component';

export interface TableAction {
  row: Wish,
  action: 'update' | 'delete' | 'reserve' | 'remove'
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MATERIAL_MODULES],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent implements OnChanges {
  @Input() data!: Wish[];
  @Input() isGroup!: boolean;

  tableActionEvent = output<TableAction>();

  filterValue = '';
  filtered: Wish[] = [];

  ngOnChanges(): void {
    this.applyFilter(this.filterValue);
  }

  applyFilter(value: string): void {
    this.filterValue = value;
    const needle = value.trim().toLowerCase();
    this.filtered = !needle
      ? this.data ?? []
      : (this.data ?? []).filter(wish =>
          wish.title.toLowerCase().includes(needle) ||
          (wish.description ?? '').toLowerCase().includes(needle)
        );
  }

  tableAction(row: Wish, action: 'update' | 'delete' | 'reserve' | 'remove'): void {
    this.tableActionEvent.emit({ row, action });
  }
}
