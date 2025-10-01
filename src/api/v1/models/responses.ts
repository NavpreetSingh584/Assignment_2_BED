/**  Generic success response model */
export interface ApiSuccess<T> {
    success: true;
    message: string;
    data: T;
  }
  
  /**  Generic error response model */
  export interface ApiError {
    success: false;
    message: string;
    errors?: Array<{ path?: string; message: string; type?: string }>;
  }
  
  /** Generic list response model  */
  export interface ApiList<T> {
    success: true;
    message: string;
    data: T[];
    total?: number;   
  }
  