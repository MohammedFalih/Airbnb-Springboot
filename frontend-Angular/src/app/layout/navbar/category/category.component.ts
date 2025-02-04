import { Component, inject, OnInit } from '@angular/core';
import { Category } from './category.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CategoryService } from './category.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent implements OnInit {
categoryService: CategoryService = inject(CategoryService);

  categories: Category[] | undefined;

  currentActivatedCategory: Category =
    this.categoryService.getCategoryByDefault();

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories() {
    this.categories = this.categoryService.getCategories();
  }
}
