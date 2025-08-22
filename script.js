const WEATHER_API_KEY = 'b56b607bcae52ca23c774ec0d83f7c31';
const NEWS_API_KEY = 'c9c259a4b0390f0c6cc2515221ae3376';

const btnMeal = document.getElementById('btn-meal');
const btnWeather = document.getElementById('btn-weather');
const btnNews = document.getElementById('btn-news');

const weatherInputContainer = document.getElementById('weather-input-container');
const cityInput = document.getElementById('city-input');
const weatherSubmit = document.getElementById('weather-submit');
const dataContainer = document.getElementById('data-container');

btnMeal.addEventListener('click', () => {
    weatherInputContainer.style.display = 'none';
    fetchRandomMeal();
});

btnWeather.addEventListener('click', () => {
    weatherInputContainer.style.display = 'flex';
    dataContainer.innerHTML = '<p>Enter a city to check the weather.</p>';
});

btnNews.addEventListener('click', () => {
    weatherInputContainer.style.display = 'none';
    fetchNews();
});

weatherSubmit.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        fetchWeather(city);
    } else {
        alert('Please enter a city name.');
    }
});

function fetchRandomMeal() {
    dataContainer.innerHTML = '<p>Loading meal...</p>';
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];

            const ingredients = [];
            for (let i = 1; i <= 20; i++) {
                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];
                if (ingredient && ingredient.trim()) {
                    ingredients.push(`${measure ? measure.trim() : ''} ${ingredient.trim()}`);
                }
            }

            const instructions = meal.strInstructions
                .split(/\.|\!|\?/)
                .filter(step => step.trim().length > 10)
                .map(step => step.trim())
                .filter(step => step.length > 0);

            dataContainer.innerHTML = `
                <div class="meal-container">
                    <h2 class="meal-title">${meal.strMeal}</h2>
                    <div class="meal-header">
                        <img class="meal-image" src="${meal.strMealThumb}" alt="Image of ${meal.strMeal}">
                        <div class="ingredients-list">
                            <h4>Ingredients</h4>
                            <ul>
                                ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    <div class="recipe-section">
                        <h3>Instructions</h3>
                        <ol class="recipe-steps">
                            ${instructions.map(step => `<li>${step}</li>`).join('')}
                        </ol>
                    </div>
                </div>`;
        }).catch(handleError);
}

function fetchWeather(city) {
    dataContainer.innerHTML = `<p>Loading weather for ${city}...</p>`;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const temp = data.main.temp;
                const description = data.weather[0].description;
                const icon = data.weather[0].icon;
                dataContainer.innerHTML = `
                    <h2>Weather in ${data.name}</h2>
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon">
                    <p><strong>Temperature:</strong> ${temp}°C</p>
                    <p><strong>Condition:</strong> ${description}</p>`;
            } else {
                dataContainer.innerHTML = `<p>City not found. Please try again.</p>`;
            }
        }).catch(handleError);
}

function fetchNews() {
    dataContainer.innerHTML = '<p>Loading top news from India...</p>';
    const newsUrl = `https://gnews.io/api/v4/top-headlines?country=in&lang=en&token=${NEWS_API_KEY}`;

    fetch(newsUrl)
        .then(response => response.json())
        .then(data => {
            let newsHTML = '<h2>Top Headlines in India</h2>';
            data.articles.forEach(article => {
                newsHTML += `
                    <div class="news-article">
                        <a href="${article.url}" target="_blank">${article.title}</a>
                        <p>${article.description}</p>
                        <p><em>Source: ${article.source.name}</em></p>
                    </div>`;
            });
            dataContainer.innerHTML = newsHTML;
        }).catch(handleError);
}

function handleError(error) {
    console.error('Error:', error);
    dataContainer.innerHTML = `<p>Something went wrong. Please check the console for details.</p>`;
}
