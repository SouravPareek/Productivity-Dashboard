let body = document.querySelector("body");
let main = document.querySelector("main");
let allElems = document.querySelectorAll(".elem");
let allFullElems = document.querySelectorAll(".fullElem");
let closeFullElems = document.querySelectorAll(".close");
let theme = document.querySelector('.info button')
let form = document.querySelector('.add-task form')
let taskInput = document.querySelector('.add-task form input')
let taskDetailsInput = document.querySelector('.add-task form textarea')
let allTask = document.querySelector('.all-task')
let taskCheckbox = document.querySelector('.add-task form #check')

function changeTheme(){
    theme.addEventListener('click', function(){
        let icon = theme.querySelector('i');   // get the <i> tag

        if(icon.classList.contains("ri-sun-fill")){
            icon.className = "ri-moon-fill";
            theme.style.backgroundColor = "white"
            theme.style.color = "var(--tri1)"
        }
        else{
            icon.className = "ri-sun-fill";
            theme.style.backgroundColor = "var(--tri1)"
            theme.style.color = "white"
        }
    })
}
changeTheme();

function openCards(){
    allElems.forEach(function(elem){
        elem.addEventListener("click", function () {
            allFullElems[elem.id].style.display = 'block'
        });
    });

    closeFullElems.forEach(function(back){
        back.addEventListener("click", function () {
            allFullElems[back.id].style.display = 'none'
        });
    });
}
openCards();

function todoList(){
        var currentTask = []

        if (localStorage.getItem('currentTask')) {
            currentTask = JSON.parse(localStorage.getItem('currentTask'))
        } else {
            console.log('Task list is Empty');
        }


    function renderTask(){
        let sum = ``;
        currentTask.forEach(function(elem, idx){
            sum += `<div class="task">
                        <h5>${elem.task} <span class=${elem.imp}>imp</span></h5>
                        <button id=${idx}>Mark as Completed</button>
                    </div>
                    `
        })

        allTask.innerHTML = sum;

        localStorage.setItem('currentTask', JSON.stringify(currentTask));

        document.querySelectorAll('.task button').forEach(function (btn) {
            btn.addEventListener('click', function () {
                currentTask.splice(btn.id, 1)
                renderTask()
            })
        })
    }
    renderTask()

    form.addEventListener('submit', function(e){
        e.preventDefault();
        currentTask.push(
            {
                task: taskInput.value, 
                details: taskDetailsInput.value, 
                imp: taskCheckbox.checked
            }
        )
        taskInput.value = ''
        taskDetailsInput.value = ''
        taskCheckbox.checked = false;

        renderTask()
    })
}
todoList();

function dailyPlanner(){
    var dayPlanData = JSON.parse(localStorage.getItem('dayPlanData')) || {}

    var dayPlanner = document.querySelector('.day-planner')

    var hours = Array.from({ length: 18 }, (e, idx) => `${6 + idx}:00 - ${7 + idx}:00`)

    var wholeDaySum = ''
    hours.forEach(function (elem, idx) {
        var savedData = dayPlanData[idx] || ''
        
        wholeDaySum = wholeDaySum + `<div class="day-planner-time">
                                        <p>${elem}</p>
                                        <input id=${idx} type="text" placeholder="..." value=${savedData}>
                                    </div>`
        })

    dayPlanner.innerHTML = wholeDaySum


    var dayPlannerInput = document.querySelectorAll('.day-planner input')
    dayPlannerInput.forEach((elem)=>{
        elem.addEventListener('input',function(){
            dayPlanData[elem.id] = elem.value

            localStorage.setItem('dayPlanData', JSON.stringify(dayPlanData))
        })
    })

}
dailyPlanner();

function motivationalQuote() {
    var motivationQuoteContent = document.querySelector('.motivation-2 h1')
    var motivationAuthor = document.querySelector('.motivation-3 h2')

    async function fetchQuote() {
        let response = await fetch('http://api.quotable.io/random')
        let data = await response.json()

        motivationQuoteContent.innerHTML = data.content
        motivationAuthor.innerHTML = "-"+data.author
    }

    fetchQuote()
}
motivationalQuote()

