export function updateGenreSelect(genres) {
    const genreSelect = document.getElementById('genre');
    genreSelect.innerHTML = '<option value="none">None</option>';
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.genreID;
        option.textContent = genre.genreName;
        genreSelect.appendChild(option);
    });
}