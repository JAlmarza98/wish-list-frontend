import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MATERIAL_MODULES } from '@shared/material.module';
import { FooterComponent } from '@shared/footer/footer.component';
import { ListComponent } from '@components/list/list.component';
import { GroupsComponent } from '@components/groups/groups.component';
import { LoaderComponent } from '@shared/loader/loader.component';
import { AuthService } from '@auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MATERIAL_MODULES, FooterComponent, ListComponent, GroupsComponent, LoaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  activeTab: 'lists' | 'groups' = 'lists';

  get username(): string {
    return this.auth.UserData?.username ?? '';
  }

  get avatarInitial(): string {
    return this.username ? this.username.charAt(0).toUpperCase() : '?';
  }

  logOut(): void {
    this.auth.logOut().subscribe({
      next: () => this.router.navigateByUrl('/auth/login'),
      error: (error) => console.log(error),
    });
  }
}
