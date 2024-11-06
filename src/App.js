import { useEffect, useState } from "react";
import StarRating from "./components/StarRating";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const key = "5e917423";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [query, setQuery] = useState("Titanic");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectedId(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleWatchList(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handleDeleteWatchList(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }
  useEffect(
    function () {
      async function getMovies() {
        try {
          setLoading(true);
          setIsError("");
          const res = await fetch(
            `http://www.omdbapi.com/?i=tt3896198&apikey=${key}&s=${query}`
          );
          if (!res.ok) {
            throw new Error("Something Went Wrong!!");
          }
          const data = await res.json();
          //  console.log("data", data);
          if (data.Response === "False") throw new Error("Movie Not Found!");
          setMovies(data.Search);
        } catch (err) {
          console.error(err.message);
          setIsError(err.message);
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
    },
    [query]
  );
  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>
      <main className="main">
        <Box>
          {isLoading && <Loading />}
          {!isLoading && !isError && (
            <MovieList movies={movies} onSelectedMovie={handleSelectedId} />
          )}
          {isError && <ErrorMessage message={isError} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieSelected
              selectedMovie={selectedId}
              onCloseMovie={handleCloseMovie}
              handleWatchList={handleWatchList}
              watched={watched}
            />
          ) : (
            <>
              <WatchMovieSummary watched={watched} />
              <WatchMovieList
                watched={watched}
                onDeleteMovieList={handleDeleteWatchList}
              />
            </>
          )}
        </Box>
      </main>
    </>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="error">
      <span>🚫</span>
      {message}
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies ? movies.length : 0}</strong> results
    </p>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

// function Main({ movies }) {
//   const [watched, setWatched] = useState(tempWatchedData);
//   return (

//   );
// }

function Loading() {
  return "Loading....";
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
// function WatchBox() {
//   const [isOpen2, setIsOpen2] = useState(true);
//   const [watched, setWatched] = useState(tempWatchedData);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchMovieSummary watched={watched} />
//           <WatchMovieList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }

function MovieList({ movies, onSelectedMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          onSelectedMovie={onSelectedMovie}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectedMovie }) {
  return (
    <li onClick={() => onSelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchMovieSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchMovieList({ watched, onDeleteMovieList }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteMovieList={onDeleteMovieList}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteMovieList }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteMovieList(movie.imdbID)}
        ></button>
      </div>
    </li>
  );
}

function MovieSelected({
  selectedMovie,
  onCloseMovie,
  handleWatchList,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [loading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const alreadyWatched = watched
    .map((movie) => movie.imdbID)
    .includes(selectedMovie);

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedMovie
  )?.userRating;

  useEffect(
    function () {
      async function getMoviebyID() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&i=${selectedMovie}`
        );
        const data = await res.json();
        setMovie(data);
        // console.log(data);
        setIsLoading(false);
      }
      getMoviebyID();
    },
    [selectedMovie]
  );

  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  useEffect(
    function () {
      document.title = `Movie | ${title}`;
      //cleanup function
      return function () {
        document.title = `usePopcorn`;
      };
    },
    [title]
  );
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedMovie,
      title,
      poster,
      imdbRating,
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    handleWatchList(newWatchedMovie);
    onCloseMovie();
  }
  return (
    <div className="details">
      {loading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDB Rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!alreadyWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={25}
                    onGettingTotalStars={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to Watchlist
                    </button>
                  )}
                </>
              ) : (
                <p>Already Rated {watchedUserRating} ⭐️</p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed By {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
