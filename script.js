let body = document.querySelector("body");
let main = document.querySelector("main");
let allElems = document.querySelectorAll(".elem");
let allFullElems = document.querySelectorAll(".fullElem");
let closeFullElems = document.querySelectorAll(".close");
let theme = document.querySelector(".info button");
let form = document.querySelector(".add-task form");
let taskInput = document.querySelector(".add-task form input");
let taskDetailsInput = document.querySelector(".add-task form textarea");
let allTask = document.querySelector(".all-task");
let taskCheckbox = document.querySelector(".add-task form #check");

function changeTheme() {
  var theme = document.querySelector(".theme");
  var rootElement = document.documentElement;
  var flag = 0;

  theme.addEventListener("click", function () {
    if (flag == 0) {
      rootElement.style.setProperty("--pri", "#DCA54C");
      rootElement.style.setProperty("--sec", "#E4E2DD");
      rootElement.style.setProperty("--ter", "#3E2D1C");
      rootElement.style.setProperty("--tri1", "#C68B23");
      rootElement.style.setProperty("--tri2", "#7A5D37");
      rootElement.style.setProperty("--text", "#F5EDE3");
      rootElement.style.setProperty("--accent", "#1C140D");
      rootElement.style.setProperty("--bg", "#2A1E12");
      rootElement.style.setProperty("--btn", "#B57F19");
      flag = 1;
    } else if (flag == 1) {
      rootElement.style.setProperty("--pri", "#EABD7B");
      rootElement.style.setProperty("--sec", "#191919");
      rootElement.style.setProperty("--ter", "#EFE9E1");
      rootElement.style.setProperty("--tri1", "#CC9F3E");
      rootElement.style.setProperty("--tri2", "#6B5D4D");
      rootElement.style.setProperty("--text", "#2B2B2B");
      rootElement.style.setProperty("--accent", "#F7F5F1");
      rootElement.style.setProperty("--bg", "#FAF8F5");
      rootElement.style.setProperty("--btn", "#D6A24A");
      flag = 2;
    } else if (flag == 2) {
      rootElement.style.setProperty("--pri", "#f46a37");
      rootElement.style.setProperty("--sec", "#ffffff");
      rootElement.style.setProperty("--ter", "rgb(95, 51, 7)");
      rootElement.style.setProperty("--tri1", "#FEBA17");
      rootElement.style.setProperty("--tri2", "#74512D");
      rootElement.style.setProperty("--text", "#1a1a1a");
      rootElement.style.setProperty("--accent", "#361806");
      rootElement.style.setProperty("--bg", "#fff4ec");
      rootElement.style.setProperty("--btn", "rgb(233, 180, 23)");
      flag = 0;
    }
  });
}
changeTheme();

function openCards() {
  var nav = document.querySelector("nav");

  allElems.forEach(function (elem) {
    elem.addEventListener("click", function () {
      allFullElems[elem.id].style.display = "block";
      nav.classList.add("hidden");
    });
  });

  closeFullElems.forEach(function (back) {
    back.addEventListener("click", function () {
      allFullElems[back.id].style.display = "none";
      nav.classList.remove("hidden");
    });
  });
}
openCards();

function todoList() {
  var currentTask = [];

  if (localStorage.getItem("currentTask")) {
    currentTask = JSON.parse(localStorage.getItem("currentTask"));
  } else {
    console.log("Task list is Empty");
  }

  function renderTask() {
    let sum = ``;
    currentTask.forEach(function (elem, idx) {
      sum += `<div class="task">
                        <h5>${elem.task} <span class=${elem.imp}>imp</span></h5>
                        <button id=${idx}>Mark as Completed</button>
                    </div>
                    `;
    });

    allTask.innerHTML = sum;

    localStorage.setItem("currentTask", JSON.stringify(currentTask));

    document.querySelectorAll(".task button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentTask.splice(btn.id, 1);
        renderTask();
      });
    });
  }
  renderTask();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    currentTask.push({
      task: taskInput.value,
      details: taskDetailsInput.value,
      imp: taskCheckbox.checked,
    });
    taskInput.value = "";
    taskDetailsInput.value = "";
    taskCheckbox.checked = false;

    renderTask();
  });
}
todoList();

function dailyPlanner() {
  var dayPlanData = JSON.parse(localStorage.getItem("dayPlanData")) || {};

  var dayPlanner = document.querySelector(".day-planner");

  var hours = Array.from(
    { length: 18 },
    (e, idx) => `${6 + idx}:00 - ${7 + idx}:00`
  );

  var wholeDaySum = "";
  hours.forEach(function (elem, idx) {
    var savedData = dayPlanData[idx] || "";

    wholeDaySum =
      wholeDaySum +
      `<div class="day-planner-time">
                                        <p>${elem}</p>
                                        <input id=${idx} type="text" placeholder="..." value=${savedData}>
                                    </div>`;
  });

  dayPlanner.innerHTML = wholeDaySum;

  var dayPlannerInput = document.querySelectorAll(".day-planner input");
  dayPlannerInput.forEach((elem) => {
    elem.addEventListener("input", function () {
      dayPlanData[elem.id] = elem.value;

      localStorage.setItem("dayPlanData", JSON.stringify(dayPlanData));
    });
  });
}
dailyPlanner();

function motivationalQuote() {
  var motivationQuoteContent = document.querySelector(".motivation-2 h1");
  var motivationAuthor = document.querySelector(".motivation-3 h2");

  async function fetchQuote() {
    let response = await fetch("https://api.quotable.io/random");
    let data = await response.json();

    motivationQuoteContent.innerHTML = data.content;
    motivationAuthor.innerHTML = "-" + data.author;
  }

  fetchQuote();
}
motivationalQuote();

