export function buildPrismaWhere(
  query: Record<string, any>,
  allowedFilters: string[]
): Record<string, any> {
  const where: Record<string, any> = {};

  for (const path of allowedFilters) {
    const rawValue = query[path];
    const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;

    if (!value) continue;

    const keys = path.split('.');
    let current = where;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (i === keys.length - 1) {
        if (isNumericField(key)) {
          const numericValue = parseInt(value);
          if (!isNaN(numericValue)) {
            current[key] = {
              equals: numericValue,
            };
          }
        } else {
          current[key] = {
            contains: value,
          };
        }
      } else {
        const isLikelyArray = isPlural(key); 

        if (!current[key]) {
          current[key] = isLikelyArray ? { some: {} } : {};
        }

        current = isLikelyArray ? current[key].some : current[key];
      }
    }
  }

  return where;
}

function isNumericField(fieldName: string): boolean {
  // Lista de campos que sabemos que son numéricos
  const numericFields = ['id', 'customer_id', 'user_id', 'order_id', 'quote_id', 'brand_cat_id', 'equipment_cat_id'];
  return numericFields.includes(fieldName) || fieldName.endsWith('_id');
}

function isPlural(word: string): boolean {
  const commonNonPluralWords = ['address', 'status'];
  return word.endsWith('s') && !commonNonPluralWords.includes(word);
}