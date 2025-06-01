import {CategoryApi} from '../../category/model/category.model';

export namespace MovieApi {
  export interface Request {
    name: string;
    age: number;
    duration: number;
    imageLandscape: string;
    imagePortrait: string;
    slug: string;
    rate: number;
    totalVotes: number;
    views: number;
    description: string;
    sortOrder: number;
    actors: string;
    director: string;
    producers: string;
    country: string;
    trailer: string;
    status: number;
    startDate: string;       // ISO‐8601, ví dụ "2025-06-15T00:00:00Z"
    endDate: string;         // ISO‐8601, ví dụ "2025-12-31T00:00:00Z"
    categoryIds: string[];   // mảng UUID dưới dạng string
  }

  export interface Response {
    id: string;              // UUID dưới dạng string
    name: string;
    age: number;
    duration: number;
    imageLandscape: string;
    imagePortrait: string;
    slug: string;
    rate: number;
    totalVotes: number;
    views: number;
    description: string;
    sortOrder: number;
    actors: string;
    director: string;
    producers: string;
    country: string;
    categories: CategoryApi.Response[];   // danh sách category kèm id, name, slug, description
    createdAt: string;        // ISO‐8601, ví dụ "2025-06-01T08:30:00Z"
  }
}
