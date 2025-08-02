package com.sybdev.movies.watchedmoviesapi.service;

import com.sybdev.movies.watchedmoviesapi.model.Movie;
import com.sybdev.movies.watchedmoviesapi.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Optional;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    @Value("${tmdb.api.key}")
    private String tmdbApiKey;

    private final String TMDB_BASE_URL = "https://api.themoviedb.org/3/search/movie";

    public Movie saveMovie(Movie movie) {
        TmdbMovieResponse.TmdbMovieResult movieData = fetchMovieDataFromTmdb(movie.getTitle());
        if (movieData != null) {
            movie.setTitle(movieData.getTitle());
            movie.setReleaseYear(Integer.parseInt(movieData.getRelease_date().substring(0, 4)));
            movie.setPosterPath(movieData.getPoster_path());
        }
        return movieRepository.save(movie);
    }

    public Iterable<Movie> findAllMovies() {
        return movieRepository.findAll();
    }

    public Optional<Movie> findMovieById(Long id) {
        return movieRepository.findById(id);
    }

    public boolean deleteMovie(Long id) {
        if (movieRepository.existsById(id)) {
            movieRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<Movie> updateMovie(Long id, Movie updatedMovie) {
        return movieRepository.findById(id)
                .map(existingMovie -> {
                    if (updatedMovie.getTitle() != null) {
                        existingMovie.setTitle(updatedMovie.getTitle());
                    }
                    if (updatedMovie.getReleaseYear() != 0) {
                        existingMovie.setReleaseYear(updatedMovie.getReleaseYear());
                    }
                    if (updatedMovie.getGenre() != null) {
                        existingMovie.setGenre(updatedMovie.getGenre());
                    }
                    if (updatedMovie.getPersonalRating() != 0) {
                        existingMovie.setPersonalRating(updatedMovie.getPersonalRating());
                    }
                    if (updatedMovie.getPosterPath() != null) {
                        existingMovie.setPosterPath(updatedMovie.getPosterPath());
                    }
                    return movieRepository.save(existingMovie);
                });
    }

    private TmdbMovieResponse.TmdbMovieResult fetchMovieDataFromTmdb(String title) {
        RestTemplate restTemplate = new RestTemplate();
        String sanitizedTitle = title.replace(" ", "%20");
        String url = String.format("%s?api_key=%s&query=%s", TMDB_BASE_URL, tmdbApiKey, sanitizedTitle);

        try {
            TmdbMovieResponse response = restTemplate.getForObject(url, TmdbMovieResponse.class);
            if (response != null && !response.getResults().isEmpty()) {
                return response.getResults().get(0);
            }
        } catch (Exception e) {
            System.err.println("Error fetching movie from TMDb: " + e.getMessage());
        }
        return null;
    }
}