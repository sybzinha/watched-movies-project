import React from "react";
import { Pencil, Trash2, Star } from "lucide-react";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

const MovieCardDisplay = ({ movie, onEdit, onDelete }) => {
  return (
    <>
      {movie.posterPath && (
        <img
          src={`${TMDB_IMAGE_BASE_URL}${movie.posterPath}`}
          alt={`${movie.title} Poster`}
          className="movie-poster"
        />
      )}
      <div className="movie-info">
        <h3>
          {movie.title} ({movie.releaseYear})
        </h3>
        <p className="movie-rating-container">
          <span>Nota: {movie.personalRating}</span>
          <Star size={17} className="star-icon" />
        </p>
        <p>Gênero: {movie.genre || "N/A"}</p>
        <p className="movie-overview">{movie.overview}</p>
      </div>
      <div className="card-actions">
        <button
          onClick={() => onEdit(movie)}
          className="icon-button edit-button"
          aria-label="Alterar nota"
        >
          <Pencil size={20} />
          <span className="button-text">Editar</span>
        </button>
        <button
          onClick={() => onDelete(movie.id)}
          className="icon-button delete-button"
          aria-label="Excluir filme"
        >
          <Trash2 size={20} />
          <span className="button-text">Excluir</span>
        </button>
      </div>
    </>
  );
};

export default MovieCardDisplay;
