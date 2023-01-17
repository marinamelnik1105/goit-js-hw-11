import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import SimpleLightbox from 'simplelightbox/dist/simple-lightbox.esm';
import 'simplelightbox/dist/simple-lightbox.min.css';
const axios = require('axios');

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

function onSearch(e) {
  e.preventDefault();
  console.dir(e.target.elements.searchQuery.value);
  const searchQuery = e.target.elements.searchQuery.value;
  const observer = new IntersectionObserver(onInfinityLoad, optionsForObserv);
  fetchImage(searchQuery).then(data => {
    console.log(data);
    clearImages();
    createMarkup(data.hits);
    observer.observe(refs.guard);
  });

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
  function fetchImage(q) {
    const url = `${BASE_URL}?key=${API_KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=30`;
    return fetch(url)
      .then(resp => {
        if (!resp.ok) {
          throw new Error(resp.statusText);
        }
        return resp.json();
      })
      .catch(err => console.error(err));
  }
  function onInfinityLoad(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        page += 1;
        hits += 30;
        fetchImage(page).then(data => {
          createMarkup(data.hits);
          if (hits >= data.hits) {
            observer.unobserve(refs.guard);
          }
        });
      }
    });
  }
  function clearImages() {
    refs.gallery.innerHTML = '';
  }
}
