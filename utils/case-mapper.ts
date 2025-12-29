const toCamelCase = (str: string) => {
  return str[0].toLowerCase() + str.slice(1);
}

export function keysToCamelCase<T>(data: any): T {
  if(Array.isArray(data)) {
    return data.map(item => keysToCamelCase(item)) as T;
  }

  if(data !== null && typeof data === 'object' && !(data instanceof Date)) {
    return Object.entries(data).reduce((acc, [key, value]) => {
      acc[toCamelCase(key)] = keysToCamelCase(value);
      return acc;
    }, {} as any);
  }

  return data;
}