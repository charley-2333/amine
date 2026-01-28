const animeList = document.getElementById('anime-list');
const searchInput = document.getElementById('search');
const genreButtons = document.querySelectorAll('#genre-filter button');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');

let currentPage = 1;
let totalPages = 1;
let currentQuery = "";
let currentGenre = "";

// Fetch anime from Jikan API
async function fetchAnime(page = 1, query = "", genre = "") {
    let q = query ? `&q=${query}` : "";
    let g = genre ? `&genres=${genre}` : "";
    const url = `https://api.jikan.moe/v4/anime?page=${page}${q}${g}&limit=12`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        displayAnime(data.data);
        totalPages = data.pagination.last_visible_page || 1;
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        prevPageBtn.disabled = currentPage <= 1;
        nextPageBtn.disabled = currentPage >= totalPages;
    } catch (err) {
        animeList.innerHTML = "<p style='color:red'>Failed to load anime. Try again later.</p>";
    }
}

function displayAnime(animeArray) {
    animeList.innerHTML = "";
    animeArray.forEach(anime => {
        const card = document.createElement('div');
        card.classList.add('anime-card');
        card.innerHTML = `
            <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
            <div class="info">
                <h2>${anime.title}</h2>
                <p>${anime.synopsis ? anime.synopsis.substring(0,100)+"..." : "No description"}</p>
                <a href="https://myanimelist.net/anime/${anime.mal_id}" target="_blank">Watch legally</a>
            </div>
        `;
        animeList.appendChild(card);
    });
}

// Event listeners
searchInput.addEventListener('input', e => {
    currentQuery = e.target.value;
    currentPage = 1;
    fetchAnime(currentPage, currentQuery, currentGenre);
});

genreButtons.forEach(btn => {
    btn.addEventListener('click', e => {
        currentGenre = e.target.dataset.genre;
        currentPage = 1;
        fetchAnime(currentPage, currentQuery, currentGenre);
    });
});

prevPageBtn.addEventListener('click', () => {
    if(currentPage > 1) { currentPage--; fetchAnime(currentPage, currentQuery, currentGenre); }
});

nextPageBtn.addEventListener('click', () => {
    if(currentPage < totalPages) { currentPage++; fetchAnime(currentPage, currentQuery, currentGenre); }
});

// Initial load
fetchAnime(currentPage);
