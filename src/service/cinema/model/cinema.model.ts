export namespace CinemaApi {
  export interface Request {
    name: string;
    slug: string;
    latitude: number;
    longitude: number;
    address: string;
    phone: string;
    imageLandscape: string;
    imagePortrait: string;
    imgUrls: string[];
    sortOrder: number;
  }

  export interface Response {
    id: number;
    name: string;
    slug: string;
    latitude: number;
    longitude: number;
    address: string;
    phone: string;
    imageLandscape: string;
    imagePortrait: string;
    imgUrls: string[];
    sortOrder: number;
    createdAt: string;
  }
}
