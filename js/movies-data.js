/** Shared movie catalog for NokorPass — managed via Admin Panel */
export const moviesData = [];

import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

/**
 * Filter movies by date range:
 * - Active: startDate <= Today <= endDate (or no date range set)
 * - Coming Soon: startDate > Today
 * - Expired: Today > endDate (excluded)
 */
export function filterMoviesByDate(movies) {
  const today = new Date().toISOString().split('T')[0];
  return movies.filter((m) => {
    if (m.endDate && today > m.endDate) {
      return false; // Expired, hide from website
    }
    return true;
  });
}

export async function getMoviesAsync() {
  try {
    const querySnapshot = await getDocs(collection(db, "movies"));
    const list = [];
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    return filterMoviesByDate(list);
  } catch (err) {
    console.warn("Could not fetch movies from Firestore:", err);
  }
  return [];
}

export function isMovieComingSoon(movie, today = new Date().toISOString().split('T')[0]) {
  if (!movie) return false;
  if (movie.startDate && movie.startDate > today) return true;
  if (movie.releaseDate && movie.releaseDate > today) return true;
  return false;
}

export function getTopRatedMovies(count = 3, movies = moviesData) {
  const today = new Date().toISOString().split('T')[0];
  return [...movies]
    .filter((m) => !isMovieComingSoon(m, today) && typeof m.rating === "number")
    .sort((a, b) => b.rating - a.rating)
    .slice(0, count);
}

export function getMovieById(id, movies = moviesData) {
  return movies.find((m) => String(m.id) === String(id));
}
