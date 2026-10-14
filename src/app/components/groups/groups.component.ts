import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '@shared/loader/loader.service';
import { MATERIAL_MODULES } from '@shared/material.module';
import { SnackbarService } from '@shared/snackbar/snackbar.service';
import { GroupsService } from 'src/app/services/groups.service';
import { CreateGroupComponent } from './modals/create-group/create-group.component';
import { RouterLink } from '@angular/router';

export interface Group {
  id: string;
  name: string;
  created_at?: string;
  member_count?: number;
}

export interface GroupMember {
  id: string;
  username: string;
}

export interface SharedList {
  id: string;
  name: string;
  ownerId: string;
  ownerUsername: string;
  wishes: unknown[];
}

export interface GroupDetail {
  id: string;
  name: string;
  createdAt: string;
  members: GroupMember[];
  sharedLists: SharedList[];
}

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [MATERIAL_MODULES, RouterLink],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent {
  groupsList: Group[] = [];
  loadReady: boolean = false;

  constructor(
    private _loader: LoaderService,
    private _service: GroupsService,
    private _snackbar: SnackbarService,
    readonly dialog: MatDialog,
  ) {
    this._loader.ShowLoader();
    this.loadReady = false;
  }

  ngOnInit(): void {
    this.getMyGroups();
  }

  getMyGroups(): void {
    this._service.getMyGroups().subscribe((response: Group[]) => {
      this.groupsList = response;
      this.loadReady = true;
      this._loader.HideLoader();
    }, (err: any) => {
      this.groupsList = [];
      this.loadReady = true;
      this._loader.HideLoader();
      this._snackbar.showSnackBar('No se ha podido recuperar datos', 'error');
      console.log(err);
    });
  }

  createNewGroup(): void {
    this.dialog.open(CreateGroupComponent, {
      width: '500px',
    }).afterClosed().subscribe(result => {
      if (result === undefined || result === '') return;
      this._loader.ShowLoader();

      this._service.createGroup(result.name).subscribe(group => {
        this.groupsList = [...this.groupsList, { ...group, member_count: 1 }];
        this._snackbar.showSnackBar('Nuevo grupo creado', 'succes');
        this._loader.HideLoader();
      }, (err) => {
        console.log(err);
        this._snackbar.showSnackBar('Error al Crear tu grupo', 'error');
        this._loader.HideLoader();
      });
    });
  }
}
