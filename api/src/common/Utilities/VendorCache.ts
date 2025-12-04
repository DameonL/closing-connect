namespace VendorCache {
  const cacheClearToken = process.env.CLOUDFLARE_CACHE_PURGE_KEY;

  export async function purge(vendorId: string) {
    return await fetch(
      "https://api.cloudflare.com/client/v4/zones/c40e1c0ee80f88b6051a76c8942e48fe/purge_cache",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cacheClearToken}`,
        },
        body: JSON.stringify({
          prefixes: [
            `api.closing-connect.com/openVendor?id=${vendorId}`,
            `api.closing-connect.com/openVendor?limit=10&search=`,
            `api.closing-connect.com/vendor?id=${vendorId}`,
          ],
        }),
      }
    )
  }
}

export default VendorCache;