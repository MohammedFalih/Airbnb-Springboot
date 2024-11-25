import { Component, effect, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import { CategoryComponent } from './category/category.component';
import { AvatarComponent } from './avatar/avatar.component';
import { MenuItem } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastService } from '../toast.service';
import { User } from '../../core/model/user.model';
import { AuthService } from '../../core/auth/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    ButtonModule,
    FontAwesomeModule,
    ToolbarModule,
    MenuModule,
    CategoryComponent,
    AvatarComponent,
  ],
  providers: [DialogService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  location: string = 'Anywhere';

  guests: string = 'Add guests';

  dates: string = 'Any week';

  toastService = inject(ToastService);
  authService = inject(AuthService);
  dialogService = inject(DialogService);
  activatedRoute = inject(ActivatedRoute);
  ref: DynamicDialogRef | undefined;

  login = () => this.authService.login();

  logout = () => this.authService.login();

  currentMenuItems: MenuItem[] | undefined = [];

  connectedUser: User = { email: this.authService.notConnected };

  constructor() {
    effect(() => {
      if (this.authService.fetchUser().status === 'OK') {
        this.connectedUser = this.authService.fetchUser().value!;
        this.currentMenuItems = this.fetchMenu();
      }
    });
  }

  ngOnInit(): void {
    this.authService.fetch(false);
    this.extractInformationForSearch();
  }

  private extractInformationForSearch() {}

  private fetchMenu() {
    if (this.authService.isAuthenticated()) {
      return [
        {
          label: 'My properties',
          routerLink: 'landlord/properties',
          visible: this.hasToBeLandlord(),
        },
        {
          label: 'My booking',
          routerLink: 'booking',
        },
        {
          label: 'My reservation',
          routerLink: 'landlord/reservation',
          visible: this.hasToBeLandlord(),
        },
        {
          label: 'Log out',
          command: this.logout,
        },
      ];
    } else {
      return [
        {
          label: 'Sign up',
          styleClass: 'font-bold',
          command: this.login,
        },
        {
          label: 'Log in',
          command: this.login,
        },
      ];
    }
  }

  hasToBeLandlord(): boolean {
    return this.authService.hasAnyAuthority('ROLE_LANDLORD');
  }


}
