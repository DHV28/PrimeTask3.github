// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCSzTbYhygkAEratuYSLjziC8dAHxm_0kM",
    authDomain: "primetask-3b148.firebaseapp.com",
    databaseURL: "https://primetask-3b148-default-rtdb.firebaseio.com",
    projectId: "primetask-3b148",
    storageBucket: "primetask-3b148.appspot.com",
    messagingSenderId: "914891090322",
    appId: "1:914891090322:web:832ef0efe1205b8f33f94b"
};

firebase.initializeApp(firebaseConfig);

// Retrieve the selected start date and end date
let startDate = localStorage.getItem("startDate");
let endDate = localStorage.getItem("endDate");

// Reference the Firebase database
let teamMemberDB = firebase.database().ref('team-members/');
let taskDB = firebase.database().ref('task-details-form/');
let logDateDB = firebase.database().ref('log-time-dates/');
let editMemberRef = firebase.database().ref('edit-member-ref');

let memberKey = "";
const sevenDaysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let myChart;

// Normalize the date to ignore time components
const normalizedDate = (date) =>
{
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

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

    averageMinute = Math.floor(averageMinute)

    return [averageHour, averageMinute];
}

// Listen for changes in log-time-dates and process them
logDateDB.on("value", function(snapshot)
{
    let assignees = snapshot.val();
    let backlogElement = document.getElementById('backlog');
    backlogElement.innerHTML = ''; // Clear existing cards

    if (assignees)
    {
        let members = Object.keys(assignees);

        members.forEach((key) =>
        {
            let pastSevenDays = []
            let validLogTime = [0, 0, 0]; // hour, minute, totalDays

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
                            validLogTime = [
                                validLogTime[0] + logDates[date].dailyAccumulatedHr,
                                validLogTime[1] + logDates[date].dailyAccumulatedMin,
                                validLogTime[2] + 1
                            ];
                        }

                        if (withinSevenDays(date))
                        {
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
                }
            });

            if (validLogTime[0] > 0 || validLogTime[1] > 0)
            {
                createTeamMemberCard(key, validLogTime, pastSevenDays);
            }
        });
    }
});

// Check if a date is within the past seven days from today
const withinSevenDays = (date) => {
    let format = new Date(date)
    let formattedYear = format.getFullYear()
    let formattedMonth = String(format.getMonth() + 1).padStart(2, '0');
    let formattedDay = String(format.getDate()).padStart(2, '0');
    let formattedDate = `${formattedYear}-${formattedMonth}-${formattedDay}`;

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

// Function to create a team member card with edit and delete buttons
function createTeamMemberCard(key, logTime, pastSevenDays)
{
    let memberBox = document.createElement('div');
    memberBox.classList.add('member-box');
    memberBox.id = key;

    let memberInfo = document.createElement('div');
    memberInfo.classList.add('member-info');

    let memberName = document.createElement('span');
    memberName.className = 'member-name';
            

    let averageTime = calculateAverageTimeWorked(logTime[0], logTime[1], logTime[2]);
    let averageTimeCalc = document.createElement('span');
    averageTimeCalc.className = 'average-time';
    averageTimeCalc.textContent = `Avg Time/Day: ${averageTime[0]}h ${averageTime[1]}m`;

    // Create the chart icon dynamically
    let chartIcon = document.createElement('i');
    chartIcon.classList.add('fa-solid', 'fa-chart-column', 'chart-icon');
    chartIcon.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevents triggering the memberBox click event
    document.getElementById('chartPopupOverlay').style.display = 'block'; // Show popup
    const today = new Date();
    const todayDay = today.getDay();

    const newTupleList = pastSevenDays.slice(todayDay).concat(pastSevenDays.slice(0, todayDay));

    const daysList = newTupleList.map(tuple => tuple[0]);
    const hoursList = newTupleList.map(tuple => tuple[1]);
    const finalDaysList = daysList.map(day => sevenDaysName[day]);

        createBarChart(finalDaysList, hoursList);
    });


    let editIcon = document.createElement('i');
    editIcon.classList.add('fas', 'fa-pencil-alt');

    let actions = document.createElement('div');
    actions.classList.add('actions');

    memberInfo.appendChild(memberName);
    memberInfo.appendChild(averageTimeCalc);

    actions.appendChild(chartIcon);
    actions.appendChild(editIcon);
    actions.append(createCrossButton(key));

    memberBox.appendChild(memberInfo);
    memberBox.appendChild(actions);

    document.getElementById('backlog').appendChild(memberBox);

    teamMemberDB.child(key).on("value", function(snapshot)
    {
        let member = snapshot.val();

        if (member)
        {
            memberName.textContent = member.memberName;

            editIcon.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevents triggering the memberBox click event
                // editTeamMember(key, member);
                memberKey = key;
                const updateEditMember = {
                    memberKey: memberKey
                }
                editMemberRef.update(updateEditMember);
                window.location.href = 'edit_members_form.html';
            });
        }
    });
}

