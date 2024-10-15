// Initialize Firebase 
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

// Reference to Firebase Database
let sprintDB = firebase.database().ref("sprints");
let primeTaskDB = firebase.database().ref("task-details-form");

// Variables to store sprint and task data
// let sprintData = [];
// let taskData = {};
// 
// 
// // Fetch Sprint Data with Correct Key Names
// function fetchSprintData() 
// {
//     sprintDB.once('value')
//         .then((snapshot) => {
//             const sprints = snapshot.val();
// 
//             if (sprints) 
//             {
//                 // Ensure that sprints are mapped correctly, handling missing fields
//                 sprintData = Object.entries(sprints).map(([key, value]) => ({
//                     key,
//                     startDate: value.start ? value.start : "Missing Start Date",
//                     endDate: value.end ? value.end : "Missing End Date",
//                 }));
// 
//                 fetchTasksForSprints(); // Fetch tasks for sprints
//             } 
//             else 
//             {
//                 console.warn("No sprints found.");
//             }
//         })
//         .catch((error) => {
//             console.error("Error fetching sprint data:", error);
//         });
// }

// // Fetch Tasks with Sprint Key Matching and Use taskStoryPoint
// function fetchTasksForSprints() {
//     console.log("Fetching tasks for each sprint...");
// 
//     let tasksPromises = sprintData.map((sprint) =>
//         primeTaskDB.once('value')
//             .then((snapshot) => {
//                 const tasks = snapshot.val() || {};
// 
//                 // Filter tasks that belong to the current sprint
//                 const sprintTasks = Object.values(tasks).filter(
//                     task => task.sprintID === sprint.key
//                 );
// 
//                 if (sprintTasks.length === 0) {
//                     console.warn(`No tasks found for Sprint ${sprint.key}`);
//                 }
// 
//                 // Extract taskStoryPoint values, ensuring valid numbers
//                 const storyPoints = sprintTasks.map(task => {
//                     const point = parseInt(task.taskStoryPoint, 10);
//                     return isNaN(point) ? 0 : point; // Default to 0 if invalid
//                 });
// 
//                 taskData[sprint.key] = storyPoints;
// 
//                 console.log(`Tasks for Sprint ${sprint.key} - Story Points:`, storyPoints);
//             })
//             .catch((error) => {
//                 console.error(`Error fetching tasks for sprint ${sprint.key}:`, error);
//             })
//     );
// 
//     Promise.all(tasksPromises)
//         .then(() => {
//             console.log("All tasks fetched successfully.");
//             displaySprintAndTaskData(); // Display the data
//         })
//         .catch((error) => {
//             console.error("Error fetching some tasks:", error);
//         });
// }

// // Display Sprint Data and Story Points
// function displaySprintAndTaskData() {
//     sprintData.forEach(sprint => {
//         const sprintKey = sprint.key;
//         const storyPoints = taskData[sprintKey] || [];
// 
//         console.log(`Sprint: ${sprintKey}`);
//         console.log(`Start Date: ${sprint.startDate}, End Date: ${sprint.endDate}`);
//         console.log(`Task Story Points: ${storyPoints.join(', ')}`);
//     });
// }
// 
// // Start the process by calling fetchSprintData
// fetchSprintData();


// Variables for modal, buttons, and container
var modal = document.getElementById("sprintModal");
var btn = document.getElementById("openFormBtn");  
var span = document.getElementsByClassName("close")[0];
var container = document.querySelector('.container');

let isEditing = false;  // Track if we are editing an existing sprint or creating a new one
let currentEditingKey = "";  

// Open the modal for creating a new sprint
btn.onclick = function () 
{
    clearForm();  // Clear the form for new sprint creation
    isEditing = false;  // Not in edit mode
    modal.style.display = "block";
    container.classList.add("modal-active"); // Blur the container
};

// Clear the form fields
function clearForm() 
{
    document.getElementById('sprintName').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
}

// Close the modal and remove the blur effect
span.onclick = function () 
{
    modal.style.display = "none";
    container.classList.remove("modal-active"); // Unblur the container
};

window.onclick = function (event) 
{
    if (event.target == modal) 
    {
        modal.style.display = "none";
        container.classList.remove("modal-active"); // Unblur the container
    }
};

