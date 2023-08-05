import React, { useCallback, useRef } from "react";
import { useState } from "react";
import "./App.css";
import useBookSearch from "./useBookSearch";
function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const { loading, error, books, hasMore } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastBookRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  function changePage(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  return (
    <div className="App">
      <header className="header">
        <h2>Infinite Scroll</h2>
      </header>
      <section className="container">
        <input type="search" value={query} onChange={changePage}></input>
        {books.map((book, index) => {
          if (books.length === index + 1) {
            return (
              <div ref={lastBookRef} key={book}>
                {book}
              </div>
            );
          } else {
            return <div key={book}>{book}</div>;
          }
        })}

        <div style={{ color: "#858859", fontWeight: "600" }}>
          {loading && "Loading..."}
        </div>
        <div>{error && "Error..."}</div>
      </section>
    </div>
  );
}

export default App;
