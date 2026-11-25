(function () {
  'use strict';
  const U = 'https://images.weserv.nl/?url=www.businessauto24.ru/uploads/cars/';
  const CARS = [
    { id: 'c1787146761808-80x1mg', brand: 'BMW', model: 'X1', country: 'eu', countryLabel: 'Европа', countryFlag: '🇪🇺', body: 'Кроссовер', fuel: 'Дизель', engine: 2000, year: 2022, price: 1530000, power: 150, mileage: 53650, transmission: 'Автомат', drive: 'Полный', condition: 'С пробегом', color: 'Серый', popular: false, rating: 0, photo: U + '1787146761808-80x1mg.png', photos: [U + '1787146761808-80x1mg.png', U + '1787146761815-qci3h5.png'] },
    { id: 'c1787146552003-wbf16j', brand: 'Toyota', model: 'Yaris Cross', country: 'eu', countryLabel: 'Европа', countryFlag: '🇪🇺', body: 'Кроссовер', fuel: 'Гибрид', engine: 1500, year: 2023, price: 1180000, power: 116, mileage: 47717, transmission: 'Автомат', drive: 'Передний', condition: 'С пробегом', color: 'Тёмно-серый', popular: false, rating: 0, photo: U + '1787146552003-wbf16j.png', photos: [U + '1787146552003-wbf16j.png', U + '1787146552011-kslxdl.png'] },
    { id: 'c1787146352097-pl6nxc', brand: 'Kia', model: 'Sportage GT-Line', country: 'eu', countryLabel: 'Европа', countryFlag: '🇪🇺', body: 'Кроссовер', fuel: 'Бензин', engine: null, year: 2024, price: 2100000, power: 159, mileage: 17718, transmission: 'Автомат', drive: 'Передний', condition: 'С пробегом', color: 'Белый', popular: false, rating: 0, photo: U + '1787146352097-pl6nxc.webp', photos: [U + '1787146352097-pl6nxc.webp', U + '1787146352091-4qhlnx.webp'] },
    { id: 'c1787146063967-tzfwoq', brand: 'Volkswagen', model: 'Multivan', country: 'eu', countryLabel: 'Европа', countryFlag: '🇪🇺', body: 'Минивэн', fuel: 'Дизель', engine: 2000, year: 2022, price: 1750000, power: 150, mileage: 65000, transmission: 'Автомат', drive: 'Передний', condition: 'С пробегом', color: 'Тёмно-серый', popular: false, rating: 0, photo: U + '1787146063967-tzfwoq.jpg', photos: [U + '1787146063967-tzfwoq.jpg', U + '1787146063860-jctt6j.png'] },
    { id: 'c1786106987899-gvkscg', brand: 'Volkswagen', model: 'T-Roc', country: 'eu', countryLabel: 'Европа', countryFlag: '🇪🇺', body: 'Седан', fuel: 'Бензин', engine: 1500, year: 2024, price: 2100000, power: 150, mileage: 2501, transmission: 'Автомат', drive: 'Передний', condition: 'Новое авто', color: 'Серый', popular: false, rating: 0, photo: U + '1786106987899-gvkscg.png', photos: [U + '1786106987899-gvkscg.png', U + '1786106995670-is78ad.png'] }
  ];

  window.AUTODRIVE_DATA = {
    cars: CARS,
    countryLabels: { eu: 'Европа', usa: 'США', kr: 'Корея', cn: 'Китай' }
  };
})();
