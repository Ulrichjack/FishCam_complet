export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  code: number;
  timestamp: string;
  fieldErrors?: any;
}

export interface PageResponse<T> {
  content: T[];
  totalElements?: number;
  totalPages?: number;
  number?: number;          // page index (0-based)
  size?: number;
  first?: boolean;
  last?: boolean;
  numberOfElements?: number;
  empty?: boolean;
   page?: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}
