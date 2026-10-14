import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle, } from '@angular/material/dialog';
import { MATERIAL_MODULES } from '@shared/material.module';

export interface AddToListForm {
  title: FormControl<string>;
  description: FormControl<string>;
  url: FormControl<string>;
}

export interface AddToListResult {
  title: string;
  description: string;
  url: string;
  image: File | null;
}

@Component({
  selector: 'app-add-to-list',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MATERIAL_MODULES, ReactiveFormsModule],
  templateUrl: './add-to-list.component.html',
  styles: [`
    .form { display: flex; flex-direction: column; gap: 16px; padding: 6px 2px 2px 2px; }
    .image-field { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
    .image-preview { width: 160px; height: 160px; object-fit: cover; display: block; border-radius: 14px; }
  `]
})
export class AddToListComponent implements OnInit {

  addToListForm!: FormGroup<AddToListForm>;
  selectedImage: File | null = null;
  imagePreviewUrl: string | null = null;

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddToListComponent>);

  ngOnInit(): void {
    this.addToListForm = this.fb.group({
      title: this.fb.control('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      description: this.fb.control('', {
        validators: [],
        nonNullable: true,
      }),
      url: this.fb.control('', {
        validators: [],
        nonNullable: true,
      })
    });
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.selectedImage = file;
    this.imagePreviewUrl = file ? URL.createObjectURL(file) : null;
  }

  submit(): void {
    const result: AddToListResult = { ...this.addToListForm.getRawValue(), image: this.selectedImage };
    this.dialogRef.close(result);
  }
}
