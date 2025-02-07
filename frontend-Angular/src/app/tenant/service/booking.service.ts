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
