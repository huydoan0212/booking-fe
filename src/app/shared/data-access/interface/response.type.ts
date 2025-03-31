export interface ResponseResult<T> {
  message: string;
  responseData: T | null;
  success: boolean;
  status: number | null;
  violations: T | null;
  path: string;
  timestamp: number;
}
export interface Rows<T> {
  rows: T[];
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
