import { h } from "preact";
import { useLocation } from "preact-iso";
import { useEffect, useState } from "preact/hooks";
import updateWindowQuery from "../../updateWindowQuery";
import { ApiMethod, ApiRoute, useApi } from "../Authentication/ApiProvider";
import { useAuth } from "../Authentication/AuthenticationProvider";
import SearchResult from "./SearchResult";

export default function PayoffSearch() {
  const [searchStringTimeout, setSearchStringTimeout] = useState<NodeJS.Timeout>();
  const [searchString, setSearchString] = useState("");
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResponse>();
  const [pageOffset, setPageOffset] = useState<number>(0);
  const api = useApi();
  const auth = useAuth();
  const location = useLocation();

  async function runSearch() {
    setSearching(true);
    const query = new URLSearchParams(window.location.search);
    const responseBody = await api.sendRequest<SearchResponse>({
      method: ApiMethod.get,
      route: "search",
      query,
      isPrivate: true
    });
    setSearchResults(responseBody);
    setSearching(false);
  }

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.has("start")) {
      const offset = Number(query.get("start") ?? "");
      setOffset(offset);
      if (offset >= 50) {
        setPageOffset(offset / limit - 5);
      }
    }

    if (query.has("search")) {
      setSearchString(query.get("search") ?? "");
      runSearch();
    }
  }, []);

  useEffect(() => {
    if (searchString === "") {
      setSearchResults(undefined);
      return;
    }
  }, [searchString]);

  function changePage(newOffset: number) {
    const query = new URLSearchParams(window.location.search);
    setOffset(newOffset);
    query.set("search", searchString);
    query.set("limit", searchString === "" ? "" : limit.toString());
    query.set("start", newOffset.toString());
    query.set("id", "");
    query.set("name", "");
    updateWindowQuery(query);
    runSearch();
  }

  function getPages() {
    if (!searchResults) {
      throw new Error("Attempt to get pages when no search results.");
    }

    const pages = Math.ceil(searchResults.count / limit);
    let output = [];
    if (pages <= 1) {
      return;
    }

    output.push(
      <button
        className="button"
        key={-2}
        onClick={() => {
          setPageOffset(0);
          changePage(0);
        }}
        disabled={offset === 0}
      >
        First
      </button>
    );

    output.push(
      <button
        className="button"
        key={-1}
        onClick={() => {
          if (offset - limit >= 0) {
            setPageOffset(Math.max(0, pageOffset - 1));
            changePage(offset - limit);
          }
        }}
        disabled={offset === 0}
      >
        Previous
      </button>
    );

    for (let i = pageOffset; i < pages && i < pageOffset + 5; i++) {
      output.push(
        <button
          className={`searchResultPageButton ${i * limit === offset ? "active" : ""
            }`}
          key={i}
          onClick={() => {
            changePage(i * limit);
          }}
        >
          {i + 1}
        </button>
      );
    }

    output.push(
      <button
        className="button"
        key={pageOffset + 6}
        onClick={() => {
          if (offset + limit < searchResults.count) {
            setPageOffset(Math.min(pages - 5, pageOffset + 1));
            changePage(offset + limit);
          }
        }}
        disabled={offset + limit >= searchResults.count}
      >
        Next
      </button>
    );

    output.push(
      <button
        className="button"
        key={pageOffset + 7}
        onClick={() => {
          setPageOffset(pages - 5 > 0 ? pages - 5 : 0);
          changePage((pages - 1) * limit);
        }}
        disabled={offset + limit >= searchResults.count}
      >
        Last
      </button>
    );

    return <div className="pageNumbers">{output}</div>;
  }

  return (
    <div>
      {auth.isAuthenticated && (
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <button class="button" onClick={() => location.route("/new")}>
            + New Vendor
          </button>
        </div>
      )}

      <div>
        <input
          class="searchBar"
          type="search"
          placeholder="Search for vendors..."
          defaultValue={searchString}
          onKeyUp={(event) => {
            if (searchStringTimeout) {
              clearTimeout(searchStringTimeout);
            }

            const search = event.currentTarget.value.trim();
            function startSearch() {
              const query = new URLSearchParams(window.location.search);
              query.set("search", search);
              query.set("limit", search === "" ? "" : limit.toString());
              query.set("start", search === "" ? "" : offset.toString());
              query.set("id", "");
              query.set("name", "");
              updateWindowQuery(query);
            }

            if (event.key === "Enter") {
              startSearch();
              return;
            }

            setSearchStringTimeout(setTimeout(startSearch, 1000));
          }}
        />
      </div>

      {searching && (
        <div class="boxedItem" style={{ textAlign: "center" }}>
          <div class="loader"></div>
          <p>Searching vendors...</p>
        </div>
      )}

      {searchResults && (
        <div class="searchResults">
          <div class="boxedItem" style={{ textAlign: "center" }}>
            Found {searchResults.count} results
          </div>

          {searchResults.results.map((result) => (
            <SearchResult key={result.document.id} vendor={result.document} />
          ))}

          {getPages()}

          <div class="boxedItem" style={{ textAlign: "center" }}>
            Showing {searchResults.results.length > 0 ? offset + 1 : 0} to{" "}
            {offset + limit > searchResults.count
              ? searchResults.count
              : offset + limit}{" "}
            of {searchResults.count}
          </div>
        </div>
      )}
    </div>
  );
}