// Function to create the title bar
function createTitleBar() 
{
    let title_bar = document.createElement('div');
    title_bar.className = 'title-box';

    let sprintContent = document.createElement('div');
    sprintContent.className = 'sprint-content';

    let sprintName = document.createElement('span');
    sprintName.className = 'sprint-name';
    sprintName.textContent = "Sprint Name";

    let startTime = document.createElement('span');
    startTime.className = 'normal-info';
    startTime.textContent = "Start Date";

    let endTime = document.createElement('span');
    endTime.className = 'normal-info';
    endTime.textContent = "End Date";

    let status = document.createElement('span');
    status.className = 'normal-info';
    status.textContent = "Status";

    let forcedStart = document.createElement('div');
    forcedStart.className = 'title-sprint-button';

    let editColumn = document.createElement('div');
    editColumn.className = 'title-sprint-button';

    let deleteColumn = document.createElement('div');
    deleteColumn.className = 'title-sprint-button';

    sprintContent.appendChild(sprintName);
    sprintContent.appendChild(startTime);
    sprintContent.appendChild(endTime);
    sprintContent.appendChild(status);
    sprintContent.appendChild(forcedStart);
    sprintContent.appendChild(editColumn);
    sprintContent.appendChild(deleteColumn)

    title_bar.appendChild(sprintContent);
    return title_bar;
}

function generateDateArray(startDate, endDate) 
{
    let start = new Date(startDate);
    let end = new Date(endDate);
    let dateArray = [];

    while (start <= end) {
        let year = start.getFullYear();
        let month = String(start.getMonth() + 1).padStart(2, '0');
        let day = String(start.getDate()).padStart(2, '0');
        dateArray.push(`${year}-${month}-${day}`);
        start.setDate(start.getDate() + 1);
    }

    return dateArray; // Return the array of dates
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');        
    return `${year}-${month}-${day}`;
}

// Store the current active sprint
let currentActiveSprint = ""; 

