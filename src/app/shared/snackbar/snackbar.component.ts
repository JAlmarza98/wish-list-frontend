import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MATERIAL_MODULES } from '@shared/material.module';
import { SnackbarService } from './snackbar.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [MATERIAL_MODULES],
  template: `
    <div class="snackbar">
      <mat-icon [class.icon-success]="data?.type === 'succes'" [class.icon-error]="data?.type === 'error'">{{data?.icon}}</mat-icon>
      <span>{{data?.message}}</span>
      <div class="spacer"></div>
      <button class="snackbar-close" type="button" (click)="closeSnakebar()" aria-label="Cerrar">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .snackbar {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: var(--font-family);
      font-size: 13.5px;
      font-weight: 600;
    }
    .spacer { flex: 1; }
    mat-icon { flex-shrink: 0; color: #fff; }
    mat-icon.icon-success { color: #4ADE80; }
    mat-icon.icon-error { color: #FCA5A5; }
    .snackbar-close {
      border: none;
      background: transparent;
      color: #fff;
      opacity: 0.7;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: var(--radius-pill);
      flex-shrink: 0;
    }
    .snackbar-close:hover { opacity: 1; background: rgba(255, 255, 255, 0.12); }
    .snackbar-close .mat-icon { font-size: 18px; width: 18px; height: 18px; color: #fff; }
  `]
})
export class SnackbarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private snackBar: SnackbarService
  ) { }

  closeSnakebar(): void {
    this.snackBar.hideSnackBar()
  }
}