// Function to create cross (delete) button
function createCrossButton(key)
{
    let crossButton = document.createElement('button');
    crossButton.classList.add('btn');
    let crossIcon = document.createElement('i');
    crossIcon.classList.add('fas', 'fa-times', 'cross-icon');
    crossButton.appendChild(crossIcon);

    crossButton.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevents triggering the memberBox click event
    deletedMember = key;
    loadTasksForPopup(key);
    });


    return crossButton;
}

let deletedMember = ""

let doneButton = document.getElementById('done-button');

doneButton.addEventListener('click', (e) =>
{
    e.stopPropagation();

    taskDB.orderByChild('assigneeID').equalTo(deletedMember).once('value', snapshot =>
    {
        const tasks = snapshot.val();

        let activeTask = 0;
        if (tasks)
        {
            // Display tasks and allow reassignment
            Object.entries(tasks).forEach(([taskId, task]) =>
            {
                const status = task.status;

                if (status != 'Completed')
                {
                    activeTask = activeTask + 1
                }
            });
        }
        if (activeTask == 0)
        {
            deleteMember(deletedMember); // Delete the member
            popupOverlay.style.display = 'none'; // Close the popup
        }
        else
        {
            alert("There are still tasks need to be assigned.")
        }
    })
});


// Function to load tasks for a team member and check if deletion is possible
function loadTasksForPopup(memberId)
{
    popupOverlay.style.display = 'block';
    const taskList = document.querySelector('.task-card-list ul');
    taskList.innerHTML = '';

    taskDB.orderByChild('assigneeID').equalTo(memberId).once('value', snapshot =>
    {
        const tasks = snapshot.val();

        if (tasks)
        {
            let activeTask = 0;
            // Display tasks and allow reassignment
            Object.entries(tasks).forEach(([taskId, task]) =>
            {
                const status = task.status;

                if (status != 'Completed')
                {
                    activeTask = activeTask + 1;
                    const taskCard = createTaskCard(task, taskId);
                    taskList.appendChild(taskCard);
                }
            });
            if (activeTask == 0)
            {
                // No tasks assigned, allow direct deletion
                const noTasksMessage = document.createElement('li');
                noTasksMessage.textContent = 'No tasks assigned to this member.';
                taskList.appendChild(noTasksMessage);
            }
        }
        else
        {
            // No tasks assigned, allow direct deletion
            const noTasksMessage = document.createElement('li');
            noTasksMessage.textContent = 'No tasks assigned to this member.';
            taskList.appendChild(noTasksMessage);
        }
    });
}

// Function to reassign tasks to other members
function reassignTasks(memberId, callback)
{
    taskDB.orderByChild('assigneeID').equalTo(memberId).once('value', snapshot => {
        const tasks = snapshot.val();
        if (tasks) {
            Object.keys(tasks).forEach(taskId =>
            {
                // Assign tasks to a new member or handle reassignment logic
                taskDB.child(taskId).update({ assigneeID: 'newMemberId' }); // Update to new member's ID
            });
        }

        // Once all tasks are reassigned, invoke callback
        callback();
    });

}

// Function to delete the team member
function deleteMember(memberId)
{
    teamMemberDB.child(memberId).remove()
        .then(() => {
            logDateDB.child(memberId).remove()
                .then(() => {
                    alert('Team member successfully deleted.');
                    popupOverlay.style.display = 'none'; // Close the popup
                })
        })
        .catch(error => {
            console.error('Error deleting team member:', error);
        });
    deletedMember = ""
}



