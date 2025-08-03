import React, { useState } from "react";
import { Save, X } from "lucide-react";

const MovieCardEdit = ({ movie, onSave, onCancel }) => {
  const [editedRating, setEditedRating] = useState(movie.personalRating);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    onSave(movie.id, parseInt(editedRating, 10));
  };

  return (
    <form className="edit-form-container" onSubmit={handleFormSubmit}>
      <h3>{movie.title}</h3>
      <input
        type="number"
        value={editedRating}
        onChange={(e) => setEditedRating(e.target.value)}
        className="edit-input"
        min="1"
        max="5"
        required
      />
      <div className="card-actions">
        <button
          type="submit"
          className="icon-button save-button"
          aria-label="Salvar nota"
        >
          <Save size={20} />
          <span className="button-text">Salvar</span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="icon-button cancel-button"
          aria-label="Cancelar edição"
        >
          <X size={20} />
          <span className="button-text">Cancelar</span>
        </button>
      </div>
    </form>
  );
};

export default MovieCardEdit;
