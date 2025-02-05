import { useState, useEffect } from "react";
import Search from "./components/search";
import Spinner from "./components/spinner";
import MovieCard from "./components/movieCard";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;

  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error fetching movies.");

      const data = await response.json();
      if (!data.results) {
        setErrorMessage("No movies found.");
        setMovies([]);
        return;
      }

      setMovies(data.results);
    } catch (error) {
      console.error(`Error fetching movies: ${error.message}`);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="hero banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without The Hastles
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>
          {isLoading ? (
            <p className="text-white">
              <Spinner />
            </p>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movies.map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
