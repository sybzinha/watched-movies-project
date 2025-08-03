package com.sybdev.movies.watchedmoviesapi.service;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GenreResponse {
    private List<Genre> genres;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Genre {
        private int id;
        private String name;
    }
}