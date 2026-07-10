/** Shared movie card markup for home + movies catalog */

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderCinemaList(cinemas) {
  if (!cinemas?.length) return '';
  return cinemas
    .map(
      (c) => `
      <div style="margin-bottom: 8px;">
        <strong>${escapeHtml(c.name)}:</strong> ${escapeHtml(c.locations.join(', '))}
        <br><span style="color: var(--accent); font-size: 0.9em;">${escapeHtml(c.theatreTypes.join(', '))}</span>
      </div>`
    )
    .join('');
}

/**
 * @param {object} movie — entry from movies-data.js
 * @param {{ queryString?: string, useDataTrailer?: boolean }} options
 */
export function renderMovieCard(movie, options = {}) {
  const { queryString = '', useDataTrailer = false } = options;
  const today = new Date().toISOString().split('T')[0];
  const isComingSoon = movie.releaseDate > today;
  const bookHref = `movie-details.html?id=${movie.id}${queryString}`;
  const bookStyle = '';
  const bookLabel = isComingSoon ? 'Pre-book' : 'Book Ticket';

  const trailerBtn = movie.trailerId
    ? useDataTrailer
      ? `<button type="button" class="btn-trailer" data-trailer="${escapeHtml(movie.trailerId)}">Watch Trailer</button>`
      : `<button type="button" class="btn-trailer" onclick="openTrailer('${escapeHtml(movie.trailerId)}')">Watch Trailer</button>`
    : '';

  const genreLine = `${escapeHtml(movie.genre)}${movie.runtime ? ` | ${escapeHtml(movie.runtime)}` : ''}`;

  return `
    <div class="movie-card">
      <div class="card-poster">
        <img src="assets/${encodeURI(movie.image)}" alt="${escapeHtml(movie.title)}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22240%22 height=%22360%22%3E%3Crect fill=%22%231a1a1a%22 width=%22240%22 height=%22360%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23666%22 font-size=%2216%22%3ENo Image%3C/text%3E%3C/svg%3E'">
        <span class="card-rating">★ ${escapeHtml(movie.rating)}</span>
        <div class="poster-overlay">
          <div style="width: 100%;">
            <a href="${bookHref}" class="btn-primary" style="${bookStyle}">${bookLabel}</a>
            ${trailerBtn}
          </div>
        </div>
      </div>
      <div class="card-body">
        <p class="card-genre">${genreLine}</p>
        <h3 class="card-title">${escapeHtml(movie.title)}</h3>
        <div class="card-desc" style="display: block; overflow: visible;">
          ${renderCinemaList(movie.cinemas)}
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
