import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { fetchMovies, addFav, addDetails } from "./app/slice/movieSlice";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDetails, setIsDetails] = useState(false);
  const dispatch = useDispatch();

  const {
    movies,
    favorites,
    movieDetails: detailsMovie,
    isLoading,
    error,
  } = useSelector((state) => state.movies);

  // Fetch movies when search query changes
  useEffect(() => {
    if (searchQuery.length >= 3) {
      const delayDebounce = setTimeout(() => {
        dispatch(fetchMovies(searchQuery));
      }, 500); // Debounce to limit API calls
      return () => clearTimeout(delayDebounce);
    } else {
      dispatch(fetchMovies()); // Fetch default movies
    }
  }, [searchQuery, dispatch]);

  const handleToggleFavorite = (movie) => {
    dispatch(addFav(movie));
  };

  const handleDetails = (movie) => {
    dispatch(addDetails(movie));
    setIsDetails(true);
  };

  const isFavorite = (movie) => favorites.some((fav) => fav.id === movie.id);

  // Recommendations based on favorite movie genres
  const getRecommendations = () => {
    if (!favorites.length) return [];
    console.log(favorites)
    const favoriteGenres = favorites.flatMap((fav) => fav.genre_ids);
    return movies.filter((movie) =>
      movie.genre_ids.some((genre) => favoriteGenres.includes(genre))
    );
  };

  return (
    <>
      <header>
        <h1>Movie Recommendation App</h1>
      </header>
      <section>
        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for a movie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Loading and Error */}
        {isLoading && <p>Loading movies...</p>}
        {error && <p>Error fetching movies: {error}</p>}

        {/* Movies List */}
        <div className="movies-container">
          <h2>Movies</h2>
          <ul>
            {movies.map((movie) => (
              <li key={movie.id}>
                <span>{movie.title}</span>
                <button onClick={() => handleToggleFavorite(movie)}>
                  {isFavorite(movie)
                    ? "Remove from Favorites"
                    : "Add to Favorites"}
                </button>
                <button onClick={() => handleDetails(movie)}>See Details</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Favorites List */}
        <div className="favorites-container">
          <h2>Favorites</h2>
          <ul>
            {favorites.length ? (
              favorites.map((movie) => (
                <li key={movie.id}>
                  <span>{movie.title}</span>
                </li>
              ))
            ) : (
              <p>No favorite movies yet.</p>
            )}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="recommendations-container">
          <h2>Recommendations</h2>
          <ul>
            {getRecommendations().length ? (
              getRecommendations().map((movie) => (
                <li key={movie.id}>
                  <span>{movie.title}</span>
                </li>
              ))
            ) : (
              <p>No recommendations available based on favorites.</p>
            )}
          </ul>
        </div>

        {/* Movie Details */}
        {isDetails && detailsMovie && (
          <div className="details-container">
            <h2>Details</h2>
            <h2>{`Title: ${detailsMovie.title}`}</h2>
            <p>{`Description: ${detailsMovie.overview}`}</p>
            <p>{`Language: ${detailsMovie.original_language}`}</p>
            <p>{`Popularity: ${detailsMovie.popularity}`}</p>
            <p>{`Release Date: ${detailsMovie.release_date}`}</p>
          </div>
        )}
      </section>
    </>
  );
};

export default App;
