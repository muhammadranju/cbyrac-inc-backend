// src/utils/convertToNestedObject.ts

export function convertToNestedObject<T extends Record<string, any>>(
  obj: T
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const keys = key.split('.');
    let current = result;

    keys.forEach((k, index) => {
      if (index === keys.length - 1) {
        current[k] = value;
      } else {
        current[k] = current[k] || {};
        current = current[k];
      }
    });
  }

  return result;
}

export function convertToNestedObjectOfTemp<T extends Record<string, any>>(
  obj: T
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [flatKey, value] of Object.entries(obj)) {
    // Split by dots and brackets: supports both 'a.b.c' and 'arr[0].key'
    const keyParts = flatKey.replace(/\]/g, '').split(/\.|\[/).filter(Boolean);

    let current: any = result;

    keyParts.forEach((part, index) => {
      const isLast = index === keyParts.length - 1;
      const arrayIndex = Number(part);
      const isArrayIndex = !isNaN(arrayIndex);

      if (isLast) {
        if (isArrayIndex) {
          if (!Array.isArray(current)) current = [];
          current[arrayIndex] = value;
        } else {
          current[part] = value;
        }
      } else {
        const nextPart = keyParts[index + 1];
        const nextArrayIndex = Number(nextPart);
        const nextIsArray = !isNaN(nextArrayIndex);

        if (isArrayIndex) {
          if (!Array.isArray(current)) current = [];
          current[arrayIndex] = current[arrayIndex] || (nextIsArray ? [] : {});
          current = current[arrayIndex];
        } else {
          current[part] = current[part] || (nextIsArray ? [] : {});
          current = current[part];
        }
      }
    });
  }

  return result;
}
