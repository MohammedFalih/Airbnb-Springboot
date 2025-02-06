import { HttpClient, HttpParams } from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { State } from '../core/model/state.model';
import { CardListing, Listing } from '../landlord/model/listing.model';
import {
  createPaginationOption,
  Page,
  Pagination,
} from '../core/model/request.model';
import { Subject } from 'rxjs';
import { CategoryName } from '../layout/navbar/category/category.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TenantListingService {
  http = inject(HttpClient);

  private getAllByCategory$: WritableSignal<State<Page<CardListing>>> = signal(
    State.Builder<Page<CardListing>>().forInit()
  );
  getAllByCategorySig = computed(() => this.getAllByCategory$());

  private getOneByPublicId$: WritableSignal<State<Listing>> = signal(
    State.Builder<Listing>().forInit()
  );
  getOneByPublicIdSig = computed(() => this.getOneByPublicId$());

  private search$: Subject<State<Page<CardListing>>> = new Subject<
    State<Page<CardListing>>
  >();
  search = this.search$.asObservable();

  constructor() {}

  getAllByCategory(pageRequest: Pagination, category: CategoryName) {
    let params = createPaginationOption(pageRequest);
    params = params.set('category', category);
    this.http
      .get<Page<CardListing>>(
        `${environment.API_URL}/tenant-listing/get-all-by-category`,
        { params }
      )
      .subscribe({
        next: (displayListingCards) =>
          this.getAllByCategory$.set(
            State.Builder<Page<CardListing>>().forSuccess(displayListingCards)
          ),
        error: (error) =>
          this.getAllByCategory$.set(
            State.Builder<Page<CardListing>>().forError(error)
          ),
      });
  }

  resetGetAllCategory() {
    this.getAllByCategory$.set(State.Builder<Page<CardListing>>().forInit());
  }

  getOnePublicId(publicId: string) {
    let params = new HttpParams().set('publicId', publicId);
    this.http
      .get<Listing>(`${environment.API_URL}/tenant-listing/get-one`, { params })
      .subscribe({
        next: (listing) =>
          this.getOneByPublicId$.set(
            State.Builder<Listing>().forSuccess(listing)
          ),
        error: (error) =>
          this.getOneByPublicId$.set(State.Builder<Listing>().forError(error)),
      });
  }

  resetGetOneByPublicId() {
    this.getOneByPublicId$.set(State.Builder<Listing>().forInit());
  }

  // searchListing(newSearch: Search, pageRequest: Pagination): void {
  //   const params = createPaginationOption(pageRequest);
  //   this.http.post<Page<CardListing>>(`${environment.API_URL}/tenant-listing/search`, newSearch, {params})
  //     .subscribe({
  //       next: displayListingCards => this.search$.next(State.Builder<Page<CardListing>>().forSuccess(displayListingCards)),
  //       error: err => this.search$.next(State.Builder<Page<CardListing>>().forError(err))
  //     })
  // }
}
