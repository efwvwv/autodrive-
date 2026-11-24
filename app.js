document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const MAX_URL = 'https://max.ru/u/f9LHodD0cOKCW0QXQMtYGIliqFM8HImAp_SXC81-MX50TsElWm4CZVcckRY';

  // 1. Данные
  const carsData = (window.AUTODRIVE_DATA && window.AUTODRIVE_DATA.cars) ? window.AUTODRIVE_DATA.cars : [];
  const reviewsData = window.AUTODRIVE_REVIEWS || [];
  
  if (carsData.length === 0) console.warn('AutoDrive: данные машин не загружены');
  if (reviewsData.length === 0) console.warn('AutoDrive: данные отзывов не загружены');

  // 2. Состояние
  const state = {
    filteredCars: [...carsData],
    visibleCount: 6,
    visibleReviews: 6,
    favorites: JSON.parse(localStorage.getItem('autodrive_favs')) || [],
    filters: {
      search: '',
      country: 'all',
      body: 'all',
      fuel: 'all',
      maxPrice: 5000000,
      sortBy: 'popular',
      showFavoritesOnly: false
    }
  };

  // 3. DOM элементы
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);
  const dom = {
    catalogGrid: $('#catalogGrid'),
    resultsCount: $('#resultsCount'),
    loadMoreBtn: $('#loadMore'),
    searchInput: $('#searchInput'),
    filterCountry: $('#filterCountry'),
    filterBody: $('#filterBody'),
    filterFuel: $('#filterFuel'),
    filterPrice: $('#filterPrice'),
    priceLabel: $('#priceLabel'),
    sortBy: $('#sortBy'),
    resetFilters: $('#resetFilters'),
    favCount: $('#favCount'),
    favoritesToggle: $('#favoritesToggle'),
    modal: $('#modal'),
    modalContent: $('#modalContent'),
    toasts: $('#toasts'),
    burger: $('#burger'),
    nav: $('#nav'),
    header: $('#header'),
    reviewsGrid: $('#reviewsGrid'),
    loadMoreReviews: $('#loadMoreReviews')
  };

  // 4. Утилиты
  const formatPrice = (num) => new Intl.NumberFormat('ru-RU').format(num) + ' ₽';

  function showToast(message, type = 'success') {
    if (!dom.toasts) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'is-error' : ''}`;
    toast.innerHTML = `<span class="toast__ico">${type === 'error' ? '❌' : '✅'}</span><span>${message}</span>`;
    dom.toasts.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  // 5. Рендер каталога
  function renderCatalog() {
    if (!dom.catalogGrid) return;

    let result = carsData.filter(car => {
      const searchMatch = (car.brand + ' ' + car.model).toLowerCase().includes(state.filters.search.toLowerCase());
      const countryMatch = state.filters.country === 'all' || car.country === state.filters.country;
      const bodyMatch = state.filters.body === 'all' || car.body === state.filters.body;
      const fuelMatch = state.filters.fuel === 'all' || car.fuel === state.filters.fuel;
      const priceMatch = car.price <= state.filters.maxPrice;
      const favMatch = !state.filters.showFavoritesOnly || state.favorites.includes(car.id);
      return searchMatch && countryMatch && bodyMatch && fuelMatch && priceMatch && favMatch;
    });

    switch (state.filters.sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'year-desc': result.sort((a, b) => b.year - a.year); break;
      default: result.sort((a, b) => (b.popular === true) - (a.popular === true));
    }

    state.filteredCars = result;
    if (dom.resultsCount) dom.resultsCount.textContent = `Найдено автомобилей: ${result.length}`;

    const carsToShow = result.slice(0, state.visibleCount);

    if (carsToShow.length === 0) {
      dom.catalogGrid.innerHTML = `<div class="empty-state"><h3>Ничего не найдено</h3><p>Попробуйте изменить параметры фильтрации</p></div>`;
      if (dom.loadMoreBtn) dom.loadMoreBtn.style.display = 'none';
      return;
    }

    dom.catalogGrid.innerHTML = carsToShow.map(car => {
      const isFav = state.favorites.includes(car.id);
      return `
        <article class="car-card">
          <div class="car-card__media">
            <img src="${car.photo}" alt="${car.brand} ${car.model}" loading="lazy">
            <span class="car-card__country">${car.countryFlag} ${car.countryLabel}</span>
            <button class="car-card__fav ${isFav ? 'is-active' : ''}" data-fav="${car.id}" aria-label="В избранное">❤</button>
          </div>
          <div class="car-card__body">
            <h3 class="car-card__title">${car.brand} ${car.model}</h3>
            <div class="car-card__meta">
              <span>${car.year} г.</span>
              <span>${car.engine ? car.engine + ' см³' : '—'}</span>
              <span>${car.fuel}</span>
              <span>${car.transmission}</span>
              <span>${car.power || '—'} л.с.</span>
            </div>
            <div class="car-card__footer">
              <div class="car-card__price">${formatPrice(car.price)}<small>под ключ</small></div>
              <button class="btn btn--accent car-card__btn" data-car="${car.id}">Подробнее</button>
            </div>
          </div>
        </article>`;
    }).join('');

    if (dom.loadMoreBtn) {
      dom.loadMoreBtn.style.display = result.length > state.visibleCount ? 'inline-flex' : 'none';
    }
  }

  // 6. Фильтры
  if (dom.searchInput) dom.searchInput.addEventListener('input', e => {
    state.filters.search = e.target.value; state.visibleCount = 6; renderCatalog();
  });
  if (dom.filterCountry) dom.filterCountry.addEventListener('change', e => { state.filters.country = e.target.value; state.visibleCount = 6; renderCatalog(); });
  if (dom.filterBody) dom.filterBody.addEventListener('change', e => { state.filters.body = e.target.value; state.visibleCount = 6; renderCatalog(); });
  if (dom.filterFuel) dom.filterFuel.addEventListener('change', e => { state.filters.fuel = e.target.value; state.visibleCount = 6; renderCatalog(); });
  if (dom.sortBy) dom.sortBy.addEventListener('change', e => { state.filters.sortBy = e.target.value; renderCatalog(); });
  if (dom.filterPrice) dom.filterPrice.addEventListener('input', e => {
    const val = parseInt(e.target.value);
    state.filters.maxPrice = val;
    dom.priceLabel.textContent = formatPrice(val);
    state.visibleCount = 6;
    renderCatalog();
  });

  if (dom.resetFilters) dom.resetFilters.addEventListener('click', () => {
    state.filters = { search: '', country: 'all', body: 'all', fuel: 'all', maxPrice: 5000000, sortBy: 'popular', showFavoritesOnly: false };
    state.visibleCount = 6;
    if (dom.searchInput) dom.searchInput.value = '';
    if (dom.filterCountry) dom.filterCountry.value = 'all';
    if (dom.filterBody) dom.filterBody.value = 'all';
    if (dom.filterFuel) dom.filterFuel.value = 'all';
    if (dom.filterPrice) dom.filterPrice.value = 5000000;
    if (dom.priceLabel) dom.priceLabel.textContent = formatPrice(5000000);
    if (dom.sortBy) dom.sortBy.value = 'popular';
    if (dom.favoritesToggle) dom.favoritesToggle.classList.remove('btn--accent');
    renderCatalog();
    updateFavCount();
  });

  if (dom.loadMoreBtn) dom.loadMoreBtn.addEventListener('click', () => { state.visibleCount += 6; renderCatalog(); });

  // 7. Избранное
  function updateFavCount() {
    if (dom.favCount) dom.favCount.textContent = state.favorites.length;
    localStorage.setItem('autodrive_favs', JSON.stringify(state.favorites));
  }

  if (dom.catalogGrid) dom.catalogGrid.addEventListener('click', e => {
    const favBtn = e.target.closest('[data-fav]');
    if (favBtn) {
      e.preventDefault();
      const id = favBtn.getAttribute('data-fav');
      if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter(f => f !== id);
        favBtn.classList.remove('is-active');
      } else {
        state.favorites.push(id);
        favBtn.classList.add('is-active');
      }
      updateFavCount();
      renderCatalog();
      return;
    }
    const detailBtn = e.target.closest('[data-car]');
    if (detailBtn) { e.preventDefault(); openCarModal(detailBtn.getAttribute('data-car')); }
  });

  if (dom.favoritesToggle) dom.favoritesToggle.addEventListener('click', () => {
    state.filters.showFavoritesOnly = !state.filters.showFavoritesOnly;
    state.visibleCount = 6;
    dom.favoritesToggle.classList.toggle('btn--accent', state.filters.showFavoritesOnly);
    renderCatalog();
  });

  // 8. Модалки
  function openModal() { dom.modal.classList.add('is-open'); dom.modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
  function closeModal() { dom.modal.classList.remove('is-open'); dom.modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }

  document.body.addEventListener('click', e => {
    if (e.target.closest('[data-open-modal]')) { e.preventDefault(); openCallbackModal(); }
    if (e.target.closest('[data-close-modal]')) closeModal();
  });

  function openCallbackModal() {
    dom.modalContent.innerHTML = `
      <h3 style="margin-bottom:10px">Оставить заявку</h3>
      <p style="color:var(--text-soft);margin-bottom:20px">Удобнее всего — написать нам в мессенджер MAX. Ответим в течение 15 минут.</p>
      <a href="${MAX_URL}" target="_blank" rel="noopener" class="btn btn--accent btn--block btn--lg">Написать в MAX →</a>`;
    openModal();
  }

  function openCarModal(id) {
    const car = carsData.find(c => c.id === id);
    if (!car) return;
    dom.modalContent.innerHTML = `
      <div class="modal-car__media"><img src="${car.photo}" alt="${car.brand} ${car.model}"></div>
      <h3>${car.brand} ${car.model}</h3>
      <p style="color:var(--text-soft)">${car.year} год · ${car.countryFlag} ${car.countryLabel} · ${car.condition}</p>
      <div class="modal-car__price">${formatPrice(car.price)}</div>
      <div class="modal-car__specs">
        <div>Двигатель: <b>${car.engine ? car.engine + ' см³' : '—'}, ${car.fuel}</b></div>
        <div>Мощность: <b>${car.power || '—'} л.с.</b></div>
        <div>КПП: <b>${car.transmission}</b></div>
        <div>Привод: <b>${car.drive || '—'}</b></div>
        <div>Кузов: <b>${car.body}</b></div>
        <div>Пробег: <b>${new Intl.NumberFormat('ru-RU').format(car.mileage)} км</b></div>
        <div>Цвет: <b>${car.color || '—'}</b></div>
      </div>
      <a href="${MAX_URL}" target="_blank" rel="noopener" class="btn btn--accent btn--block btn--lg">Заказать в MAX →</a>`;
    openModal();
  }

  // 9. Отзывы
  function renderReviews() {
    if (!dom.reviewsGrid) return;
    const list = reviewsData.slice(0, state.visibleReviews);
    dom.reviewsGrid.innerHTML = list.map(r => {
      const initials = r.name.split(' ').map(w => w.charAt(0)).join('').slice(0, 2);
      return `
        <article class="review">
          <div class="review__stars">★★★★★</div>
          <p>«${r.text}»</p>
          <div class="review__author">
            <span class="avatar">${initials}</span>
            <div><b>${r.name}</b><small>${r.city}</small></div>
          </div>
        </article>`;
    }).join('');
    if (dom.loadMoreReviews) {
      dom.loadMoreReviews.style.display = reviewsData.length > state.visibleReviews ? 'inline-flex' : 'none';
    }
  }
  if (dom.loadMoreReviews) dom.loadMoreReviews.addEventListener('click', () => {
    state.visibleReviews += 6; renderReviews();
  });

  // 10. Мобильное меню и скролл
  if (dom.burger) dom.burger.addEventListener('click', () => {
    const isOpen = dom.nav.classList.toggle('is-open');
    dom.burger.setAttribute('aria-expanded', isOpen);
  });
  $$('.nav__link').forEach(link => link.addEventListener('click', () => {
    if (dom.nav.classList.contains('is-open')) { dom.nav.classList.remove('is-open'); dom.burger.setAttribute('aria-expanded', 'false'); }
  }));
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) dom.header.classList.add('is-scrolled');
    else dom.header.classList.remove('is-scrolled');
  });

  // 11. Старт
  updateFavCount();
  renderCatalog();
  renderReviews();

  $$('[data-filter-country]').forEach(btn => btn.addEventListener('click', () => {
    const country = btn.getAttribute('data-filter-country');
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
    if (dom.filterCountry) { dom.filterCountry.value = country; state.filters.country = country; state.visibleCount = 6; renderCatalog(); }
  }));
});