import React, { useState, useEffect } from "react";
import "./App.css";
import MovieList from "./components/MovieList/MovieList";
import AddMovieForm from "./components/AddMovieForm/AddMovieForm";

function App() {
  const [movies, setMovies] = useState([]);

  const fetchMovies = async () => {
    try {
      const response = await fetch("/api/movies");
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="App">
      <AddMovieForm onMovieAdded={fetchMovies} />
      <MovieList movies={movies} fetchMovies={fetchMovies} />
    </div>
  );
}

export default App;
