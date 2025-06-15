import {MovieApi} from '../../movie/model/movie.model';
import {CinemaHallApi} from '../../cinemaHall/model/cinemalHall.model';

export namespace ShowTimeApi {
  export interface Request {
    movieId: string;              // UUID
    cinemaHallId: string;         // UUID
    showTime: string;             // ISO 8601 date string (ví dụ: "2025-03-18T14:00:00+07:00")
    language: string;             // Ví dụ: "English"
    subtitle: string;             // Ví dụ: "Vietnamese"
    screenFormat: string;         // Ví dụ: "2D", "3D", "IMAX"
  }

  export interface Response {
    id: string;
    showTime: string;
    language: string;
    subtitle: string;
    screenFormat: string;
    // movie: MovieApi.Response;               // Reuse MovieApi.Response
    cinemaHall: CinemaHallApi.Response;     // Reuse CinemaHallApi.Response
    createdAt: string;
  }
}
