import { Component, OnInit } from '@angular/core';
import { MATERIAL_MODULES } from '@shared/material.module';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '@shared/loader/loader.service';
import { WishlistsService, WishlistShare } from 'src/app/services/wishlists.service';
import { WishesService } from 'src/app/services/wishes.service';
import { GroupsService } from 'src/app/services/groups.service';
import { SnackbarService } from '@shared/snackbar/snackbar.service';
import { TableAction, TableComponent } from '@shared/table/table.component';
import { AddToListComponent, CreateWishlistComponent, DeleteFromListComponent, UpdateOfListComponent } from './modals';
import { Group } from '@components/groups/groups.component';
import { forkJoin } from 'rxjs';

export interface Wish {
  title: string;
  description: string;
  url: string;
  date: string;
  id: string;
  reserved?: Reserved;
}

export interface Reserved {
  reservedBy: string;
  date: string;
}

export interface Wishlist {
  id: string;
  name: string;
}

export interface List {
  id: string;
  uid: string;
  user?: string;
  list: Wish[];
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MATERIAL_MODULES, TableComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  wishlists: Wishlist[] = [];
  myGroups: Group[] = [];
  selectedWishlist: Wishlist | null = null;
  wishList: Wish[] = [];
  sharedGroupIds: Set<string> = new Set();
  loadData = false;
  reloadTable = false;

  constructor(
    private _loader: LoaderService,
    private wishlistsService: WishlistsService,
    private wishesService: WishesService,
    private groupsService: GroupsService,
    private _snackbar: SnackbarService,
    readonly dialog: MatDialog,
  ) {
    this._loader.ShowLoader();
  }

  ngOnInit(): void {
    forkJoin({
      wishlists: this.wishlistsService.getMyWishlists(),
      groups: this.groupsService.getMyGroups(),
    }).subscribe(({ wishlists, groups }) => {
      this.wishlists = wishlists;
      this.myGroups = groups;
      this.loadData = true;
      this._loader.HideLoader();
    }, (err) => {
      this.loadData = true;
      this._loader.HideLoader();
      this._snackbar.showSnackBar('No se ha podido recuperar datos', 'error');
      console.log(err);
    });
  }

  selectWishlist(wishlist: Wishlist): void {
    this.selectedWishlist = wishlist;
    this.reloadTable = false;
    this._loader.ShowLoader();

    forkJoin({
      wishes: this.wishlistsService.getWishes(wishlist.id),
      shares: this.wishlistsService.getShares(wishlist.id),
    }).subscribe(({ wishes, shares }) => {
      this.wishList = wishes;
      this.sharedGroupIds = new Set(shares.map((s: WishlistShare) => s.id));
      this.reloadTable = true;
      this._loader.HideLoader();
    }, (err) => {
      this._loader.HideLoader();
      this._snackbar.showSnackBar('No se ha podido recuperar la lista', 'error');
      console.log(err);
    });
  }

  backToWishlists(): void {
    this.selectedWishlist = null;
  }

  createWishlist(): void {
    this.dialog.open(CreateWishlistComponent, { width: '500px' }).afterClosed().subscribe(result => {
      if (!result) return;
      this.wishlistsService.createWishlist(result.name).subscribe(wishlist => {
        this.wishlists = [...this.wishlists, wishlist];
        this._snackbar.showSnackBar('Lista creada', 'succes');
      }, (err) => {
        console.log(err);
        this._snackbar.showSnackBar('Error al crear la lista', 'error');
      });
    });
  }

  deleteWishlist(wishlist: Wishlist): void {
    this.dialog.open(DeleteFromListComponent, {
      width: '500px',
      data: { title: 'Eliminar lista', message: `Se va a eliminar la lista "${wishlist.name}" y todos sus regalos. Esta acción no se puede deshacer.` },
    }).afterClosed().subscribe(result => {
      if (result !== true) return;
      this.wishlistsService.deleteWishlist(wishlist.id).subscribe(() => {
        this.wishlists = this.wishlists.filter(w => w.id !== wishlist.id);
        if (this.selectedWishlist?.id === wishlist.id) this.selectedWishlist = null;
        this._snackbar.showSnackBar('Lista eliminada', 'succes');
      }, (err) => {
        console.log(err);
        this._snackbar.showSnackBar('Error al eliminar la lista', 'error');
      });
    });
  }

  toggleShare(group: Group, checked: boolean): void {
    if (!this.selectedWishlist) return;
    const action = checked
      ? this.wishlistsService.share(this.selectedWishlist.id, group.id)
      : this.wishlistsService.unshare(this.selectedWishlist.id, group.id);

    action.subscribe(() => {
      if (checked) this.sharedGroupIds.add(group.id);
      else this.sharedGroupIds.delete(group.id);
    }, (err) => {
      console.log(err);
      this._snackbar.showSnackBar('Error al actualizar el grupo compartido', 'error');
    });
  }

  tableAction(event: TableAction): void {
    switch (event.action) {
      case 'update':
        this.openUpdateDialog(event.row);
        break;

      case 'delete':
        this.openDeleteDialog(event.row);
        break;
    }
  }

  openInsertDialog(): void {
    if (!this.selectedWishlist) return;
    this.dialog.open(AddToListComponent, { width: '500px' }).afterClosed().subscribe(result => {
      if (result === undefined || result === '') return;
      this._loader.ShowLoader();
      this.reloadTable = false;

      this.wishlistsService.addWish(this.selectedWishlist!.id, result).subscribe(() => {
        this._snackbar.showSnackBar('Nuevo elemento añadido', 'succes');
        this.selectWishlist(this.selectedWishlist!);
      }, (err) => {
        console.log(err);
        this._snackbar.showSnackBar('Error al añadir a tu lista', 'error');
        this._loader.HideLoader();
        this.reloadTable = true;
      });
    });
  }

  openUpdateDialog(row: Wish): void {
    this.dialog.open(UpdateOfListComponent, {
      width: '500px',
      data: { row },
    }).afterClosed().subscribe(result => {
      if (result === undefined || result === '') return;
      this._loader.ShowLoader();
      this.reloadTable = false;

      this.wishesService.update(row.id, result).subscribe(() => {
        this._snackbar.showSnackBar('Elemento actualizado', 'succes');
        this.selectWishlist(this.selectedWishlist!);
      }, (err) => {
        console.log(err);
        this._snackbar.showSnackBar('Error al actualizar tu lista', 'error');
        this._loader.HideLoader();
        this.reloadTable = true;
      });
    });
  }

  openDeleteDialog(row: Wish): void {
    this.dialog.open(DeleteFromListComponent, { width: '500px' }).afterClosed().subscribe(result => {
      if (result !== true) return;
      this._loader.ShowLoader();
      this.reloadTable = false;

      this.wishesService.delete(row.id).subscribe(() => {
        this._snackbar.showSnackBar('Elemento eliminado', 'succes');
        this.selectWishlist(this.selectedWishlist!);
      }, (err) => {
        console.log(err);
        this._snackbar.showSnackBar('Error al eliminar a tu lista', 'error');
        this._loader.HideLoader();
        this.reloadTable = true;
      });
    });
  }
}
