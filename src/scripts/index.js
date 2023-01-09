const countryAll = [];

const API_ENDPOINT = {
  ALL: 'https://restcountries.com/v3.1/all',
  NAME: 'https://restcountries.com/v3.1/name',
  REGION: 'https://restcountries.com/v3.1/region',
  CODE: 'https://restcountries.com/v3.1/alpha'
};

class CountrySource {
  static async allCountry() {
    const response = await fetch(API_ENDPOINT.ALL);
    const responseJson = await response.json();
    return responseJson;
  }

  static async getCountryByName(name) {
    const response = await fetch(`${API_ENDPOINT.NAME}/${name}`);
    const responseJson = await response.json();
    return responseJson;
  }

  static async getCountryByCode(code) {
    const response = await fetch(`${API_ENDPOINT.CODE}/${code}`);
    const responseJson = await response.json();
    return responseJson;
  }

  static async getCountryByRegion(region) {
    const response = await fetch(`${API_ENDPOINT.REGION}/${region}`);
    const responseJson = await response.json();
    return responseJson;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const displayRegionButton = document.querySelector('#displayRegion');
  const darkModeButton = document.querySelector('#darkMode');
  
  displayRegionButton.addEventListener('click', (e) => {
    e.preventDefault();
    setDisplayRegion();
  });

  darkModeButton.addEventListener('click', (e) => {
    e.preventDefault();
    setDarkMode();
  });

  if (document.documentElement.classList.contains('dark')) {
    darkModeButton.innerHTML = `
      <i class="fa-regular fa-sun"></i>
      <span class="font-semibold">Light Mode</span>
    `;
  } else {
    darkModeButton.innerHTML = `
      <i class="fa-regular fa-moon"></i>
      <span class="font-semibold">Dark Mode</span>
    `;
  }

  displayAllCountry();
});

const setDisplayRegion = () => {
  const regionItem = document.querySelector('#region');
  const angle = document.querySelector('.fa-angle-down');
  regionItem.classList.toggle('hidden');
  angle.classList.toggle('rotate180');
};

const setDarkMode = () => {
  const darkModeButton = document.querySelector('#darkMode');
  document.documentElement.classList.toggle('dark');

  if (document.documentElement.classList.contains('dark')) {
    localStorage.theme = 'dark';
    darkModeButton.innerHTML = `
      <i class="fa-regular fa-sun"></i>
      <span class="font-semibold">Light Mode</span>
    `;
  } else {
    localStorage.theme = 'light';
    darkModeButton.innerHTML = `
      <i class="fa-regular fa-moon"></i>
      <span class="font-semibold">Dark Mode</span>
    `;
  }
};

const addCommaSeparates = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const displayAllCountry = async () => {
  const displayAllCountry = document.querySelector('#countryLists');
  const loader = document.querySelector('#contentLoader');

  displayAllCountry.innerHTML = '';
  loader.classList.remove('hidden');
  const response = await CountrySource.allCountry();

  response.forEach((country) => {
    const countries = { code: country.cca3 === undefined ? '-' : country.cca3, name: country.name.common };
    countryAll.push(countries);
    displayAllCountry.innerHTML += `
      <button id="country" class="text-start" name="${country.cca3}">
        <div class="bg-white shadow-input rounded-lg dark:bg-darkblue dark:text-white">
          <img src="${country.flags.png}" alt="${country.fifa}-flag" loading="lazy" class="block rounded-t-lg w-full h-48">
          <div class="p-8">
            <h2 class="font-extrabold text-xl">${country.name.common}</h2>
            <ul class="mt-4">
              <li><span class="font-semibold">Population:</span> ${addCommaSeparates(country.population)}</li>
              <li><span class="font-semibold">Region:</span> ${country.region}</li>
              <li><span class="font-semibold">Capital:</span> ${country.capital === undefined ? '-' : country.capital}</li>
            </ul>
          </div>
        </div>
      </button>
    `;
  });

  if (displayAllCountry.innerHTML.length > 0) {
    loader.classList.add('hidden');
  }

  getClickedCountry();
  searchCountry();
};

const getClickedCountry = () => {
  const buttons = document.querySelectorAll('#country');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      displaySelectedCountry(button.getAttribute('name'));
    });
  });
};

const displaySelectedCountry = async (code) => {
  const detailCountryItem = document.querySelector('#detailCountry');
  detailCountryItem.innerHTML = '';
  displayDetail();
  
  const response = await CountrySource.getCountryByCode(code);
  displayDetailCountry(response[0]);

  const backToHomeButton = document.querySelector('#backToHome');
  backToHomeButton.addEventListener('click', (e) => {
    e.preventDefault();
    backToHome();
  });
}

const displayDetail = () => {
  const countrySearch = document.querySelector('#countrySearch');
  const countryLists = document.querySelector('#countryLists');
  const detailCountry = document.querySelector('#detailCountry');
  const loader = document.querySelector('#contentLoader');

  countrySearch.classList.add('hidden');
  countryLists.classList.add('hidden');
  detailCountry.classList.remove('hidden');
  loader.classList.remove('hidden');
};

