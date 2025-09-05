export default function updateWindowQuery(query: URLSearchParams) {
    const keysToRemove: string[] = [];
    let queryKeys = 0;
    for (const element of query.keys()) {
        if (query.get(element) === "") {
            keysToRemove.push(element);
        } else {
            queryKeys++;
        }
    }

    for (const element of keysToRemove) {
        query.delete(element);
    }

    window.location.search = queryKeys === 0 ? "" : query.toString();
}

