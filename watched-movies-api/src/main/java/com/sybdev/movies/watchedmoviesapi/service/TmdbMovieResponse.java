package com.sybdev.movies.watchedmoviesapi.service;

import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TmdbMovieResponse {
    private List<TmdbMovieResult> results;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TmdbMovieResult {
        private String title;
        private String release_date;
        private String poster_path;
    }
}