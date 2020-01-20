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

  renderWeather(res.list);
}

function renderWeather(res) {
  const weatherContainer = document.querySelector(".weather-container .row");
  if (weatherContainer.children.length) {
    clearContainer(weatherContainer);
  }
  let fragment = "";



  res.forEach(weatherItem => {
    const el = weatherTemplate(weatherItem);
    fragment += el;
  });

  weatherContainer.insertAdjacentHTML("afterbegin", fragment);
}

function clearContainer(container) {
  // container.innerHTML = '';
  let child = container.lastElementChild;
  while (child) {
    container.removeChild(child);
    child = container.lastElementChild;
  }
}

function weatherTemplate({
  main: { temp },
  weather: [{ main, description }],
  dt_txt
}) {
  return `
     <div class="col s2">
                <div class="card teal lighten-4">
                    <div class="card-content black-text">
                        <span class="card-title">Mon <img class="responsive-img" src="static/image/cloud.png"></span>
                        <p>${dt_txt || ""}</p>
                        <p>${temp} °C</p>
                        <p>${description}</p>
                    </div>
                </div>
            </div>
  `;
}
