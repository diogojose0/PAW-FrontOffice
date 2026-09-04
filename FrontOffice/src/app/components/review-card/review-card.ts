import { Component, Input } from '@angular/core';

import { SupermarketReview } from '../../models/supermarket.models';

@Component({
  selector: 'app-review-card',
  standalone: false,
  templateUrl: './review-card.html',
  styleUrl: './review-card.css',
})
export class ReviewCardComponent {
  @Input() review!: SupermarketReview;
  @Input() compact = false;

  getReviewerName(): string {
    if (typeof this.review.clientUserId === 'string') {
      return 'Client';
    }

    return this.review.clientUserId.name || 'Client';
  }

  getStarText(): string {
    return '★'.repeat(this.review.supermarketRating) + '☆'.repeat(5 - this.review.supermarketRating);
  }
}