import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MATERIAL_MODULES } from '@shared/material.module';

export interface CreateWishlistForm {
  name: FormControl<string>;
}

@Component({
  selector: 'app-create-wishlist',
  standalone: true,
  imports: [MATERIAL_MODULES, ReactiveFormsModule],
  templateUrl: './create-wishlist.component.html',
  styles: [`
    mat-form-field {width: 100%;}
  `]
})
export class CreateWishlistComponent {
  createWishlistForm!: FormGroup<CreateWishlistForm>;

  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.createWishlistForm = this.fb.group({
      name: this.fb.control('', {
        validators: [Validators.required],
        nonNullable: true,
      })
    });
  }
}
