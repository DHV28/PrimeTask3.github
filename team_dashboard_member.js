// Code for extracting the login member
let teamMember = localStorage.getItem('logged-in-user')
// console.log(teamMember)
teamMember = JSON.parse(teamMember)
let memberID = teamMember.ID
// console.log(teamMember.ID)
// console.log(memberID)

//Dummy value for teamMember
// let teamMember = "-O8EjJGAngvIjOucQnub"

// Retrieve the selected start date and end date
let startDate = localStorage.getItem("startDateMember");
let endDate = localStorage.getItem("endDateMember");

// Variables of storing team member details
let memberName = ""
let memberLogTimes = [0,0,0] // hour, minute, totalDays
let pastSevenDays = [] // I will store each in (day,workingHours) 
                       //day 0 - 6 : Sunday - Saturday

let myChart;
const sevenDaysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCSzTbYhygkAEratuYSLjziC8dAHxm_0kM",
    authDomain: "primetask-3b148.firebaseapp.com",
    databaseURL: "https://primetask-3b148-default-rtdb.firebaseio.com",
    projectId: "primetask-3b148",
    storageBucket: "primetask-3b148.appspot.com",
    messagingSenderId: "914891090322",
    appId: "1:914891090322:web:832ef0efe1205b8f33f94b",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Retrive the member details - name
let teamMemberDB = firebase.database().ref('team-members/');

//Retrieve the log date database
let logDateDB = firebase.database().ref('log-time-dates/');

// Listen for changes in log-time-dates and process them
logDateDB.on("value", function(snapshot) 
{
    let assignees = snapshot.val();

    if (assignees) 
    {
        let members = Object.keys(assignees);

        members.forEach((key) => 
        {
            if (key === memberID){
                firebase.database().ref('log-time-dates/' + key + '/').on("value", function(snapshot) 
                {
                    let logDates = snapshot.val();
                
                    if (logDates) 
                    {

                        let dates = Object.keys(logDates);
                        let processedDays = new Set(); // Initialize processedDays here

                        dates.forEach((date) => 
                        {
                            
                            if (normalizedDate(new Date(date)) >= normalizedDate(new Date(startDate)) &&
                                normalizedDate(new Date(date)) <= normalizedDate(new Date(endDate))) 
                            {
                                memberLogTimes = [
                                    memberLogTimes[0] + logDates[date].dailyAccumulatedHr,
                                    memberLogTimes[1] + logDates[date].dailyAccumulatedMin,
                                    memberLogTimes[2] + 1
                                ];
                            }

                            if (withinSevenDays(date)) 
                            {
                                console.log(date)
                                let dayOfWeek = (new Date(date)).getDay();
                                let accumulatedHr = logDates[date].dailyAccumulatedHr || 0;
                                pastSevenDays.push([dayOfWeek, accumulatedHr]);
                                processedDays.add(dayOfWeek);
                            }
                        });

                        for (let i = 0; i < 7; i++) 
                        {
                            if (!processedDays.has(i)) 
                            {
                                pastSevenDays.push([i, 0]);
                            }
                        }

                        pastSevenDays.sort((a, b) => a[0] - b[0]);

                        displayAverageTime();
                    }
                });
            }
        });
    }
});