function pomodoroTimer() {
  let timer = document.querySelector(".pomo-timer h1");
  var startBtn = document.querySelector(".pomo-timer .start-timer");
  var pauseBtn = document.querySelector(".pomo-timer .pause-timer");
  var resetBtn = document.querySelector(".pomo-timer .reset-timer");
  var session = document.querySelector(".pomodoro-fullpage .session");
  var isWorkSession = true;

  let totalSeconds = 25 * 60;
  let timerInterval = null;

  function updateTimer() {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    timer.innerHTML = `${String(minutes).padStart("2", "0")}:${String(
      seconds
    ).padStart("2", "0")}`;
  }

  function startTimer() {
    clearInterval(timerInterval);

    if (isWorkSession) {
      timerInterval = setInterval(function () {
        if (totalSeconds > 0) {
          totalSeconds--;
          updateTimer();
        } else {
          isWorkSession = false;
          clearInterval(timerInterval);
          timer.innerHTML = "05:00";
          session.innerHTML = "Take a Break";
          session.style.backgroundColor = "blue";
          totalSeconds = 5 * 60;
        }
      }, 10);
    } else {
      timerInterval = setInterval(function () {
        if (totalSeconds > 0) {
          totalSeconds--;
          updateTimer();
        } else {
          isWorkSession = true;
          clearInterval(timerInterval);
          timer.innerHTML = "25:00";
          session.innerHTML = "Work Session";
          session.style.backgroundColor = "green";
          totalSeconds = 25 * 60;
        }
      }, 10);
    }
  }

  function pauseTimer() {
    clearInterval(timerInterval);
  }
  function resetTimer() {
    totalSeconds = 25 * 60;
    clearInterval(timerInterval);
    session.innerHTML = "Work Session";
    session.style.backgroundColor = "green";
    updateTimer();
  }
  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);
}
pomodoroTimer();

function dailyGoals() {
  var goalsData = JSON.parse(localStorage.getItem("goalsData")) || {};
  var today = new Date().toLocaleDateString();

  // reset goals automatically if day changed
  if (goalsData.date !== today) {
    goalsData = { date: today, goals: [] };
    localStorage.setItem("goalsData", JSON.stringify(goalsData));
  }

  var goalsContainer = document.querySelector(".all-goals");
  var goalForm = document.querySelector(".daily-goals-fullpage form");
  var goalInput = document.querySelector(".daily-goals-fullpage input");

  function renderGoals() {
    let sum = "";
    goalsData.goals.forEach((g, idx) => {
      sum += `<div class="goal ${g.completed ? "completed" : ""}">
                        <h3>${g.text}</h3>
                        <button data-id=${idx}>${
        g.completed ? "Done" : "Mark Done"
      }</button>
                    </div>`;
    });
    goalsContainer.innerHTML = sum;

    // button events
    document.querySelectorAll(".goal button").forEach((btn) => {
      btn.addEventListener("click", () => {
        let id = btn.getAttribute("data-id");
        goalsData.goals[id].completed = true;
        localStorage.setItem("goalsData", JSON.stringify(goalsData));
        renderGoals();
      });
    });
  }

  renderGoals();

  goalForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let value = goalInput.value.trim();
    if (!value) return;

    goalsData.goals.push({ text: value, completed: false });
    localStorage.setItem("goalsData", JSON.stringify(goalsData));
    goalInput.value = "";
    renderGoals();
  });
}
dailyGoals();

function weatherFunctionality() {
  var apiKey = null;/*removed API key for security purpose */
  var city = "Pune";

  var header1Time = document.querySelector(".header1 h1");
  var header1Date = document.querySelector(".header1 h2");
  var header2Temp = document.querySelector(".header2 h2");
  var header2Condition = document.querySelector(".header2 h4");
  var precipitation = document.querySelector(".header2 .precipitation");
  var humidity = document.querySelector(".header2 .humidity");
  var wind = document.querySelector(".header2 .wind");

  var data = null;

  async function weatherAPICall() {
    var response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
    );
    data = await response.json();

    header2Temp.innerHTML = `${data.current.temp_c}°C`;
    header2Condition.innerHTML = `${data.current.condition.text}`;
    wind.innerHTML = `Wind: ${data.current.wind_kph} km/h`;
    humidity.innerHTML = `Humidity: ${data.current.humidity}%`;
    precipitation.innerHTML = `Heat Index : ${data.current.heatindex_c}%`;
  }

  weatherAPICall();

  function timeDate() {
    const totalDaysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    var date = new Date();
    var dayOfWeek = totalDaysOfWeek[date.getDay()];
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var tarik = date.getDate();
    var month = monthNames[date.getMonth()];
    var year = date.getFullYear();

    header1Date.innerHTML = `${tarik} ${month}, ${year}`;

    if (hours > 12) {
      header1Time.innerHTML = `${dayOfWeek}, ${String(hours - 12).padStart(
        "2",
        "0"
      )}:${String(minutes).padStart("2", "0")}:${String(seconds).padStart(
        "2",
        "0"
      )} PM`;
    } else {
      header1Time.innerHTML = `${dayOfWeek}, ${String(hours).padStart(
        "2",
        "0"
      )}:${String(minutes).padStart("2", "0")}:${String(seconds).padStart(
        "2",
        "0"
      )} AM`;
    }
  }

  setInterval(() => {
    timeDate();
  }, 1000);
}
weatherFunctionality();