// Function to create sprint boxes dynamically
function createSprintCard(sprint, key) 
{
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');
    let completeDay = `${year}-${month}-${day}`;

    // Create sprint box container
    let sprintBox = document.createElement('div');
    sprintBox.classList.add('sprint-box');

    // Create sprint content container
    let sprintContent = document.createElement('div');
    sprintContent.className = 'sprint-content';

    // Sprint name
    let sprintName = document.createElement('span');
    sprintName.className = 'sprint-name';
    sprintName.textContent = sprint.name;

    // Sprint start time
    let startTime = document.createElement('span');
    startTime.className = 'normal-info';
    startTime.textContent = sprint.start;

    // Sprint end time
    let endTime = document.createElement('span');
    endTime.className = 'normal-info';
    endTime.textContent = sprint.end;

    // Sprint status
    let status = document.createElement('span');
    status.className = 'normal-info';

    // Calculate the total days between the start date and end date.
    let totalDate = 0
    let startDate = new Date(sprint.start);
    let endDate = new Date(sprint.end);
    let dateArray = [];  // The date range

    // Find out the dates within between the start and end date.
    let currentDate = new Date(sprint.start);
    while (currentDate <= endDate) {
        dateArray.push(formatDate(currentDate));
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }
    
    // Get the time difference in milliseconds
    let timeDifference = endDate - startDate; 
    
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const totalDays = timeDifference / millisecondsPerDay;   // The total days within the date range


    // Fill in the correct status for the sprint
    if (sprint.status === "Not Started") 
    {
        if (new Date(sprint.start) > new Date(completeDay)) 
        {
            status.textContent = "Not Started";
        } 
        else 
        {
            status.textContent = "Active";
        }
    } 
    else if (new Date(sprint.start) < new Date(completeDay) || sprint.status === "Completed") 
    {
        status.textContent = "Completed";
    } 
    else 
    {
        status.textContent = "Active";
    }

    sprintDB.child(key).update(
    {
        status: status.textContent
    });

    // Grey out the completed sprint
    if (status.textContent === "Completed") 
    {
        sprintBox.classList.add('completed-sprint');
    }

    // Create the main container for the start or stop button
    let startOrStopButton = document.createElement('div');
    if (status.textContent !== 'Completed') 
    {
        startOrStopButton.classList.add('sprint-button');

        const button = document.createElement('button');

        if (status.textContent === 'Active') 
        {
            button.textContent = 'Stop';
        } 
        else if (status.textContent === 'Not Started') 
        {
            button.textContent = 'Start';
        }

        button.classList.add('inner-button');
        startOrStopButton.appendChild(button);

        startOrStopButton.addEventListener('click', (e) => 
        {
            e.stopPropagation(); 

            // Update the status for the forced stop or start sprint
            if (button.textContent === 'Stop') 
            {
                sprintDB.child(key).update(
                {
                    end: completeDay,
                    status: "Completed"
                });

                // All the task in the sprint should be moved to 'Completed' status
                let thisSprint = firebase.database().ref("sprints/" + key + "/task-details-form")

                thisSprint.on("value", function(snapshot)
                {
                    let tasks = snapshot.val()

                    if (tasks)
                    {
                        let taskKeys = Object.keys(tasks);

                        taskKeys.forEach((key) => 
                        {
                            const taskData = tasks[key];
                            const taskStatus = taskData.status; 

                            if (taskStatus === "Not Started" || taskStatus === "In Progress")
                            {
                                thisSprint.child(key).update({
                                    inSprint: false,
                                })
    
                                primeTaskDB.child(key).update({
                                    inSprint: false,
                                })
                            }
                            else
                            {
                                thisSprint.child(key).update({
                                    status: "Completed"
                                })
    
                                primeTaskDB.child(key).update({
                                    status: "Completed"
                                })
                            }
                        })
                    }
                })
                button.textContent = "Completed"; // Change button text to indicate completion
            } 
            else 
            {
                // The sprint can only be forced start if there is no 'Active' sprint.
                if (currentActiveSprint === undefined) 
                { 
                    // total story point when sprint start (the very initial one)
                    // later wan do this minus accordingly to the inside array one (for each day)
                    let totalStoryPoints = 0;
                    let sprintDates = [];
                    let taskDataRef = firebase.database().ref("sprints/" + key + "/task-details-form");
                    let endValue;
                    const thisSprint = firebase.database().ref("sprints/" + key + "/end");

                    thisSprint.once("value", function(snapshot) {
                        endValue = snapshot.val();
                    });

                    taskDataRef.once("value", function(snapshot) 
                    {
                        let tasks = snapshot.val();
                        
                        if (tasks) 
                        {
                            let taskKeys = Object.keys(tasks);

                            taskKeys.forEach((taskKey) => 
                            {
                                const task = tasks[taskKey];
                                totalStoryPoints += Number(task.taskStoryPoint);
                            });
                        }

                        sprintDates = generateDateArray(completeDay, endValue);

                        sprintDB.child(key).update({
                            start: completeDay,
                            status: "Active",
                            storyPoints: totalStoryPoints, // if got task edited or deleted update this oso
                            dates: sprintDates // later update completed story points in sprintbacklog js
                        });

                        button.textContent = "Stop"; 
                        currentActiveSprint = sprint; 
                    });
                } 
                else 
                {
                    let activeSprintName = currentActiveSprint.name;
                    alert(`Cannot force start as ${activeSprintName} is currently active. Please deactivate the sprint.`);
                    return;
                }
            }
        });
    } 
    else 
    {
        // A hidden button 
        startOrStopButton.className = 'title-sprint-button';
    }

    // Create the edit button in the sprint box
    let editButton = document.createElement('div');
    if (status.textContent === 'Not Started') 
    {
        editButton.classList.add('sprint-button');

        const button = document.createElement('button');
        button.textContent = "Edit";
        button.classList.add('inner-button');

        editButton.appendChild(button);

        // Open the form for editing
        editButton.addEventListener('click', (e) => 
        {
            e.stopPropagation();  

            // Populate the form with existing sprint data
            document.getElementById('sprintName').value = sprint.name;
            document.getElementById('startDate').value = sprint.start;
            document.getElementById('endDate').value = sprint.end;

            isEditing = true;  
            currentEditingKey = key;  

            modal.style.display = "block";  
            container.classList.add("modal-active");  // Add blur effect
        });
    } 
    else 
    {
        // A hidden button
        editButton.className = 'title-sprint-button';
    }

    let deleteButton = document.createElement('div');

    if(status.textContent === 'Not Started')
    {
        // create the delete sprint button
        deleteButton.classList.add('sprint-button');
        const delete_button = document.createElement('button')
        delete_button.textContent = "Delete";
        delete_button.classList.add('inner-button');
        deleteButton.appendChild(delete_button);

        deleteButton.addEventListener('click' , (e) => 
        {
            e.stopPropagation();

            if(confirm(' Are you sure you want to delete the sprint?')) 
            {
                // The tasks belonged to the sprint should be back to the product backlog for other sprint to choose
                firebase.database().ref("sprints/" + key + "/task-details-form").on("value",function(snapshot)
                {
                    let tasks = snapshot.val()

                    if (tasks)
                    {
                        let allTasks = Object.keys(tasks);

                        allTasks.forEach((taskKey) => 
                        {
                            primeTaskDB.child(taskKey).update({
                                inSprint: false,
                                sprintID: null
                            })
                        })
                    }
                });
                
                sprintDB.child(key).remove()
                .then(() => 
                {
                    alert('Sprint has been successfully deleted');
                    sprintBox.remove();
                })
                .catch(error => 
                {
                    console.error('Some error has occured while deleting the sprint:' , error);
                });
            }
        });
    }
    else
    {
        // A hidden button
        deleteButton.className = 'title-sprint-button';
    }

    sprintContent.appendChild(sprintName);
    sprintContent.appendChild(startTime);
    sprintContent.appendChild(endTime);
    sprintContent.appendChild(status);

    if (sprint.status === "Active" || sprint.status === "Completed") {
        // Create the chart icon dynamically
        let chartIcon = document.createElement('i');
        // chartIcon.classList.add('fa-solid', 'fa-chart-column', 'chart-icon');
        chartIcon.classList.add('fa-solid', 'fa-line-chart', 'chart-icon');
        chartIcon.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevents triggering the sprintBox click event
            document.getElementById('chartPopupOverlay').style.display = 'block'; // Show popup overlay
            // const xValues = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10"];
            // let completedStoryPointsPerDay = [];

            let datesDB = firebase.database().ref("sprints/" + key + "/dailyStoryPointArray");
            datesDB.once("value", (snapshot) => {
                const dates = snapshot.val();
                // const totalDays = dateArray.length;
                const completedStoryPointsPerDay = [sprint.storyPoints];

                if (dates) {
                    const object = Object.keys(dates)
                    let currentDate = new Date(sprint.start)
                    //currentDate.setDate(currentDate.getDate() + 1);

                    // loop through dates object
                    object.forEach((date) => {
                        if (date === formatDate(currentDate)) {
                            currentDate.setDate(currentDate.getDate() + 1);
                            // const completedStoryPoints = dates[date];
                            const completedStoryPoints = dates[date].storyPoint;
                            completedStoryPointsPerDay.push(completedStoryPoints);
                        }
                        else {
                            let nextDate = new Date(date);
                            let daysDifference = (nextDate - currentDate) / (1000 * 60 * 60 * 24);
                            // completedStoryPointsPerDay.push(completedStoryPointsPerDay[-1]);
                            //completedStoryPointsPerDay.push(completedStoryPointsPerDay[completedStoryPointsPerDay.length - 1]);
                            for (let i = 0; i < daysDifference; i++) {
                                completedStoryPointsPerDay.push(completedStoryPointsPerDay[completedStoryPointsPerDay.length - 1]);
                                currentDate.setDate(currentDate.getDate() + 1); // Increment current date for each missing day
                            }

                            const completedStoryPoints = dates[date].storyPoint;
                            completedStoryPointsPerDay.push(completedStoryPoints);

                            // Move to the next day after adding the points for the current date
                            currentDate.setDate(currentDate.getDate() + 1);

                        }
                        
                    })  
                    

                    // yvalue: total story points - completed story points
                    const yArray = [sprint.storyPoints];
                    for (let i = 1; i < completedStoryPointsPerDay.length; i++) {
                        
                        console.log(Number(sprint.storyPoints - completedStoryPointsPerDay[i]))
                        yArray.push(Number(sprint.storyPoints - completedStoryPointsPerDay[i]));
                    }
                    
                    const lst = ["Initial Estimate"];
                    // const lst2 = [sprint.storyPoints]
                    const xValues = lst.concat(dateArray);
                    // const yValues = completedStoryPointsPerDay;
                    const yValues = yArray;
                    // const yValues = lst2.concat(yArray);
                    if (sprint.storyPoints != 0) {
                        showBurnDown(xValues, yValues, sprint.storyPoints);
                    }
                    else {
                        alert("No story points available for this sprint.");
                        showBurnDown([], [], 0);
                    }


                }
            });
                    
        });
        sprintContent.appendChild(chartIcon);

    }

    if (sprint.status === "Not Started"){
        // A hidden button
        // chartIcon.className = 'title-sprint-button';
        let chartIcon = document.createElement('i');
        // chartIcon.classList.add('fa-solid', 'fa-chart-column', 'chart-icon');

        chartIcon.classList.add('chart-icon-not-started');
        sprintContent.appendChild(chartIcon);


        // chartIcon.style.display = "none";

    }

    sprintContent.appendChild(startOrStopButton);
    sprintContent.appendChild(editButton);
    sprintContent.appendChild(deleteButton);

    sprintBox.appendChild(sprintContent);

    sprintBox.addEventListener('click', (e) => 
    {
        
        if (status.textContent == "Not Started")
        {
            localStorage.setItem('sprintID', key);
            
            window.location.href = "pb_sprint_backlog.html";
        }
        else
        {
            // Store the selected sprint key
            localStorage.setItem("selectedSprint", key);
            localStorage.setItem("sprintStatus",sprint.status)
            
            window.location.href = "sprint_backlog.html";
        }
    });

    document.getElementById('backlog').appendChild(sprintBox);
}