// Function to create task cards dynamically
function createTaskCard(task, taskId)
{
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');

    taskCard.addEventListener('click', () =>
    {
        localStorage.setItem("taskDetails", taskId);
        window.location.href = `only_edit_assignee.html?taskId=${taskId}`;
    });

    const taskHeader = document.createElement('div');
    taskHeader.classList.add('task-header');
    const taskName = document.createElement('span');
    taskName.className = 'task-name';
    taskName.textContent = task.taskName;

    const taskPriority = document.createElement('span');
    taskPriority.className = `priority ${task.taskPriority.toLowerCase()}`;
    taskPriority.textContent = task.taskPriority.charAt(0).toUpperCase() + task.taskPriority.slice(1);

     // Add horizontal line
    let hr = document.createElement('hr');

    // Define the valid tags and ensure they are displayed in uppercase
    const validTags = ['front-end', 'back-end', 'api', 'ui/ux', 'framework', 'testing', 'database'];
    let taskTags = task.taskTag ? task.taskTag.toLowerCase().split(',').map(tag => tag.trim()) : [];  // Handle multiple tags

    const taskInfo = document.createElement('div');
    taskInfo.classList.add('task-info');

    // Story point
    const storyPoint = document.createElement('p');
    storyPoint.textContent = `Story Point: ${task.taskStoryPoint || 'N/A'}`;

    // Task type
    const taskType = document.createElement('p');
    taskType.textContent = `Type: ${task.taskType || 'General'}`;

    taskHeader.appendChild(taskName);
    taskHeader.appendChild(taskPriority);
    taskCard.appendChild(taskHeader);
    taskCard.appendChild(hr);
    taskCard.appendChild(storyPoint);
    taskCard.appendChild(taskType);
    taskCard.appendChild(taskInfo);

    // Task tags (Display only valid tags in uppercase)
    if (taskTags.length > 0 && taskTags[0] !== 'none')
    {  // CHANGED: Only display tags if they exist and are not 'none'
        let taskTagsElem = document.createElement('p');
        taskTagsElem.innerHTML = 'Tags: ';

        taskTags.forEach(tag => {
            let tagElem = document.createElement('span');
            tagElem.className = `tag ${tag.replace(/\//g, '-')}`;  // Sanitize tag classes

            // Check if the tag is one of the predefined valid tags, then convert to uppercase
            if (validTags.includes(tag))
            {
                tagElem.textContent = tag.toUpperCase();
            }
            else
            {
                // If not predefined, still convert to uppercase for display consistency
                tagElem.textContent = tag.toUpperCase();
            }

            taskTagsElem.appendChild(tagElem);
            taskTagsElem.innerHTML += ' ';  // Add space between tags
        });

        taskCard.appendChild(taskTagsElem);
    }

    return taskCard;
}

// Function to edit a team member
// function editTeamMember(key, member)
// {
//     // const editUrl = `edit_members_form.html?key=${key}&name=${member.memberName}&email=${member.memberEmail}&password=${member.memberPassword}`;
//     window.location.href = 'edit_members_form.html';
// }

// Popup event listeners for the Reassign Task popup close button
document.getElementById('closePopup').addEventListener('click', () => {
    document.getElementById('popupOverlay').style.display = 'none';
});

// Close Reassign Task popup when clicking outside the popup box
document.getElementById('popupOverlay').addEventListener('click', (event) => {
    if (event.target === document.getElementById('popupOverlay')) {
        document.getElementById('popupOverlay').style.display = 'none';
    }
});

// Popup event listeners for the Bar Chart icon popup close button
document.getElementById('chartPopupClose').addEventListener('click', () => {
    document.getElementById('chartPopupOverlay').style.display = 'none';
});

// Close Bar Chart popup when clicking outside the popup box
document.getElementById('chartPopupOverlay').addEventListener('click', (event) => {
    if (event.target === document.getElementById('chartPopupOverlay')) {
        document.getElementById('chartPopupOverlay').style.display = 'none';
    }
});

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
        }
    });
}