// Normalize the date to ignore time components
const normalizedDate = (date) => 
    {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

// Check if a date is within the past seven days from today
const withinSevenDays = (date) => {
    let format = new Date(date)
    let formattedYear = format.getFullYear()
    let formattedMonth = String(format.getMonth() + 1).padStart(2, '0');
    let formattedDay = String(format.getDate()).padStart(2, '0');
    let formattedDate = `${formattedYear}-${formattedMonth}-${formattedDay}`; 

    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');
    let completeToday = `${year}-${month}-${day}`;

    let pastSevenDays = [];

    // Find the past seven days
    for (let i = 0; i < 7; i++) {
        let date = new Date();
        date = date.setDate(date.getDate() - i)
        
        pastSevenDays.push(new Date(date)); // Push a copy of the current date
    }

    pastSevenDays = pastSevenDays.map(date => date.toISOString().split('T')[0]);
    
    return pastSevenDays.includes(formattedDate)
}

// load the team member database to find member name because it is possible the team member dont have log date
teamMemberDB.on("value", function(snapshot){
    let members = snapshot.val();
    if (members){
        let member = Object.keys(members);

        member.forEach((key) => {
            if (key === memberID){
                memberName = members[key].memberName;
                document.getElementById("memberName").innerText = memberName;
            }
        });
    }
});



function displayAverageTime() {
    let totalDaysWorked = memberLogTimes[2];
    let [averageHour, averageMinute] = calculateAverageTimeWorked(memberLogTimes[0], memberLogTimes[1], totalDaysWorked);

    let averageTimeText = ` ${averageHour} hours and ${averageMinute} minutes`;
    document.getElementById("averageTime").textContent = averageTimeText;
}



// Function to calculate average time worked
function calculateAverageTimeWorked(hour, minute, totalDays)
{
    let averageHour = 0;
    let averageMinute = 0;
    hour = Number(hour);
    minute = Number(minute);
    totalDays = Number(totalDays);

    minute += (hour * 60);
    averageMinute = (minute / totalDays);

    if (averageMinute >= 60)
    {
        averageHour += Math.floor(averageMinute / 60);
        averageMinute %= 60;
    }
    
    if (!averageMinute){
        averageMinute = 0
    }

    averageMinute = Math.floor(averageMinute)

    return [averageHour, averageMinute];
}


// create bar chart
function createBarChart(xAxis, yAxis) 
{
    var barColors = [
        getComputedStyle(document.documentElement).getPropertyValue('--bar-color-1').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--bar-color-2').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--bar-color-3').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--bar-color-4').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--bar-color-5').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--bar-color-6').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--bar-color-7').trim()
    ];

    // Remove the chart if it already exists
    if (myChart) {
        myChart.destroy();
    }

    // Create a new chart instance
    myChart = new Chart(document.getElementById("myChart"), {
        type: "bar",
        data: {
            labels: xAxis,
            datasets: [{
                backgroundColor: barColors,
                data: yAxis
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Hours Worked for the Last 7 Days",
                    font: {
                        family: 'Poppins',  
                        size: 20
                    }
                },
                datalabels: {
                    display: true,
                    color: 'black',
                    anchor: 'end',
                    align: 'top',
                    font: {
                        family: 'Poppins',  
                        size: 10,
                        weight: 'bold'
                    },
                    formatter: function(value) {
                        return value === 0 ? null : value;
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Hours',
                        font: {
                            family: 'Poppins',  
                            size: 16
                        }
                    },
                    ticks: {
                        font: {
                            family: 'Poppins',  
                            size: 12
                        },
                        stepSize: 10
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Days',
                        font: {
                            family: 'Poppins',  
                            size: 16
                        }
                    },
                    ticks: {
                        font: {
                            family: 'Poppins',  
                            size: 12
                        }
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}


// bar chart button
let barChartButton = document.getElementById("bar-chart-button");
barChartButton.addEventListener("click", (event) =>
{
    event.stopPropagation();
    let popup = document.getElementById("popupOverlay");
    popup.style.display = "block";

    const today = new Date();
    const todayDay = today.getDay();

    const newTupleList = pastSevenDays.slice(todayDay).concat(pastSevenDays.slice(0, todayDay));

    const daysList = newTupleList.map(tuple => tuple[0]);
    const hoursList = newTupleList.map(tuple => tuple[1]);
    const finalDaysList = daysList.map(day => sevenDaysName[day]);

    createBarChart(finalDaysList, hoursList);
});

// close popup
let closePopup = document.getElementById("closePopup");
closePopup.addEventListener("click", (event) =>
{
    event.stopPropagation();
    let popup = document.getElementById("popupOverlay");
    popup.style.display = "none";
});