const forecast = document.querySelector(".forecast-1");
const titles = document.querySelector(".titles");
const fortables = document.querySelector(".forecastTable");
const map = document.querySelector("#map");

//calculate the current GMT hour
let time;
const curGMT = (GMTdif = 3) => {
  // GMT is default 3 for Turkey. You should select proper time correction according to your time zone
  time = new Date();
  const timecorrection = time.getHours() - GMTdif;
  if (timecorrection === 0) return 24;
  if (timecorrection > 0) return timecorrection;
  if (timecorrection < 0) return Math.abs(timecorrection - 21);
};

const windMeas = function (wind) {
  if (wind < 1) return `0.3m/s (Calm)`;
  if (wind < 2) return `0.3-3.4m/s (Light)`;
  if (wind < 3) return `3.4-8.0m/s (Modarate)`;
  if (wind < 4) return `8.0-10.8m/s (Fresh)`;
  if (wind < 5) return `10.8-17.2m/s (Strong)`;
  if (wind < 6) return `17.2-24.5m/s (Gale)`;
  if (wind < 7) return `24.5-32.6m/s (storm)`;
  if (wind < 8) return `Over 32.6m/s (Hurricane)`;
};

const SeeingMeas = function (see) {
  if (see === 1) return `<0.5"`;
  if (see === 2) return `0.5"-0.75"`;
  if (see === 3) return `0.75"-1"`;
  if (see === 4) return `1"-1.25"`;
  if (see === 5) return `1.25"-1.5`;
  if (see === 6) return `1.5"-2"`;
  if (see === 7) return `2"-2.5`;
  if (see === 8) return `>2.5"`;
};

const transMeas = function (tra) {
  if (tra === 1) return `<0.3`;
  if (tra === 2) return `0.3-0.4`;
  if (tra === 3) return `0.4-0.5`;
  if (tra === 4) return `0.5-0.6`;
  if (tra === 5) return `0.6-0.7`;
  if (tra === 6) return `<0.7-0.85`;
  if (tra === 7) return `0.85-1`;
  if (tra === 8) return `>1`;
};

const cloudMeas = function (clo) {
  if (clo === 1) return `0%-6%`;
  if (clo === 2) return `6%-19%`;
  if (clo === 3) return `19%-31%`;
  if (clo === 4) return `31%-44%`;
  if (clo === 5) return `44%-56%`;
  if (clo === 6) return `56%-69%`;
  if (clo === 7) return `69%-81%`;
  if (clo === 8) return `81%-94%`;
  if (clo === 9) return `94%-100%`;
};

const humMeas = function (hum) {
  if (hum === -4) return `0%-5%`;
  if (hum === -3) return `5%-10%`;
  if (hum === -2) return `10%-15%`;
  if (hum === -1) return `15%-20%`;
  if (hum === -0) return `20%-25%`;
  if (hum === 1) return `25%-30%`;
  if (hum === 2) return `30%-35%`;
  if (hum === 3) return `35%-40%`;
  if (hum === 4) return `40%-45%`;
  if (hum === 5) return `45%-50%`;
  if (hum === 6) return `50%-55%`;
  if (hum === 7) return `55%-60%`;
  if (hum === 8) return `60%-65%`;
  if (hum === 9) return `65%-70%`;
  if (hum === 10) return `70%-75%`;
  if (hum === 11) return `75%-80%`;
  if (hum === 12) return `80%-85%`;
  if (hum === 13) return `85%-90%`;
  if (hum === 14) return `90%-95%`;
  if (hum === 15) return `95%-99%`;
  if (hum === 16) return `100%`;
};

// show the weather condition's time(6 is timepoint, not magic number)
const curTime = (arrIndex) => {
  //show 'now' if time is now
  if (arrIndex === 0) return `NOW`;
  // show weather condition's time
  if (arrIndex > 0)
    return `${(
      time.getHours() +
      arrIndex * 6 -
      24 * Math.floor((time.getHours() + arrIndex * 6) / 24)
    )
      .toString()
      .padStart(2, 0)}:00`;
};

