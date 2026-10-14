import { Component, Optional, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MATERIAL_MODULES } from '@shared/material.module';

export interface DeleteConfirmData {
  title?: string;
  message?: string;
}

@Component({
  selector: 'app-delete-from-list',
  standalone: true,
  imports: [MATERIAL_MODULES],
  template: `
  <h2 mat-dialog-title>{{ data?.title ?? 'Eliminar de la lista' }}</h2>
  <mat-dialog-content>
    <p>
      {{ data?.message ?? 'Se va a eliminar este elemento de la lista. Esta acción no se puede deshacer' }}
    </p>
    <p>¿Desea continuar?</p>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button class="pill-button pill-button--ghost" mat-dialog-close>Cancelar</button>
    <button class="pill-button" [mat-dialog-close]="true">Eliminar</button>
  </mat-dialog-actions>
  `,
  styles: [`p { color: var(--color-text-secondary); font-size: 14px; }`]
})
export class DeleteFromListComponent {
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: DeleteConfirmData | null) {}
}