// Event listener for form submission to create or update a sprint
document.querySelector('form').addEventListener('submit', function (event) 
{
    event.preventDefault();  

    let sprintName = document.getElementById('sprintName').value;
    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value;

    // Get today's date in YYYY-MM-DD format
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');
    let completeToday = `${year}-${month}-${day}`;

    // Validate that the start date is not today or in the past
    if (new Date(startDate) <= new Date(completeToday)) 
    {
        alert("Start date cannot be today or in the past.");
        return;
    }

    // Validate that the end date is after the start date
    if (new Date(endDate) <= new Date(startDate)) 
    {
        alert("End date cannot be earlier than or equal to the start date.");
        return;
    }

    // If editing, update the existing sprint
    if (isEditing) 
    {

        let overlapExists = false;
        sprintDB.once("value", function (snapshot) 
        {
            let sprints = snapshot.val();
            
            // Loop through all sprints to check for overlap with the new sprint
            for (let key in sprints) 
            {
                // Only check for the different sprint
                if (key != currentEditingKey)
                {
                    let existingSprint = sprints[key];
                    let existingStart = new Date(existingSprint.start);
                    let existingEnd = new Date(existingSprint.end);
                    let existingStatus = existingSprint.status

                    let newStart = new Date(startDate);
                    let newEnd = new Date(endDate);

                    if (existingStatus != 'Completed')
                    {
                        // Check if the new sprint overlaps with any existing sprint
                        if ((newStart <= existingEnd) && (newEnd >= existingStart)) 
                        {
                            overlapExists = true;
                            break;
                        }
                    }
                }
            }
        });

        if (overlapExists) 
        {
            alert("There is already a sprint active during this time period. Please choose a different time.");
            return;
        }

        sprintDB.child(currentEditingKey).update({
            name: sprintName,
            start: startDate,
            end: endDate,
            status: startDate == completeToday ? "Active" : 'Not Started'
        }, function (error) 
        {
            if (error) 
            {
                console.error('Error updating sprint:', error);
            } 
            else 
            {
                alert("Sprint updated successfully!");
                modal.style.display = "none";
                container.classList.remove("modal-active");
                isEditing = false;  // Reset edit mode
                currentEditingKey = null;  // Clear current editing key
            }
        });
    } 
    else 
    {
        // Creating a new sprint
        sprintDB.once("value", function (snapshot) 
        {
            let sprints = snapshot.val();
            let overlapExists = false;

            // Loop through all sprints to check for overlap with the new sprint
            for (let key in sprints) 
            {
                let existingSprint = sprints[key];
                let existingStart = new Date(existingSprint.start);
                let existingEnd = new Date(existingSprint.end);
                let existingStatus = existingSprint.status

                let newStart = new Date(startDate);
                let newEnd = new Date(endDate);

                if (existingStatus != 'Completed')
                {
                    // Check if the new sprint overlaps with any existing sprint
                    if ((newStart <= existingEnd) && (newEnd >= existingStart)) 
                    {
                        overlapExists = true;
                        break;
                    }
                }
            }

            if (overlapExists) 
            {
                alert("There is already a sprint active during this time period. Please choose a different time.");
                return;
            }

            // If no overlap exists, proceed to create a new sprint
            let newSprint = {
                name: sprintName,
                start: startDate,
                end: endDate,
                status: startDate == completeToday ? "Active" : 'Not Started'
            };
            
            // Generate a new key for the sprint and store it in the 'sprints' node
            let newSprintKey = sprintDB.push().key;

            // Save the new sprint under the 'sprints' node with the generated key
            sprintDB.child(newSprintKey).set(newSprint, function (error) {
                if (error) 
                {
                    console.error('Error saving new sprint:', error);
                } 
                else 
                {
                    alert("Sprint created successfully!");
                    modal.style.display = "none";
                    container.classList.remove("modal-active");
                }
            });
        });
    }
});