// Function to show a "Please wait" notification
const showWaitNotification = () => {
  fortables.innerHTML = `<tr><td>Please wait...</td></tr>`;
};

// Function to hide the "Please wait" notification
const hideWaitNotification = () => {
  fortables.innerHTML = "";
};

const showApiErrorNotification = () => {
  fortables.innerHTML = `<tr><td>Error fetching data. Please try again later.</td></tr>`;
};


const tableMarker = function (data) {
  fortables.innerHTML = "";
  data.forEach((el, i) => {
    const tag = ` 
  <tr>
    <td>${curTime(i)}</td>
    <td>${SeeingMeas(el.seeing)}</td>
    <td>${transMeas(el.transparency)}</td>
    <td>${cloudMeas(el.cloudcover)}</td>
    <td>${humMeas(el.rh2m)}</td>
    <td>${windMeas(el.wind10m.speed)}</td>
    <td>${el.wind10m.direction}</td>
    <td>${el.temp2m}</td>
  </tr>
  `;

    fortables.insertAdjacentHTML("beforeend", tag);
  });

  const fixedTitles = `
  <tr class="titles">
          <th>TIME</th>
          <th>SEEING</th>
          <th>TRANSPARENCY</th>
          <th>CLOUD COVER</th>
          <th>HUMIDITY</th>
          <th>WIND SPEED</th>
          <th>WIND DIRECTION</th>
          <th>TEMPERATURE(°C)</th>
  </tr>     
  `;
  fortables.insertAdjacentHTML("afterbegin", fixedTitles);
};

//select weather condition
const predictor = function (fdata, init, tpoint = 6, day) {
  // fdata: dataseries array in JSON data, init: initializing time, tpoint: timepoint
  //which array's index indicates current time's weather condition
  const arrIn = Math.floor(
    (curGMT() - +init.slice(-2) < 0 ? curGMT() : curGMT() - +init.slice(-2)) /
      tpoint
  );

  //select time window array between current time and after 24 hours
  const selectedData = fdata.filter((el, i) => {
    return i >= arrIn && i <= arrIn + 4 * day;
  });
  tableMarker(selectedData);
};

//async functions to get the weather broadcast from the API
const getWeather = async function (lng, lt) {
  showWaitNotification(); // Show notification before fetching data

  try {
    const res = await fetch(
      `http://www.7timer.info/bin/api.pl?lon=${lng}&lat=${lt}&product=astro&output=json`
    );
    console.log(res);

    if (!res.ok) {
      throw new Error(`API request failed with status: ${res.status}`);
    }

    const result = await res.json();

    hideWaitNotification(); // Hide notification after fetching data

    return result;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    showApiErrorNotification(); // Show error notification on failure
  }
};
//Leaf Map Library Function
const LeafLet = function (cont) {
  //obtain current device geolocation
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const { latitude } = position.coords;
        const { longitude } = position.coords;
        curlat = +latitude.toString().slice(0, 6);
        curlong = +longitude.toString().slice(0, 6);
        var map = L.map("map").setView([curlat, curlong], 14);
        var popup = L.popup()
          .setLatLng([curlat, curlong])
          .setContent("Now, I'm here")
          .openOn(map);
        // device location's forecast
        getWeather(curlong, curlat).then((rslt) => {
          const { dataseries: data, init: init } = rslt;
          console.log('run');
          predictor(data, init, 3, 1);
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        var popup = L.popup();

        function onMapClick(e) {
          const { lat: pickedlat, lng: pickedlng } = e.latlng;

          getWeather(pickedlng, pickedlat).then((rslt) => {
            const { dataseries: data, init: init } = rslt;
            predictor(data, init, 3, 1);
            console.log(data);
          });

          popup.setLatLng(e.latlng).setContent(`${cont}`).openOn(map);
        }
        map.on("click", onMapClick);
      },
      function () {
        alert("could not your position");
      }
    );
  // workarouund solution
};

LeafLet("Selected Location📍");

//test