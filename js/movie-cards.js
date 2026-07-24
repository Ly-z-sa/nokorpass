/** Shared movie card markup for home + movies catalog */

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getMovieFormats(cinemas) {
  if (!cinemas?.length) return ['2D'];
  const formats = new Set();
  cinemas.forEach(c => {
    if (c.theatreTypes && Array.isArray(c.theatreTypes)) {
      c.theatreTypes.forEach(t => formats.add(t));
    }
  });
  const list = Array.from(formats);
  return list.length ? list : ['2D'];
}

function formatReleaseDate(movie, isComingSoon) {
  const dateStr = movie.releaseDate || movie.startDate;
  if (!dateStr) return isComingSoon ? 'Coming Soon' : 'Now Showing';
  const dObj = new Date(dateStr);
  if (isNaN(dObj.getTime())) return isComingSoon ? `Release: ${dateStr}` : 'Now Showing';
  const formatted = dObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  return isComingSoon ? `Release: ${formatted}` : 'Now Showing';
}

import { isMovieComingSoon as checkIsComingSoon } from './movies-data.js';

/**
 * @param {object} movie — entry from movies-data.js
 * @param {{ queryString?: string, useDataTrailer?: boolean }} options
 */
export function renderMovieCard(movie, options = {}) {
  const { queryString = '', useDataTrailer = false } = options;
  const today = new Date().toISOString().split('T')[0];
  const isComingSoon = checkIsComingSoon(movie, today);
  const displayRating = isComingSoon ? 0 : (movie.rating ?? 0);
  const bookHref = `movie-details.html?id=${movie.id}${queryString}`;
  const bookLabel = isComingSoon ? 'Pre-book' : 'Book Ticket';
  const releaseText = formatReleaseDate(movie, isComingSoon);
  const formats = getMovieFormats(movie.cinemas);

  const trailerBtn = movie.trailerId
    ? useDataTrailer
      ? `<button type="button" class="btn-trailer" data-trailer="${escapeHtml(movie.trailerId)}">Watch Trailer</button>`
      : `<button type="button" class="btn-trailer" onclick="openTrailer('${escapeHtml(movie.trailerId)}')">Watch Trailer</button>`
    : '';

  const runtimeStr = movie.runtime || movie.duration || '';
  const genreLine = `${escapeHtml(movie.genre)}${runtimeStr ? ` • ${escapeHtml(runtimeStr)}` : ''}`;

  const imageSrc = (movie.image && (movie.image.startsWith('http://') || movie.image.startsWith('https://')))
    ? movie.image
    : `assets/${encodeURI(movie.image || '')}`;

  const formatsHtml = formats.map(f => {
    const isSpecial = f === 'IMAX' || f === '4DX' || f === 'ScreenX' || f === '3D';
    return `<span class="format-tag ${isSpecial ? 'format-tag--special' : ''}">${escapeHtml(f)}</span>`;
  }).join('');

  return `
    <div class="movie-card">
      <div class="card-poster">
        <img src="${imageSrc}" alt="${escapeHtml(movie.title)}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22240%22 height=%22360%22%3E%3Crect fill=%22%231a1a1a%22 width=%22240%22 height=%22360%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23666%22 font-size=%2216%22%3ENo Image%3C/text%3E%3C/svg%3E'">
        ${isComingSoon ? '<span class="card-status-badge">COMING SOON</span>' : ''}
        <span class="card-rating">★ ${escapeHtml(displayRating)}</span>
        <div class="poster-overlay">
          <div style="width: 100%;">
            <a href="${bookHref}" class="btn-primary">${bookLabel}</a>
            ${trailerBtn}
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="card-genre">${genreLine}</div>
        <h3 class="card-title" title="${escapeHtml(movie.title)}">${escapeHtml(movie.title)}</h3>
        <div class="card-release">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          <span>${releaseText}</span>
        </div>
        <div class="card-formats">
          ${formatsHtml}
        </div>
      </div>
    </div>
  `;
}

export function bindTrailerButtons(root, onTrailer) {
  root.querySelectorAll('[data-trailer]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onTrailer(btn.dataset.trailer);
    });
  });
}
