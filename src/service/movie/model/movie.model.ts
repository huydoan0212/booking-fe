export interface Movie {
  id: string;
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
  startDate: string;
  endDate: string;
  categories: any[];
  createdAt: string;
}

export interface MovieResponse {
  message: string;
  responseData: Movie[];
  success: boolean;
  status: number;
  violations: any;
  path: string;
  timestamp: string;
}
