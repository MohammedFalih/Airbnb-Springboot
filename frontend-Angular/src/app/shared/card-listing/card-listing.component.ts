import {
  Component,
  effect,
  EventEmitter,
  inject,
  input,
  Output,
} from '@angular/core';

import { BookedListing } from '../../tenant/model/booking.model';
import { Router } from '@angular/router';
import { CategoryService } from '../../layout/navbar/category/category.service';
import { CardListing } from '../../landlord/model/listing.model';
import { CountryService } from '../../landlord/property-create/step/location-step/country.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-card-listing',
  standalone: true,
  imports: [FontAwesomeModule, DatePipe, CurrencyPipe],
  templateUrl: './card-listing.component.html',
  styleUrl: './card-listing.component.scss',
})
export class CardListingComponent {
  listing = input.required<CardListing | BookedListing>();
  cardMode = input<'landlord' | 'booking'>();

  @Output()
  deleteListing = new EventEmitter<CardListing>();

  @Output()
  cancelBooking = new EventEmitter<BookedListing>();

  bookingListing: BookedListing | undefined;
  cardListing: CardListing | undefined;

  router = inject(Router);
  categoryService = inject(CategoryService);
  countryService = inject(CountryService);

  constructor() {
    this.listenToListing();
    this.listenToCardModel();
  }

  private listenToListing() {
    effect(() => {
      const listing = this.listing();
      this.countryService.getCountryByCode(listing.location).subscribe({
        next: (country) => {
          if (listing) {
            this.listing().location =
              country.region + ', ' + country.name.common;
          }
        },
      });
    });
  }

  private listenToCardModel() {
    effect(() => {
      const cardMode = this.cardMode();
      if (cardMode && cardMode === 'booking') {
        this.bookingListing = this.listing() as BookedListing;
      } else {
        this.cardListing = this.listing() as CardListing;
      }
    });
  }

  onDeleteListing(displayCardListingDTO: CardListing) {
    this.deleteListing.emit(displayCardListingDTO);
  }

  onCancelBooking(bookingList: BookedListing) {
    this.cancelBooking.emit(bookingList);
  }

  onClickCard(publicId: string) {
    this.router.navigate(['listing'], { queryParams: { id: publicId } });
  }
}
