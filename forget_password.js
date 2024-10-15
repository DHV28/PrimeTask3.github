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


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve security questions from Firebase
const selectedQuestionsDB = firebase.database().ref('admin-selected-security-questions');

const adminDB = firebase.database().ref('admin-credentials')

selectedQuestionsDB.once('value').then((snapshot) => {
    const questions = snapshot.val();
    if (questions) {
        // Update the question text in the form with the fetched questions
        document.querySelectorAll('.question-text')[0].textContent = questions.question1.question;
        document.querySelectorAll('.question-text')[1].textContent = questions.question2.question;
        document.querySelectorAll('.question-text')[2].textContent = questions.question3.question;
    } else {
        alert('No security questions found for this user.');
    }
}).catch((error) => {
    console.error("Error fetching security questions: ", error);
});


// Form submission
document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault();

    let username = document.getElementById("username").value;
    let newPassword = document.getElementById("new-password").value;

    adminDB.once('value').then((snapshot) => {
        let adminData = snapshot.val()
        
        if (adminData){
            
            if (username === adminData.username && newPassword != ""){
                
                firebase.database().ref('admin-credentials').update({
                    password: newPassword
                }).then(() => {
                    alert("You have successfully changed the password.");
        
                    // Redirect to another page after successful password change
                    window.location.href = "index.html";
                }).catch((error) => {
                    alert("Error updating password: " + error.message);
                });
            }else if (username !== adminData.username){
                alert("Please enter correct username.")
            }
            else{
                alert("Please fill in the new password field.")
            }
        }
    })

    
});



// // Check the validation for updating new password
// document.querySelector('form').addEventListener('submit', function (event) {
//     event.preventDefault();
// 
//     let newPassword = document.getElementById("new-password").value;
// 
//     // validate format of pw and update pw in database - might not need(clarify with client)
//     const hasUpperCase = /[A-Z]/.test(newPassword);
//     const hasLowerCase = /[a-z]/.test(newPassword);
//     const hasNumber = /\d/.test(newPassword);
//     const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
// 
//     let errors = [];
// 
//     if (newPassword === "") {
//         errors.push("The new password cannot be empty.");
//     }
// 
//     if (newPassword.length < 8) {
//         errors.push("The new password should be at least 8 characters long.");
//     }
// 
//     if (!hasUpperCase) {
//         errors.push("The new password should contain at least one upper case.");
//     }
// 
//     if (!hasLowerCase) {
//         errors.push("The new password should contain at least one lower case.");
//     }
// 
//     if (!hasNumber) {
//         errors.push("The new password should contain at least one digit number.");
//     }
// 
//     if (!hasSpecialChar) {
//         errors.push("The new password should contain at least one special character.");
//     }
// 
//     if (errors.length === 0) {
//         // Update the password in the Firebase database using the dynamically retrieved key
//         firebase.database().ref('admin-credentials/' + key).update({
//             password: newPassword
//         }).then(() => {
//             alert("You have successfully changed the password.");
// 
//             // Redirect to another page after successful password change
//             window.location.href = "index.html";
//         }).catch((error) => {
//             alert("Error updating password: " + error.message);
//         });
//     } else {
//         showPopUpErrors(errors);
//     }
// });
// 
// // Show error messages using pop-up
// const showPopUpErrors = (errors) => {
//     let container = document.querySelector('.form-container');
// 
//      // Remove any existing pop-up
//     const existingPopup = document.querySelector('.popup');
//     if (existingPopup) {
//         existingPopup.remove(); // Ensure only one pop-up exists at a time
//     }
// 
//     const popupBox = document.createElement('div');
//     popupBox.classList.add('popup');
// 
//     // Create the <h2> tag for Error Message title
//     const titleShow = document.createElement('h2');
//     titleShow.textContent = 'Error Message';
//     titleShow.classList.add('popup-h2');
// 
//     // Create the <ul> tag
//     let totalErrors = document.createElement('ul');
//     errors.forEach((error) => {
//         let li = document.createElement('li');
//         li.textContent = error;
// 
//         totalErrors.appendChild(li);
//     });
// 
//     // Create the <button> element for closing pop-up
//     const button = document.createElement('button');
//     button.classList.add('popup-button');
//     button.textContent = 'Ok';
//     button.addEventListener('click', (e) => {
//         e.stopPropagation();
//         popupBox.remove();
//     });
// 
//     popupBox.appendChild(titleShow);
//     popupBox.appendChild(totalErrors);
//     popupBox.appendChild(button);
// 
//     container.appendChild(popupBox);
// };
