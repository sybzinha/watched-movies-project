import React, { useState, useEffect } from "react";
import "./AddMovieForm.css";

const MESSAGE_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
};

function AddMovieForm({ onMovieAdded }) {
  const [title, setTitle] = useState("");
  const [personalRating, setPersonalRating] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage(null);

    const movieData = {
      title,
      personalRating: parseInt(personalRating, 10),
    };

    try {
      const response = await fetch("/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movieData),
      });

      if (response.ok) {
        setTitle("");
        setPersonalRating("");
        onMovieAdded();
        setMessage({
          text: "Filme adicionado com sucesso!",
          type: MESSAGE_TYPES.SUCCESS,
        });
      } else {
        setMessage({
          text: "Falha ao adicionar o filme. Por favor, tente novamente.",
          type: MESSAGE_TYPES.ERROR,
        });
      }
    } catch (error) {
      setMessage({
        text: "Erro de rede. Verifique sua conexão e tente novamente.",
        type: MESSAGE_TYPES.ERROR,
      });
      console.error("Error adding movie:", error);
    }
  };

  return (
    <div className="form-container-glass">
      <h3>Adicione um novo filme</h3>
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
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título do filme"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Avaliação pessoal (1 - 5 &#9734;)"
          value={personalRating}
          onChange={(e) => setPersonalRating(e.target.value)}
          min="1"
          max="5"
          required
        />
        <button type="submit">Adicionar Filme</button>
      </form>
    </div>
  );
}

export default AddMovieForm;
