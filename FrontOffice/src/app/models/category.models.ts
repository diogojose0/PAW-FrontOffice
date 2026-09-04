export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  active?: boolean;
}

export interface CategoriesResponse {
  count: number;
  categories: Category[];
}