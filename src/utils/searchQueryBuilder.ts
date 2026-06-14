export function buildGoogleAIModeSearchUrl(query: string): string {
  return `https://www.google.com/search?udm=50&q=${encodeURIComponent(query)}`;
}

export function buildGoogleImageSearchUrl(query: string): string {
  return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
}
