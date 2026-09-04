import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  SupermarketReview,
  SupermarketReviewStats,
} from '../../models/supermarket.models';

@Component({
  selector: 'app-reviews-sheet',
  standalone: false,
  templateUrl: './reviews-sheet.html',
  styleUrl: './reviews-sheet.css',
})
export class ReviewsSheetComponent {
  @Input() open = false;
  @Input() title = 'Customer reviews';
  @Input() reviews: SupermarketReview[] = [];
  @Input() stats: SupermarketReviewStats = {
    averageRating: 0,
    reviewCount: 0,
  };

  @Output() closeSheet = new EventEmitter<void>();

  close(): void {
    this.closeSheet.emit();
  }

  stopClose(event: MouseEvent): void {
    event.stopPropagation();
  }
}