const displayDetailCountry = (response) => {
  let firstKey = Object.keys(response.name.nativeName)[0];

  const detailCountryItem = document.querySelector('#detailCountry');
  detailCountryItem.innerHTML = `
    <button id="backToHome" class="py-2 px-8 flex justify-center items-center gap-5 shadow-input rounded-lg dark:bg-darkblue dark:text-white"><i class="fa-solid fa-arrow-left"></i> Back</button>
    <div class="mt-6 lg:flex lg:justify-between lg:items-center dark:text-white">
      <img src="${response.flags.png}" alt="${response.cca3}-Flag" class="w-full rounded-lg shadow-input lg:w-2/5">
      <div class="py-8 md:px-12 lg:w-1/2">
        <h2 class="font-extrabold text-xl md:text-2xl lg:text-3xl">${response.name.common}</h2>
        <div class="md:flex md:justify-between md:items-start">
          <ul class="mt-6 leading-loose">
            <li><span class="font-semibold">Native Name:</span> ${response.name.nativeName[firstKey].official}</li>
            <li><span class="font-semibold">Population:</span> ${addCommaSeparates(response.population)}</li>
            <li><span class="font-semibold">Region:</span> ${response.region}</li>
            <li><span class="font-semibold">Sub Region:</span> ${response.subregion}</li>
            <li><span class="font-semibold">Capital:</span> ${response.capital}</li>
          </ul>
          <ul class="mt-6 leading-loose">
            <li><span class="font-semibold">Top Level Domain:</span> ${response.tld}</li>
            <li><span class="font-semibold">Currencies:</span> ${response.currencies[Object.keys(response.currencies)[0]].name}</li>
            <li><span class="font-semibold">Languages:</span> ${Object.values(response.languages)}</li>
          </ul>
        </div>
        <div class="mt-6 md:flex md:gap-4">
          <h3 class="font-extrabold text-lg md:w-[35%]">Border Countries:</h3>
          <ul id="borderCountry" class="mt-4 flex items-center gap-4 flex-wrap md:mt-0 lg:w-[65%]"></ul>
        </div>
      </div>
    </div>
  `;

  if (detailCountryItem.innerHTML.length > 0) {
    document.querySelector('#contentLoader').classList.add('hidden');
  }

  const borderCountry = document.querySelector('#borderCountry');
  countryAll.forEach((list) => {
    response.borders 
      ? response.borders.forEach((border) => {
          if (list.code === border) {
            borderCountry.innerHTML += `
              <li class="py-1 px-6 shadow-input rounded-md lg:text-sm dark:bg-darkblue">${list.name}</li>
            `;
          }
        })
      : borderCountry.innerHTML = `<li class="py-1 px-6 shadow-input rounded-md lg:text-sm dark:bg-darkblue">Not Available</li>`;
  });
}

const backToHome = () => {
  const countrySearch = document.querySelector('#countrySearch');
  const countryLists = document.querySelector('#countryLists');
  const detailCountry = document.querySelector('#detailCountry');
  const loader = document.querySelector('#contentLoader');

  countrySearch.classList.remove('hidden');
  countryLists.classList.remove('hidden');
  detailCountry.classList.add('hidden');
  loader.classList.add('hidden');
};

const searchCountry = () => {
  const searchInput = document.querySelector('#searchInput');
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (e.target.value.length > 0) {
        displaySearchCountry(e.target.value);
        e.target.value = '';
      } else {
        displayAllCountry();
      }
    }
  });
};

const displaySearchCountry = async (input) => {
  loadingContent();
  const response = await CountrySource.getCountryByName(input);

  displayCountryItem(response);
};

const getCountryRegion = async (region) => {
  const idRegion = region.getAttribute('id');
  loadingContent();
  const response = await CountrySource.getCountryByRegion(idRegion);

  displayCountryItem(response);
};

const loadingContent = () => {
  const navRegion = document.querySelector('#region');
  const angle = document.querySelector('.fa-angle-down');
  const displayCountry = document.querySelector('#countryLists');
  const loader = document.querySelector('#contentLoader');

  displayCountry.innerHTML = '';
  navRegion.classList.add('hidden');
  angle.classList.remove('rotate180');
  loader.classList.remove('hidden');
};

const displayCountryItem = (response) => {
  const displayCountry = document.querySelector('#countryLists');
  const loader = document.querySelector('#contentLoader');

  response.forEach((country) => {
    displayCountry.innerHTML += `
      <button id="country" class="text-start" name="${country.cca3}">
      <div class="bg-white shadow-input rounded-lg dark:bg-darkblue dark:text-white">
        <img src="${country.flags.png}" alt="${country.fifa}-flag" loading="lazy" class="rounded-t-lg w-full h-52">
        <div class="p-8">
          <h2 class="font-extrabold text-xl">${country.name.common}</h2>
          <ul class="mt-4">
            <li><span class="font-semibold">Population:</span> ${addCommaSeparates(country.population)}</li>
            <li><span class="font-semibold">Region:</span> ${country.region}</li>
            <li><span class="font-semibold">Capital:</span> ${country.capital === undefined ? '-' : country.capital}</li>
          </ul>
        </div>
      </div>
    </button>
  `;
  });

  if (displayCountry.innerHTML.length > 0) {
    loader.classList.add('hidden');
  }

  getClickedCountry();
};