function pomodoroTimer() {
    let timer = document.querySelector('.pomo-timer h1')
    var startBtn = document.querySelector('.pomo-timer .start-timer')
    var pauseBtn = document.querySelector('.pomo-timer .pause-timer')
    var resetBtn = document.querySelector('.pomo-timer .reset-timer')
    var session = document.querySelector('.pomodoro-fullpage .session')
    var isWorkSession = true

    let totalSeconds = 25 * 60
    let timerInterval = null

    function updateTimer() {
        let minutes = Math.floor(totalSeconds / 60)
        let seconds = totalSeconds % 60

        timer.innerHTML = `${String(minutes).padStart('2', '0')}:${String(seconds).padStart('2', '0')}`
    }

    function startTimer() {
        clearInterval(timerInterval)

        if (isWorkSession) {

            timerInterval = setInterval(function () {
                if (totalSeconds > 0) {
                    totalSeconds--
                    updateTimer()
                } else {
                    isWorkSession = false
                    clearInterval(timerInterval)
                    timer.innerHTML = '05:00'
                    session.innerHTML = 'Take a Break'
                    session.style.backgroundColor = 'blue'
                    totalSeconds = 5 * 60
                }
            }, 10)
        } else {


            timerInterval = setInterval(function () {
                if (totalSeconds > 0) {
                    totalSeconds--
                    updateTimer()
                } else {
                    isWorkSession = true
                    clearInterval(timerInterval)
                    timer.innerHTML = '25:00'
                    session.innerHTML = 'Work Session'
                    session.style.backgroundColor = 'green'
                    totalSeconds = 25 * 60
                }
            }, 10)
        }

    }

    function pauseTimer() {
        clearInterval(timerInterval)
    }
    function resetTimer() {
        totalSeconds = 25 * 60
        clearInterval(timerInterval)
        session.innerHTML = 'Work Session'
        session.style.backgroundColor = 'green'
        updateTimer()
    }
    startBtn.addEventListener('click', startTimer)
    pauseBtn.addEventListener('click', pauseTimer)
    resetBtn.addEventListener('click', resetTimer)
}
pomodoroTimer()

function dailyGoals() {
    var goalsData = JSON.parse(localStorage.getItem('goalsData')) || {}
    var today = new Date().toLocaleDateString()

    // reset goals automatically if day changed
    if (goalsData.date !== today) {
        goalsData = { date: today, goals: [] }
        localStorage.setItem('goalsData', JSON.stringify(goalsData))
    }

    var goalsContainer = document.querySelector('.all-goals')
    var goalForm = document.querySelector('.daily-goals-fullpage form')
    var goalInput = document.querySelector('.daily-goals-fullpage input')

    function renderGoals() {
        let sum = ''
        goalsData.goals.forEach((g, idx) => {
            sum += `<div class="goal ${g.completed ? 'completed' : ''}">
                        <h3>${g.text}</h3>
                        <button data-id=${idx}>${g.completed ? 'Done' : 'Mark Done'}</button>
                    </div>`
        })
        goalsContainer.innerHTML = sum

        // button events
        document.querySelectorAll('.goal button').forEach(btn => {
            btn.addEventListener('click', () => {
                let id = btn.getAttribute('data-id')
                goalsData.goals[id].completed = true
                localStorage.setItem('goalsData', JSON.stringify(goalsData))
                renderGoals()
            })
        })
    }

    renderGoals()

    goalForm.addEventListener('submit', function(e) {
        e.preventDefault()
        let value = goalInput.value.trim()
        if (!value) return

        goalsData.goals.push({ text: value, completed: false })
        localStorage.setItem('goalsData', JSON.stringify(goalsData))
        goalInput.value = ''
        renderGoals()
    })
}
dailyGoals()
