declare type CosmosItem<T> = T & {
  _rid: string;
  _self: string;
  _etag: string;
  _attachments: string;
  _ts: string;
}