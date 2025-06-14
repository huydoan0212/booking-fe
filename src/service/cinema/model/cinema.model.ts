import {CinemaHallApi} from '../../cinemaHall/model/cinemalHall.model';

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
    id: string;
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
    cinemaHalls: CinemaHallApi.Response[];
    createdAt: string;
  }
}
