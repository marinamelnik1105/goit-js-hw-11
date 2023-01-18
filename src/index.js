import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
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
let searchQuery = '';
let page = 1;
let hits = 40;

async function onSearch(e) {
  e.preventDefault();
  console.dir(e.target.elements.searchQuery.value);
  searchQuery = e.target.elements.searchQuery.value;
  const observer = new IntersectionObserver(onInfinityLoad, optionsForObserv);

  if (searchQuery === '') {
    return;
  }
  const result = await fetchImage(searchQuery);
  console.log(result);

  try {
    if (!result.totalHits) {
      clearImages();

      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else {
      Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`);
      clearImages();
      await createMarkup(result.hits);

      observer.observe(refs.guard);
      lightbox.refresh();
    }
  } catch (err) {
    console.log(err);
  }

  async function createMarkup(images) {
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
          `<a class="link" href="${largeImageURL}"><div class="photo-card">
    <img class="image" src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b>${likes}
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

  async function onInfinityLoad(entries) {
    entries.forEach(async entry => {
      if (entry.isIntersecting) {
        page += 1;
        hits += 40;
        const result = await fetchImage(searchQuery, page);
        try {
          if (!result.totalHits) {
            clearImages();
            return;
          } else {
            await createMarkup(result.hits);
            lightbox.refresh();
            if (hits > result.totalHits) {
              observer.unobserve(refs.guard);
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    });
  }
  function clearImages() {
    refs.gallery.innerHTML = '';
  }
}
async function fetchImage(q, page) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;
  return await axios.get(url).then(response => response.data);
}
