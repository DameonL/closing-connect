declare interface SearchResponse {
  search: string;
  results: { score: number; document: { id: string, name: string } }[];
  count: number;
  limit: number;
  start: number;
}