import { Request, Response, NextFunction } from 'express';

/**
 * Recursively cleans form data:
 * - Trims strings
 * - Converts 'true', 'false', 'yes', 'no' → booleans
 * - Converts numeric strings → numbers
 * - Removes extra spaces
 */
export function cleanFormDataSpace(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const clean = (data: unknown): unknown => {
    if (Array.isArray(data)) {
      return data.map(item => clean(item));
    } else if (typeof data === 'object' && data !== null) {
      const cleaned: Record<string, unknown> = {};
      for (const key in data as Record<string, unknown>) {
        cleaned[key.trim()] = clean((data as Record<string, unknown>)[key]);
      }
      return cleaned;
    } else if (typeof data === 'string') {
      const trimmed = data.trim();

      // Convert to boolean
      // const lower = trimmed.toLowerCase();
      // if (['true', 'false', 'yes', 'no'].includes(lower)) {
      //   return lower === 'true' || lower === 'yes';
      // }

      // Convert to number (if valid)
      // if (
      //   !isNaN(Number(trimmed)) &&
      //   trimmed !== '' &&
      //   !trimmed.includes('-') &&
      //   !trimmed.includes('/')
      // ) {
      //   return Number(trimmed);
      // }

      return trimmed; // fallback to plain trimmed string
    }

    return data;
  };

  if (req.body) {
    req.body = clean(req.body) as Record<string, unknown>;
  }

  next();
}