// Retrieve data from Firebase
sprintDB.on("value", function (snapshot) 
{
    let sprints = snapshot.val();

    // Clear the backlog element
    let backlogElement = document.getElementById('backlog');
    backlogElement.innerHTML = '';

    // Create title bar
    let title_bar = createTitleBar();
    backlogElement.appendChild(title_bar);

    // Record the current active sprint
    currentActiveSprint = Object.values(sprints).find(sprint => sprint.status == 'Active');

    // Sort the sprint follow Active, Not Started and Completed
    let statusSort = {
        "Not Started": 2,
        "Active": 1,
        "Completed": 3
    };

    // Get the keys of the sprints
    if (sprints) 
    {
        let keys = Object.keys(sprints);

        let today = new Date();
        let year = today.getFullYear();
        let month = String(today.getMonth() + 1).padStart(2, '0');
        let day = String(today.getDate()).padStart(2, '0');
        let completeToday = `${year}-${month}-${day}`;

        // Here is to detect the active sprint which have same date as 'today'
        keys.forEach((key) => {
            if (sprints[key].startDate == completeToday && sprints[key].status == 'Not Started'){
                sprintDB.child(key).update({
                    status: "Active" 
                })
            }
        });

        keys.sort((a, b) => statusSort[sprints[a].status] - statusSort[sprints[b].status]);

        // Loop through each sprint and create sprint cards
        keys.forEach((key) => {
            createSprintCard(sprints[key], key);
        });
    }
});

