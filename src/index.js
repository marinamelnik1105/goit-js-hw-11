import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';
const axios = require('axios');

const API_KEY = '32819463-089d108b74804e81dbda92dfd';
const BASE_URL = 'https://pixabay.com/api/';
const refs = { form: document.querySelector('.search-form') };

refs.form.addEventListener('submit', onSearch);
const lightbox = new simpleLightbox('.gallery a');

function onSearch(e) {
  e.preventDefault();
  // &image_type=photo&orientation=horizontal&safesearch=true
  const url = `https://pixabay.com/api/?key=${API_KEY}&q=dog`;
  fetch(url)
    .then(r => r.json())
    .then(console.log);
}
