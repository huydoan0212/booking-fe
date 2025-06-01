export namespace CategoryApi {
  export interface Request {
    name: string;
    slug: string;
    description: string;
  }
  export interface Response {
    id: string;
    name: string;
    slug: string;
    description: string;
  }
}
