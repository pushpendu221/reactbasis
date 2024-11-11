import { useEffect, useState } from "react";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");

  const key = "5e917423";
  useEffect(
    function () {
      const controller = new AbortController();
      async function getMovies() {
        try {
          setLoading(true);
          setIsError("");
          const res = await fetch(
            `http://www.omdbapi.com/?i=tt3896198&apikey=${key}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok) {
            throw new Error("Something Went Wrong!!");
          }
          const data = await res.json();
          console.log("data", data);
          if (data.Response === "False") throw new Error("Movie Not Found!");
          setMovies(data.Search);
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.name);
            setIsError(err.message);
          }
        } finally {
          setLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setIsError("");
        return;
      }
      getMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, isError };
}
