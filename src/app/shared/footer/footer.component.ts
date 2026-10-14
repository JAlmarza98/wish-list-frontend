import { Component } from '@angular/core';
import { MATERIAL_MODULES } from '@shared/material.module';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MATERIAL_MODULES],
  template: `
    <mat-toolbar>
      <span>developed by Joel Almarza, 2026</span>
    </mat-toolbar>
  `,
  styles: [`
    mat-toolbar{ display: flex; justify-content:flex-end; align-items: center; background: transparent; }
    span {font-size: 11px; color: var(--color-text-secondary); font-family: var(--font-family);}
  `]
})
export class FooterComponent {

}
