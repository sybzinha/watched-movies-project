package com.sybdev.movies.watchedmoviesapi.repository;

import com.sybdev.movies.watchedmoviesapi.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
}