import React, { useState, useEffect } from "react";
import "./MovieList.css";
import MovieCardDisplay from "./MovieCardDisplay";
import MovieCardEdit from "./MovieCardEdit";

const MESSAGE_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
};

function MovieList({ movies, fetchMovies }) {
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (message) {
      setIsFadingOut(false);

      const fadeOutTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 2000);

      const removeTimer = setTimeout(() => {
        setMessage(null);
        setIsFadingOut(false);
      }, 2500);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [message]);

  const handleDelete = async (id) => {
    setMessage(null);
    try {
      const response = await fetch(`/api/movies/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchMovies();
        setMessage({
          text: "Filme excluído com sucesso!",
          type: MESSAGE_TYPES.SUCCESS,
        });
      } else {
        setMessage({
          text: "Falha ao excluir o filme. Por favor, tente novamente.",
          type: MESSAGE_TYPES.ERROR,
        });
      }
    } catch (error) {
      setMessage({
        text: "Erro de rede. Verifique sua conexão e tente novamente.",
        type: MESSAGE_TYPES.ERROR,
      });
      console.error("Error deleting movie:", error);
    }
  };

  const handleSave = async (id, newRating) => {
    setMessage(null);
    const updatedData = { personalRating: newRating };
    try {
      const response = await fetch(`/api/movies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        setEditingMovieId(null);
        fetchMovies();
        setMessage({
          text: "Nota do filme atualizada com sucesso!",
          type: MESSAGE_TYPES.SUCCESS,
        });
      } else {
        setMessage({
          text: "Falha ao atualizar a nota. Por favor, tente novamente.",
          type: MESSAGE_TYPES.ERROR,
        });
      }
    } catch (error) {
      setMessage({
        text: "Erro de rede. Verifique sua conexão e tente novamente.",
        type: MESSAGE_TYPES.ERROR,
      });
      console.error("Error updating movie:", error);
    }
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="movie-list-container">
      <h2>Filmes que já assisti ↓</h2>
      {message && (
        <div
          className={`${
            message.type === MESSAGE_TYPES.ERROR
              ? "error-message"
              : "success-message"
          } ${isFadingOut ? "fade-out" : ""}`}
        >
          {message.text}
        </div>
      )}
      <input
        type="text"
        placeholder="Buscar filmes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      {filteredMovies.length > 0 ? (
        <div className="movies-grid">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="movie-card-glass">
              {editingMovieId === movie.id ? (
                <MovieCardEdit
                  movie={movie}
                  onSave={handleSave}
                  onCancel={() => setEditingMovieId(null)}
                />
              ) : (
                <MovieCardDisplay
                  movie={movie}
                  onEdit={(movieToEdit) => setEditingMovieId(movieToEdit.id)}
                  onDelete={handleDelete}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>Nenhum filme encontrado.</p>
      )}
    </div>
  );
}

export default MovieList;
