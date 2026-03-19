import { Model, FilterQuery } from 'mongoose';

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Generic pagination utility
 * @param model - Mongoose model to query
 * @param filter - Mongoose filter object
 * @param page - current page number (1-based)
 * @param limit - number of documents per page
 * @param sort - optional sorting object
 */

export const paginateQuery = async <T>(
  model: Model<T>,
  filter: FilterQuery<T>,
  page: number,
  limit: number,
  projection = '',
  sort: Record<string, 1 | -1> = { createdAt: -1 }
): Promise<PaginatedResponse<T>> => {
  const skip = (page - 1) * limit;

  const [total, data] = await Promise.all([
    model.countDocuments(filter).select(projection),
    model.find(filter).skip(skip).limit(limit).sort(sort),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};
