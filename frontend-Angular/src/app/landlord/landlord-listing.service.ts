import { HttpClient } from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { State } from '../core/model/state.model';
import { CreatedListing, NewListing } from './model/listing.model';
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

  create(newListing: NewListing): void {
    console.log("createlisting:2")
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
        error: (err) =>{
          console.log("error on creating list: ", err);
          this.create$.set(State.Builder<CreatedListing>().forError(err));
        }
      });
  }

  resetListingCreation() {
    this.create$.set(State.Builder<CreatedListing>().forInit());
  }
}
