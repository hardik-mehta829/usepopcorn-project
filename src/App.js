import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const key = "a3aa372c";
export default function App() {
  // Structural component only used for layout of the application.
  const [movies, setMovies] = useState([]);
  const [isloading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const [query, setQuery] = useState("");
  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useState(function () {
    //This function only executed on initial render not on subsequent rerenders.Only pass in a function that react can then call later.
    const stored = localStorage.getItem("watched");
    return JSON.parse(stored);
  });

  //The setloading is executed once and the batch is completed and isloading set to true and rendered but when await fetch returns a promise it is re-rendered and the batch is emptied and recreated.
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((mov) => mov.imdbId !== id)); //To delete a movie from watched list.
  }
  useEffect(
    function () {
      const controller = new AbortController(); //A browser api to stop the race condition when multiple movie requests hit the server.We want the data from last request  as our state.The current request is canceled if a new request is made
      async function fetchmovies() {
        try {
          setloading(true);
          seterror("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&s=${query}`, // as soon as a request is canceled Javascript sees it as an error.as the fetch request is canceled it will throw an error
            { signal: controller.signal }
          );

          if (!res.ok) throw new Error("Something went wrong");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
          seterror("");
          // console.log(data.Search);
        } catch (err) {
          if (err.name !== "AbortError") {
            seterror(err.message);
          }
        } finally {
          setloading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        seterror("");
        return; //When the application starts the user has not searched a movie so do not want to show movie not found error.
      }
      setSelectedId(null);
      fetchmovies();
      return function () {
        controller.abort(); //cancels the current request each time a new one comes in.
      };
    },
    [query]
  );
  // useEffect(function () {
  //   console.log("Every render");
  // });
  // useEffect(function () {
  //   console.log("Initial render");
  // }, []);
  // useEffect(
  //   function () {
  //     console.log("Query render");
  //   },
  //   [query]
  // );
  // console.log("Render");
  // .then((d) => setMovies(d.Search)); // Side effect in render logic.not allowed
  //Setting the state in render logic will immediately cause the component to re-render itself again which will fire infinite number of requests.when component is re-rendered function is executed again fetch is called again and the state is set again and it starts over and over again.
  function handleAddWatched(movie) {
    setWatched((w) => [...w, movie]);
  }
  useEffect(
    function () {
      //local storage to store the list of watched movies so that each time we reload the watched movies persist.
      localStorage.setItem("watched", JSON.stringify(watched)); //local storage is simply a key-value pair storage that is available in browser and where we can store some data for each domain.
      //value should be string.
    },
    [watched]
  );
  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>
      <MainComp>
        {/* Box is reusable component  */}
        {/* We can also pass component as an element prop  instead of using children prop*/}
        {/* <Box element={<MovieList movies={movies} />} />
        <Box
          element={
            <>
              <WatchedSummary watched={watched} />
              <WatchedList watched={watched} />
            </>
          }
        /> */}
        <Box>
          {error && <ErrorLoad message={error} />}
          {isloading && <Loader />}
          {!isloading && !error && (
            <MovieList movies={movies} setSelectedId={setSelectedId} />
          )}

          {/* {isloading ? <Loader /> : <MovieList movies={movies} />} */}
        </Box>
        <Box>
          {selectedId ? ( //Displaying component based on selecetedId
            <MoveDetails
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              watched={watched}
              handleAddWatched={handleAddWatched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                watched={watched}
                handleDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </MainComp>
    </>
  );
}
function Loader() {
  return <p className="loader">Loading ...</p>;
}
function ErrorLoad({ message }) {
  return <p className="error">{message}</p>;
}
function Navbar({ children }) {
  // Structural component only used for layout of the application.
  // It becomes easy  if we divide the componenets into small componenets  like now we can easily observe that navbar contains Logo Search and NumResults
  return <nav className="nav-bar">{children}</nav>;
}
function Logo() {
  //stateless component
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function NumResults({ movies }) {
  //stateless component
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
function Search({ query, setQuery }) {
  //stateful component
  const inputEl = useRef(null);
  //The current property stores the data that should be stored in ref.
  //We can use useeffect hook to use ref that contains DOM elements.the ref only gets added to this DOM element here after the DOM has already loaded and so therefore we can only access it in an effect which also runs after DOM has been loaded.
  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === inputEl.current) return; //So that the text does not get deleted when input field is already focused.
        if (e.code === "Enter") {
          inputEl.current.focus();
          setQuery("");
        }
      }
      document.addEventListener("keydown", callback);
      return () => document.addEventListener("keydown", callback);
    },
    [setQuery]
  ); //setquery is a prop so it needs to be declared in the dependency array.This function is not going to change but still we need it in the dependency array.
  // useEffect(function () {
  //   const el = document.querySelector(".search");
  //   el.focus(); //when the application is loaded ,then  input field got focused.
  // }, []);
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
function MoveDetails({ selectedId, setSelectedId, handleAddWatched, watched }) {
  const [moviedetail, setMoviedetail] = useState({});
  const [isloading, setIsloading] = useState(false);
  const [AddWatchedmovie, setAddWatchedmovie] = useState();
  const [userRating, setuserRating] = useState(0);
  const iswatched = watched.map((mov) => mov.imdbId).includes(selectedId); //To check which movie i have rated so that i do not add it multiple times
  const countvar = useRef(0); //It persists across renders and does not triggers a re-render when updated.
  useEffect(
    function () {
      if (userRating) countvar.current = countvar.current + 1;
    },
    [userRating]
  );
  const watcheduserRating = watched.find(
    (m) => m.imdbId === selectedId
  )?.userRating;
  function onclosemovie() {
    setSelectedId(null);
  }

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onclosemovie();
          console.log("Closing"); //each time effect is executed  it will add one more event listener to the document.
        }
      }
      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onclosemovie]
  );

  useEffect(
    function () {
      async function getMovieData() {
        setIsloading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
        );
        const data = await res.json();
        setMoviedetail(data);
        setIsloading(false);
      }
      getMovieData();
    },
    [selectedId] //We want to re-render this effect each time selectedid is changed
  );

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = moviedetail;
  // if (imdbRating > 8) [top, setIstop] = useState("");Not allowed
  // const [top, setIstop] = useState(imdbRating > 8); //useState hook sets the state only at initial render when imdbrating is undefined(Only when the component mounts) . when data is fetched from API useState will not be called again.
  // console.log(top);
  // useEffect(
  //   function () {
  //     setIstop(imdbRating > 8);
  //   },
  //   [imdbRating]
  // );
  const top = imdbRating > 8; //This variable is regenerated each time the function is executed.(derived state)
  // const [avgrating, setAvg] = useState(0);
  function handleAdd() {
    const newWatchedMovie = {
      imdbId: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecision: countvar.current,
    };
    handleAddWatched(newWatchedMovie);
    setSelectedId(null);
    // setAvg(Number(imdbRating));
    // setAvg((avgrating) => (avgrating + userRating) / 2); //Updating state is asynchronous. updated state is not set immediately .Once react executes the event handler and then the states are updated.To get access to updated state we need to use callback function
  }
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;
      return function () {
        document.title = "usepopcorn";
        console.log(`Cleanup function for ${title}`);
      }; //function executed when component is unmounted.But it remembers the title because of closure effect in javascript which states that function will remember all the variables that were present at the time and the place that the function was created.cleanup function was created by the time this effect was first created.It runs after each re-render.
      // with empty dependency array title gives undefined because movie data fetched from api takes time till then moviedetail state is undefined.
    },
    [title]
  );
  return (
    <p className="details">
      {isloading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={() => setSelectedId(null)}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMdb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {/* <p>{avgrating}</p> */}
              {!iswatched ? (
                <>
                  <StarRating setuserRating={setuserRating} />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add To List
                    </button>
                  )}
                </>
              ) : (
                <p>You rated this movie {watcheduserRating}</p> //Calculated the userrating for watched movie.
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </p>
  );
}
function MainComp({ children }) {
  return <main className="main">{children}</main>;
}
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  //stateful component
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "-" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
function MovieList({ movies, setSelectedId }) {
  //stateful component.List of all movies which appeared from search.
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} setSelectedId={setSelectedId} />
      ))}
    </ul>
  );
}
function Movie({ movie, setSelectedId }) {
  //Presentational component.Selecting the clicked movie.
  return (
    <li
      onClick={() =>
        setSelectedId((s) => (s === movie.imdbID ? null : movie.imdbID))
      }
    >
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
// function WatchedBox() {

//   const [isOpen2, setIsOpen2] = useState(true);
//   //stateful component
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
//           <WatchedSummary watched={watched} />
//           <WatchedList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }
function WatchedSummary({ watched }) {
  //Presentational component
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
function WatchedList({ watched, handleDeleteWatched }) {
  //Presentational component.List of all watched movies
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
         key={movie.imdbID}
          movie={movie}
         
          handleDeleteWatched={handleDeleteWatched}
        />
      ))}
    </ul>
  );
}
function WatchedMovie({ movie, handleDeleteWatched }) {
  //Presentational component.Individual component of watched movie.
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
          onClick={() => handleDeleteWatched(movie.imdbId)}
        >
          X
        </button>
      </div>
    </li>
  );
}
