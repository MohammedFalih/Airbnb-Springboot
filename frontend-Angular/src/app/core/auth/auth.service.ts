import { Location } from '@angular/common';
import { HttpClient, HttpParams, HttpStatusCode } from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { User } from '../model/user.model';
import { State } from '../model/state.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http: HttpClient = inject(HttpClient);

  location: Location = inject(Location);

  notConnected: string = 'NOT_CONNECTED';

  private fetchUser$: WritableSignal<State<User>> = signal(
    State.Builder<User>().forSuccess({ email: this.notConnected })
  );
  fetchUser = computed(() => this.fetchUser$());

  fetch(forceResync: boolean): void {
    this.fetchHttpUser(forceResync).subscribe({
      next: (user) =>
        this.fetchUser$.set(State.Builder<User>().forSuccess(user)),
      error: (err) => {
        if (
          err.status === HttpStatusCode.Unauthorized &&
          this.isAuthenticated()
        ) {
          this.fetchUser$.set(
            State.Builder<User>().forSuccess({ email: this.notConnected })
          );
        } else {
          this.fetchUser$.set(State.Builder<User>().forError(err));
        }
      },
    });
  }

  login(): void {
    location.href = `${location.origin}${this.location.prepareExternalUrl(
      'oauth2/authorization/okta'
    )}`;
  }

  logout(): void {
    console.log('logout hitted');
    this.http.post(`${environment.API_URL}/auth/logout`, {}).subscribe({
      next: (response: any) => {
        console.log('response logout', response)
        this.fetchUser$.set(
          State.Builder<User>().forSuccess({ email: this.notConnected })
        );
        location.href = response.logoutUrl;
      },
    });
  }

  isAuthenticated() {
    if (this.fetchUser$().value) {
      return this.fetchUser$().value!.email !== this.notConnected;
    } else {
      return false;
    }
  }

  fetchHttpUser(forceResync: boolean): Observable<User> {
    const params = new HttpParams().set('forceResync', forceResync);
    return this.http.get<User>(
      `${environment.API_URL}/auth/get-authenticated-user`,
      { params }
    );
  }

  hasAnyAuthority(authorities: string[] | string): boolean {
    if (this.fetchUser$().value!.email === this.notConnected) {
      return false;
    }

    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }

    return this.fetchUser$().value!.authorities!.some((authority: string) =>
      authorities.includes(authority)
    );
  }
}