document.addEventListener('DOMContentLoaded', function () 
{
    const teamDashboardLink = document.getElementById('team-dashboard-link');
    
    if (teamDashboardLink) 
    {
        teamDashboardLink.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent the default action of the link

            // Retrieve the logged-in user from localStorage
            const loggedInUser = JSON.parse(localStorage.getItem('logged-in-user'));

            // Check if the user is an admin or member and redirect accordingly
            if (loggedInUser && loggedInUser.role === 'admin') {
                window.location.href = "admin_view.html"; // Redirect admin to admin view
            } else if (loggedInUser && loggedInUser.role === 'member') {
                window.location.href = "team_view_select.html"; // Redirect team member to team view
            } else {
                // If no valid user is found, redirect to the login page
                alert("You are not logged in. Redirecting to login page.");
                window.location.href = "index.html"; // Redirect to login if no user is found
            }
        });
    } else {
        console.error("Team Dashboard link not found.");
    }
});

// Popup event listeners for the line Chart icon popup close button
document.getElementById('chartPopupClose').addEventListener('click', () => {
    document.getElementById('chartPopupOverlay').style.display = 'none';
});

// Close burndown Chart popup when clicking outside the popup box
document.getElementById('chartPopupOverlay').addEventListener('click', (event) => {
    if (event.target === document.getElementById('chartPopupOverlay')) {
        document.getElementById('chartPopupOverlay').style.display = 'none';
    }
});

let myChart;
function showBurnDown(xAxis, yAxis, totalStoryPoints) 
{
    if (myChart) {
        myChart.destroy();
        console.log("Chart destroyed");
    }
    const numDays = xAxis.length;
    const totalPoints = totalStoryPoints;
    const pointsPerDay = (totalPoints / (numDays-1));
    // const idealPoints = Array(numDays).fill(0).map((_, i) => totalPoints - pointsPerDay * i);
    // Generate the ideal points array that smoothly goes down to 0
    const idealPoints = Array(numDays).fill(0).map((_, i) => {
        return Math.max(0, totalPoints - pointsPerDay * i);  // Ensure no negative values
    });

    

    // create new chart instance
    myChart = new Chart(document.getElementById("burnDownChart"), {
        type: "line",
        data: {
            labels: xAxis,
            datasets: [{
                label: "Burndown",
                data: yAxis,
                borderColor: "#EE6868",
                fill: false
            },
            {
                label: "Ideal",
                data: yAxis,
                borderColor: "#6C8893",
                fill: false,
                // borderDash: [5, 5],
                data: idealPoints
            }
            ]
        },
        options: {
            legend: { display: true },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

}

