import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import SimpleLightbox from 'simplelightbox/dist/simple-lightbox.esm';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const API_KEY = '32819463-089d108b74804e81dbda92dfd';
const BASE_URL = 'https://pixabay.com/api/';
const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  guard: document.querySelector('.js-guard'),
};

refs.form.addEventListener('submit', onSearch);
const lightbox = new SimpleLightbox('.gallery a');
const optionsForObserv = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};
let page = 1;
let hits = 30;

async function onSearch(e) {
  e.preventDefault();
  console.dir(e.target.elements.searchQuery.value);
  const searchQuery = e.target.elements.searchQuery.value;
  const observer = new IntersectionObserver(onInfinityLoad, optionsForObserv);
  const result = await fetchImage(searchQuery);
  console.log(result);
  currentHits = result.hits;
  clearImages();
  createMarkup(result.hits);
  observer.observe(refs.guard);

  function createMarkup(images) {
    const markup = images
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) =>
          `<a href="${largeImageURL}"><div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item"
        <b>Likes</b>>${likes}
      </p>
      <p class="info-item">
        <b>Views</b>${views}
      </p>
      <p class="info-item">
        <b>Comments</b>${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>${downloads}
      </p>
    </div>
  </div></a>`
      )
      .join('');
    refs.gallery.insertAdjacentHTML('beforeend', markup);
  }

  function clearImages() {
    refs.gallery.innerHTML = '';
  }
  async function onInfinityLoad(entries) {
    entries.forEach(async entry => {
      if (entry.isIntersecting) {
        page += 1;
        hits += 30;
        const result = await fetchImage(page);
        createMarkup(result.hits);
        if (hits >= result.hits) {
          observer.unobserve(refs.guard);
        }
      }
    });
  }
}
async function fetchImage(q) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=30`;
  return await axios.get(url).then(response => response.data);
}
