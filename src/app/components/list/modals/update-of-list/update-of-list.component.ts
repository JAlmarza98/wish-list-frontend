import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MATERIAL_MODULES } from '@shared/material.module';
import { AddToListForm } from '../add-to-list/add-to-list.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Wish } from '@components/list/list.component';

export interface UpdateOfListResult {
  title: string;
  description: string;
  url: string;
  image: File | null;
  removeImage: boolean;
}

@Component({
  selector: 'app-update-of-list',
  standalone: true,
  imports: [MATERIAL_MODULES, ReactiveFormsModule],
  templateUrl: './update-of-list.component.html',
  styles: [`
    mat-form-field {width: 100%;}
    .image-preview { width: 160px; height: 160px; object-fit: cover; display: block; margin-top: 8px; border-radius: 4px; }
  `]
})
export class UpdateOfListComponent {
  updateOfList!: FormGroup<AddToListForm>;
  selectedImage: File | null = null;
  imagePreviewUrl: string | null = null;
  removeImage = false;

  readonly dialogRef = inject(MatDialogRef<UpdateOfListComponent>);
  readonly data = inject<{row:Wish}>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.imagePreviewUrl = this.data.row.image ?? null;
    this.updateOfList = this.fb.group({
      title: this.fb.control(this.data.row.title, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      description: this.fb.control(this.data.row.description, {
        validators: [],
        nonNullable: true,
      }),
      url: this.fb.control(this.data.row.url, {
        validators: [],
        nonNullable: true,
      })
    });
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.selectedImage = file;
    this.removeImage = false;
    this.imagePreviewUrl = file ? URL.createObjectURL(file) : null;
  }

  clearImage(): void {
    this.selectedImage = null;
    this.removeImage = true;
    this.imagePreviewUrl = null;
  }

  submit(): void {
    const result: UpdateOfListResult = {
      ...this.updateOfList.getRawValue(),
      image: this.selectedImage,
      removeImage: this.removeImage,
    };
    this.dialogRef.close(result);
  }
}
