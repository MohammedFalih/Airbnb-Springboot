import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { TenantListingService } from '../tenant-listing.service';
import { ToastService } from '../../layout/toast.service';
import { CategoryService } from '../../layout/navbar/category/category.service';
import { CountryService } from '../../landlord/property-create/step/location-step/country.service';
import { ActivatedRoute } from '@angular/router';
import { DisplayPicture, Listing } from '../../landlord/model/listing.model';
import { Category } from '../../layout/navbar/category/category.model';
import { map } from 'rxjs';
import { AvatarComponent } from '../../layout/navbar/avatar/avatar.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass } from '@angular/common';
import { BookDateComponent } from "../book-date/book-date.component";

@Component({
  selector: 'app-display-listing',
  standalone: true,
  imports: [NgClass,
    FaIconComponent,
    AvatarComponent, BookDateComponent],
  templateUrl: './display-listing.component.html',
  styleUrl: './display-listing.component.scss',
})
export class DisplayListingComponent implements OnInit, OnDestroy {
  tenantListingService = inject(TenantListingService);
  toastService = inject(ToastService);
  categoryService = inject(CategoryService);
  countryService = inject(CountryService);
  activatedRoute = inject(ActivatedRoute);

  listing: Listing | undefined;
  category: Category | undefined;
  currentPublicId = '';

  loading = false;

  constructor() {
    this.listenToFetchListing();
  }

  ngOnInit(): void {
    this.extractIdParamFromRouter();
  }

  ngOnDestroy(): void {
    this.tenantListingService.resetGetOneByPublicId();
  }

  extractIdParamFromRouter() {
    this.activatedRoute.queryParams
      .pipe(map((params) => params['id']))
      .subscribe({
        next: (publicId) => this.fetchListing(publicId),
      });
  }

  fetchListing(publicId: string): void {
    this.loading = true;
    this.currentPublicId = publicId;
    this.tenantListingService.getOnePublicId(publicId);
  }

  private listenToFetchListing() {
    effect(() => {
      const listingByPublicIdState =
        this.tenantListingService.getOneByPublicIdSig();
      if (listingByPublicIdState.status === 'OK') {
        this.loading = false;
        this.listing = listingByPublicIdState.value;
        if (this.listing) {
          console.log('listing: ', this.listing)
          this.listing.pictures = this.putCoverPictureFirst(
            this.listing.pictures
          );
          this.category = this.categoryService.getCategoryByTechnicalName(
            this.listing.category
          );
          this.countryService
            .getCountryByCode(this.listing.location)
            .subscribe({
              next: (country) => {
                if (this.listing) {
                  this.listing.location =
                    country.region + ', ' + country.name.common;
                }
              },
            });
        }
      } else if (listingByPublicIdState.status === 'ERROR') {
        this.loading = false;
        this.toastService.send({
          severity: 'error',
          detail: 'Error when fetching the listing',
        });
      }
    });
  }

  private putCoverPictureFirst(pictures: Array<DisplayPicture>) {
    const coverIndex = pictures.findIndex((picture) => picture.isCover);
    if (coverIndex) {
      const cover = pictures[coverIndex];
      pictures.splice(coverIndex, 1);
      pictures.unshift(cover);
    }
    return pictures;
  }
}
