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
let memberKey = "";
const memberName = document.getElementById('name')
const memberEmail = document.getElementById('email')
const memberPassword = document.getElementById('password')

// Retrieve from database
async function retrieveMemberData() {
    try {
        const editMemberRef = await firebase.database().ref('edit-member-ref').once('value');
        memberKey = editMemberRef.val().memberKey
        console.log(memberKey)

        const memberDB = await firebase.database().ref('team-members/' + memberKey).once('value');
        const memberData = memberDB.val()
        memberName.value = memberData.memberName
        memberEmail.value = memberData.memberEmail
        memberPassword.value = memberData.memberPassword

    } catch (error) {
        console.error('Error fetching member data:', error)
    }
}

// Clear any previous error messages
const clearErrorMessages = () => 
{
    document.getElementById('error-message').style.display = 'none';
    document.getElementById('error-message').innerHTML = '';

    let formFields = document.querySelectorAll('.form-row input, .form-row select');
    formFields.forEach(field => {
        field.classList.remove('error');
    });
};

// Show error messages using popup
const showPopUpErrors = (errors) => {
    let container = document.querySelector('.form-container')

    const popupBox = document.createElement('div');
    popupBox.classList.add('popup');

    //create the <h2> tag for Error Message title
    const titleShow = document.createElement('h2');
    titleShow.textContent = 'Error Message';
    titleShow.classList.add('popup-h2')

    //create the <ul> tag
    let totalErrors = document.createElement('ul')
    errors.forEach((error) => {
        let li = document.createElement('li');
        li.textContent = error;

        totalErrors.appendChild(li);
    })

    // Create the <button> element for closing pop up
    const button = document.createElement('button');
    button.classList.add('popup-button');
    button.textContent = 'Ok';
    button.addEventListener('click',(e) => {
        popupBox.remove()
    })

    popupBox.appendChild(titleShow);
    popupBox.appendChild(totalErrors);
    popupBox.appendChild(button)

    container.appendChild(popupBox);
};

const validateEmail = (email) => 
    {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        return emailPattern.test(email);
    };

// Normalize the date to ignore time components
const normalizedDate = (date) =>
    {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

retrieveMemberData()

// Function to edit a team member
document.getElementById('saveButton').addEventListener('click', function(event) 
{
    event.preventDefault();

    clearErrorMessages();

    let newName = document.getElementById("name").value.trim();
    let newEmail = document.getElementById("email").value.trim();
    let newPassword = document.getElementById("password").value.trim();

    let formValid = true;
    let errors = [];

    if (newName === "") {
        errors.push("Name cannot be empty.");
        document.getElementById("name").classList.add("error");
        formValid = false;
    }

    if (newEmail === "") {
        errors.push("Email cannot be empty.");
        document.getElementById("name").classList.add("error");
        formValid = false;
    }

    if (newPassword === "") {
        errors.push("Password cannot be empty.");
        document.getElementById("name").classList.add("error");
        formValid = false;
    }

    if (!validateEmail(newEmail)) {
        errors.push("Email format is not accepted.");
        document.getElementById("name").classList.add("error");
        formValid = false;
    }

    if (!formValid) {
        showPopUpErrors(errors);
    } else {
        let memberDB = firebase.database().ref('team-members/' + memberKey).once('value')
        let logTimeDB = firebase.database().ref('log-time-dates/' + memberKey).once('value');
        let taskDB = firebase.database().ref('task-details-form').once('value');
        let sprintDB = firebase.database().ref('sprints').once('value');

        function updateTeamMember(memberKey, updatedData) {
            firebase.database().ref('team-members/' + memberKey).update(updatedData)
        }

        function updateLogTime(memberKey, updatedData) {
            logTimeDB.then((snapshot) => {
                snapshot.forEach((timeStore) => {
                    let date = String(timeStore.key)
                    firebase.database().ref('log-time-dates/' + memberKey + '/' + date).update(updatedData)
                });
            })
        }

        function updateTask(memberKey, updatedData) {
            taskDB.then((snapshot) => {
                snapshot.forEach((task) => {
                    let value = task.val()
                    let taskID = String(task.key)
                    let memberID = String(value.assigneeID)
                    if (memberID === memberKey) {
                        firebase.database().ref('task-details-form/' + taskID).update(updatedData)
                    }
                })
            })
        }

        /* function updateSprint(memberKey, updatedData) {
            let sprints = []
            sprintDB.then((snapshot) => {
                snapshot.forEach((sprint) => {
                    let sprintID = String(sprint.key)
                    sprints.push(sprintID)
                })

                sprints.forEach((IDSprint) => {
                    firebase.database().ref('sprints/' + IDSprint + '/task-details-form').once('value').then((taskSnapshot) => {
                        taskSnapshot.forEach((task) => {
                            let value = task.val()
                            let taskID = String(task.key)
                            let memberID = String(value.assigneeID)
                            if (memberID === memberKey) {
                                firebase.database().ref('sprints/' + IDSprint + '/task-details-form/' + taskID).update(updatedData)
                            }
                        })
                    })
                })
            })
        } */


        function updateSprint(memberKey, updatedData) {
            return sprintDB.then((snapshot) => {
                let promises = []; // Array to store all the update promises
        
                snapshot.forEach((sprint) => {
                    let sprintID = String(sprint.key);
        
                    // Fetch task details for each sprint
                    promises.push(
                        firebase.database().ref('sprints/' + sprintID + '/task-details-form').once('value').then((taskSnapshot) => {
                            let taskUpdatePromises = []; // Array for task-specific updates
        
                            taskSnapshot.forEach((task) => {
                                let value = task.val();
                                let taskID = String(task.key);
                                let memberID = String(value.assigneeID);
        
                                // If the task belongs to the specified member, push an update promise
                                if (memberID === memberKey) {
                                    taskUpdatePromises.push(
                                        firebase.database().ref('sprints/' + sprintID + '/task-details-form/' + taskID).update(updatedData)
                                    );
                                }
                            });
        
                            // Return a promise that waits for all task updates to finish
                            return Promise.all(taskUpdatePromises);
                        })
                    );
                });
        
                // Return a promise that resolves when all sprint updates are complete
                return Promise.all(promises);
            });
        }

        function relocateUser() {
            alert("Member edited successfully!")
            window.location.href = "team_dashboard_admin.html"
        }
        
        const updatedMember = {
            memberName: newName,
            memberEmail: newEmail,
            memberPassword: newPassword
        }

        const updatedTask = {
            assigneeSelected: newName
        }

        const updatedMemberDate = {
            assigneeName: newName
        }

        Promise.all([
            updateTeamMember(memberKey, updatedMember),
            updateLogTime(memberKey, updatedMemberDate),
            updateTask(memberKey, updatedTask),
            updateSprint(memberKey, updatedTask)
        ])
        .then(() => {
            // All updates are successful, now relocate the user
            relocateUser();
        })
        .catch((error) => {
            // Handle any error that occurs during the updates
            console.error("Error updating data:", error);
            alert("An error occurred while updating. Please try again.");
        });


        // Update Firebase
        //updateTeamMember(memberKey, updatedMember)
        //updateLogTime(memberKey, updatedMemberDate)
        //updateTask(memberKey, updatedTask)
        //updateSprint(memberKey, updatedTask)
        //alert("Please wait for 10 seconds. Member is being edited.")
        //setTimeout(relocateUser, 10000) // 10 seconds delay because takes long time for database
        }
})