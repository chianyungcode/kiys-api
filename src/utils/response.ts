interface Pagination {
  totalData: number;
  totalPages: number;
  page: number;
  limit: number;
}

interface SuccessResponse<T> {
  data: T;
  message: string;
  pagination?: Pagination;
}

interface ErrorResponse {
  errors: any;
  message: string;
}

export const successResponse = <T>({
  data,
  pagination,
  message,
}: SuccessResponse<T>) => {
  return {
    success: true,
    message,
    data,
    pagination,
  };
};

export const errorResponse = ({ errors, message }: ErrorResponse) => {
  return {
    errors,
    success: false,
    message,
  };
};
