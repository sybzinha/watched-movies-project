package com.sybdev.movies.watchedmoviesapi.service;

import com.sybdev.movies.watchedmoviesapi.model.Movie;
import com.sybdev.movies.watchedmoviesapi.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    @Value("${tmdb.api.key}")
    private String tmdbApiKey;

    private final String TMDB_MOVIE_SEARCH_URL = "https://api.themoviedb.org/3/search/movie";
    private final String TMDB_GENRES_URL = "https://api.themoviedb.org/3/genre/movie/list";

    private List<GenreResponse.Genre> genreCache;

    public Movie saveMovie(Movie movie) {
        TmdbMovieResponse.TmdbMovieResult movieData = fetchMovieDataFromTmdb(movie.getTitle());
        if (movieData != null) {
            movie.setTitle(movieData.getTitle());
            movie.setReleaseYear(Integer.parseInt(movieData.getRelease_date().substring(0, 4)));
            movie.setPosterPath(movieData.getPoster_path());

            List<String> genreNames = getGenreNames(movieData.getGenre_ids());
            movie.setGenre(String.join(", ", genreNames));

            movie.setOverview(movieData.getOverview());
        }
        return movieRepository.save(movie);
    }

    private List<String> getGenreNames(List<Integer> genreIds) {
        if (genreCache == null) {
            genreCache = fetchGenresFromTmdb();
        }
        if (genreCache != null) {
            return genreIds.stream()
                    .map(id -> genreCache.stream()
                            .filter(genre -> genre.getId() == id)
                            .findFirst()
                            .map(GenreResponse.Genre::getName)
                            .orElse("N/A"))
                    .collect(Collectors.toList());
        }
        return List.of("N/A");
    }

    private List<GenreResponse.Genre> fetchGenresFromTmdb() {
        RestTemplate restTemplate = new RestTemplate();
        String url = String.format("%s?api_key=%s&language=pt-BR", TMDB_GENRES_URL, tmdbApiKey);
        try {
            GenreResponse response = restTemplate.getForObject(url, GenreResponse.class);
            return response != null ? response.getGenres() : null;
        } catch (Exception e) {
            System.err.println("Error fetching genres from TMDb: " + e.getMessage());
        }
        return null;
    }

    private TmdbMovieResponse.TmdbMovieResult fetchMovieDataFromTmdb(String title) {
        RestTemplate restTemplate = new RestTemplate();
        String sanitizedTitle = title.replace(" ", "%20");
        String url = String.format("%s?api_key=%s&query=%s&language=pt-BR", TMDB_MOVIE_SEARCH_URL, tmdbApiKey, sanitizedTitle);
        System.out.println("Fetching movie from URL: " + url);

        try {
            TmdbMovieResponse response = restTemplate.getForObject(url, TmdbMovieResponse.class);
            if (response != null && !response.getResults().isEmpty()) {
                System.out.println("Movie data found from TMDb.");
                return response.getResults().get(0);
            } else {
                System.err.println("No movie data found for title: " + title);
            }
        } catch (Exception e) {
            System.err.println("Error fetching movie from TMDb: " + e.getMessage());
        }
        return null;
    }

    public Iterable<Movie> findAllMovies() {
        return movieRepository.findAll();
    }

    public Optional<Movie> findMovieById(Long id) {
        return movieRepository.findById(id);
    }

    public Optional<Movie> updateMovie(Long id, Movie updatedMovie) {
        return movieRepository.findById(id).map(existingMovie -> {
            existingMovie.setPersonalRating(updatedMovie.getPersonalRating());
            return movieRepository.save(existingMovie);
        });
    }

    public boolean deleteMovie(Long id) {
        if (movieRepository.existsById(id)) {
            movieRepository.deleteById(id);
            return true;
        }
        return false;
    }
}