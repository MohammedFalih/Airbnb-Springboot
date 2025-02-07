import { HttpClient, HttpParams } from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { State } from '../../core/model/state.model';
import {
  BookedDatesDTOFromClient,
  BookedDatesDTOFromServer,
  BookedListing,
  CreateBooking,
} from '../model/booking.model';
import { environment } from '../../../environments/environment';
import dayjs from 'dayjs';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private http = inject(HttpClient);

  private createBooking$: WritableSignal<State<boolean>> = signal(
    State.Builder<boolean>().forInit()
  );
  createBookingSig = computed(() => this.createBooking$());

  private checkAvailability$: WritableSignal<
    State<Array<BookedDatesDTOFromClient>>
  > = signal(State.Builder<Array<BookedDatesDTOFromClient>>().forInit());
  checkAvailabilitySig = computed(() => this.checkAvailability$());

  private getBookedListing$: WritableSignal<State<Array<BookedListing>>> =
    signal(State.Builder<Array<BookedListing>>().forInit());
  getBookedListingSig = computed(() => this.getBookedListing$());

  private cancel$: WritableSignal<State<string>> = signal(
    State.Builder<string>().forInit()
  );
  cancelSig = computed(() => this.cancel$());

  constructor() {}

  create(newBooking: CreateBooking) {
    this.http
      .post<boolean>(`${environment.API_URL}/booking/create`, newBooking)
      .subscribe({
        next: (created) =>
          this.createBooking$.set(State.Builder<boolean>().forSuccess(created)),
        error: (error) =>
          this.createBooking$.set(State.Builder<boolean>().forError(error)),
      });
  }

  resetCreateBooking() {
    this.createBooking$.set(State.Builder<boolean>().forInit());
  }

  checkAvailability(publicId: string) {
    const params = new HttpParams().set('listingPublicId', publicId);
    this.http
      .get<Array<BookedDatesDTOFromServer>>(
        `${environment.API_URL}/booking/check-availability`,
        { params }
      )
      .pipe(map(this.mapDateToDayJs()))
      .subscribe({
        next: (bookedDates) =>
          this.checkAvailability$.set(
            State.Builder<Array<BookedDatesDTOFromClient>>().forSuccess(
              bookedDates
            )
          ),
        error: (error) =>
          this.checkAvailability$.set(
            State.Builder<Array<BookedDatesDTOFromClient>>().forError(error)
          ),
      });
  }

  getBookedListing(): void {
    this.http
      .get<Array<BookedListing>>(
        `${environment.API_URL}/booking/get-booked-listing`
      )
      .subscribe({
        next: (bookedListings) =>
          this.getBookedListing$.set(
            State.Builder<Array<BookedListing>>().forSuccess(bookedListings)
          ),
        error: (err) =>
          this.getBookedListing$.set(
            State.Builder<Array<BookedListing>>().forError(err)
          ),
      });
  }

  cancel(bookingPublicId: string, listingPublicId: string, byLandlord: boolean): void {
    const params = new HttpParams()
    .set("bookingPublicId", bookingPublicId)
    .set("listingPublicId", listingPublicId)
    .set("byLandlord", byLandlord);
  this.http.delete<string>(`${environment.API_URL}/booking/cancel`, {params})
    .subscribe({
      next: canceledPublicId => this.cancel$.set(State.Builder<string>().forSuccess(canceledPublicId)),
      error: err => this.cancel$.set(State.Builder<string>().forError(err)),
    });
  }

  resetCancel(): void {
    this.cancel$.set(State.Builder<string>().forInit());
  }

  private mapDateToDayJs = () => {
    return (
      bookedDates: Array<BookedDatesDTOFromServer>
    ): Array<BookedDatesDTOFromClient> => {
      return bookedDates.map((reservedDate) =>
        this.convertDateToDayJs(reservedDate)
      );
    };
  };

  private convertDateToDayJs<T extends BookedDatesDTOFromServer>(
    dto: T
  ): BookedDatesDTOFromClient {
    return {
      ...dto,
      startDate: dayjs(dto.startDate),
      endDate: dayjs(dto.endDate),
    };
  }
}
