async function get(url, cb) {
  let response = await fetch(url);

  if (response.ok) {
    let json = await response.json();

    cb(null, json);
  } else {
    cb(response.status);
  }
}

const weatherService = (function() {
  const appid = "730f1440aa7546a8284cbe2314a2b0eb";
  const apiUrl = "http://api.openweathermap.org/data/2.5";

  return {
    forecast(city = "kiev", cb) {
      get(`${apiUrl}/forecast?q=${city}&units=metric&appid=${appid}`, cb);
    }
  };
})();

const form = document.forms["weatherForm"];
const city = form.elements["city"];

form.addEventListener("submit", e => {
  e.preventDefault();
  weatherService.forecast(city.value, getResponse);
});

function getResponse(err, res) {
  if (err) {
    return;
  }

  renderWeather(clearData(res.list));
}

function clearData(data) {
  let clearedData = data.reduce((acc, value) => {
    acc[value["dt_txt"].slice(0, 10)] = value;
    return acc;
  }, {});
  let date = new Date();
  date.setDate(date.getDate() + 6);
  clearedData[
    date.getFullYear() + "-" + date.getMonth() + 1 + "-" + date.getDate()
  ] =
    clearedData[
      date.getFullYear() +
        "-" +
        date.getMonth() +
        1 +
        "-" +
        (date.getDate() - 1)
    ];

  return clearedData;
}

function renderWeather(res) {
  const weatherContainer = document.querySelector(".weather-container .row");
  if (weatherContainer.children.length) {
    clearContainer(weatherContainer);
  }
  let fragment = "";
  for (key in res) {
    const el = weatherTemplate(key, res[key]);
    fragment += el;
  }

  weatherContainer.insertAdjacentHTML("afterbegin", fragment);
}

function clearContainer(container) {
  let child = container.lastElementChild;
  while (child) {
    container.removeChild(child);
    child = container.lastElementChild;
  }
}

function getWeekDay(date) {
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

const mapImage = {
  Clear: "sun",
  Rain: "rain",
  Snow: "snow",
  Clouds: "cloud"
};

function weatherTemplate(
  key,
  { main: { temp }, weather: [{ main, description }] }
) {
  let date = new Date(key);
  return `
     <div class="col s2">
        <div class="card teal lighten-4">
            <div class="card-content black-text">
                <span class="card-title">${getWeekDay(
                  date
                )} <img class="responsive-img" src="static/image/${
    mapImage[main]
  }.png"></span>
                <p>${key || ""}</p>
                <p>${temp} °C</p>
                <p>${description}</p>
            </div>
        </div>
     </div>
  `;
}
