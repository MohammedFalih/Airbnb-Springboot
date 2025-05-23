import { HttpClient, HttpParams } from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { State } from '../core/model/state.model';
import { CardListing, CreatedListing, NewListing } from './model/listing.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LandlordListingService {
  http = inject(HttpClient);

  constructor() {}

  private create$: WritableSignal<State<CreatedListing>> = signal(
    State.Builder<CreatedListing>().forInit()
  );
  createSig = computed(() => this.create$());

  private getAll$: WritableSignal<State<Array<CardListing>>> = signal(
    State.Builder<Array<CardListing>>().forInit()
  );
  getAllSig = computed(() => this.getAll$());

  private delete$: WritableSignal<State<string>> = signal(
    State.Builder<string>().forInit()
  );
  deleteSig = computed(() => this.delete$());

  create(newListing: NewListing): void {
    const formData = new FormData();
    for (let i = 0; i < newListing.pictures.length; ++i) {
      formData.append('picture-' + i, newListing.pictures[i].file);
    }
    const clone = structuredClone(newListing);
    clone.pictures = [];
    formData.append('dto', JSON.stringify(clone));
    this.http
      .post<CreatedListing>(
        `${environment.API_URL}/landlord-listing/create`,
        formData
      )
      .subscribe({
        next: (listing) =>
          this.create$.set(State.Builder<CreatedListing>().forSuccess(listing)),
        error: (err) => {
          console.log('error on creating list: ', err);
          this.create$.set(State.Builder<CreatedListing>().forError(err));
        },
      });
  }

  getAll() {
    this.http
      .get<Array<CardListing>>(
        `${environment.API_URL}/landlord-listing/get-all`
      )
      .subscribe({
        next: (listing) =>
          this.getAll$.set(
            State.Builder<Array<CardListing>>().forSuccess(listing)
          ),
        error: (err) =>
          this.create$.set(State.Builder<CreatedListing>().forError(err)),
      });
  }

  delete(publicId: string) {
    const params = new HttpParams().set("publicId", publicId)
    this.http.delete<string>(
      `${environment.API_URL}/landlord-listing/delete`, {params}
    ).subscribe({
      next: publicId => this.delete$.set(State.Builder<string>().forSuccess(publicId)),
      error: error => this.create$.set(State.Builder<CreatedListing>().forError(error)),
    })
  }

  resetListingCreation() {
    this.create$.set(State.Builder<CreatedListing>().forInit());
  }
}
