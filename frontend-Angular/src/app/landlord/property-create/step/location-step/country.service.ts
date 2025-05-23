import { HttpClient } from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { State } from '../../../../core/model/state.model';
import { Country } from './country.model';
import { catchError, map, Observable, of, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  http = inject(HttpClient);

  private countries$: WritableSignal<State<Array<Country>>> = signal(
    State.Builder<Array<Country>>().forInit()
  );
  countries = computed(() => this.countries$());

  private fetchCountry$ = new Observable<Array<Country>>();

  constructor() {
    this.initFetchGetAllCountries();
    this.fetchCountry$.subscribe();
  }

  initFetchGetAllCountries() {
    this.fetchCountry$ = this.http
      .get<Array<Country>>('/assets/countries.json')
      .pipe(
        tap((country) =>
          this.countries$.set(
            State.Builder<Array<Country>>().forSuccess(country)
          )
        ),
        catchError((err) => {
          this.countries$.set(State.Builder<Array<Country>>().forError(err));
          return of(err);
        }),
        shareReplay(1)
      );
  }

  public getCountryByCode(code: string) {
    return this.fetchCountry$.pipe(
      map((countries) => countries.filter((country) => country.cca3 === code)),
      map((countries) => countries[0])
    );
  }
}
