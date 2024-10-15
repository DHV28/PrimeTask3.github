// Initialise Firebase
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
const selectedQuestionsDB = firebase.database().ref('admin-selected-security-questions');
const adminDB = firebase.database().ref('admin-credentials');


// retrieve the selected questions from the database for admin to answer(first time)
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


function saveAnswersFirstTime() 
{

    const answers = [
        { id: 'question1', answer: document.getElementById('answer1').value },
        { id: 'question2', answer: document.getElementById('answer2').value },
        { id: 'question3', answer: document.getElementById('answer3').value }
    ];

    // update in the database
    answers.forEach(({ id, answer }) => 
    {
        firebase.database().ref('admin-selected-security-questions/' + id).update({ answer: answer }, (error) => 
        {
            if (error) 
            {
                console.error(`Error updating ${id} answer:`, error);
            } 
            else 
            {
                console.log(`${id} answer updated successfully!`);
            }
        });
    });
}


// save button
document.getElementById('saveButton').addEventListener('click', (e) => 
{
    e.preventDefault();

    const answer1 = document.getElementById('answer1').value.trim();
    const answer2 = document.getElementById('answer2').value.trim();
    const answer3 = document.getElementById('answer3').value.trim();

    if (answer1 === '' || answer2 === '' || answer3 === '') 
    {
        alert('Please fill in all answers before submitting.');
        return;
    }

    // check first time login
    adminDB.once('value').then((snapshot) => 
    {
        const adminData = snapshot.val();
        const isFirstTime = adminData.firstTime;

        if (isFirstTime) 
        {
            saveAnswersFirstTime();
            adminDB.update({ firstTime: false });
            alert('Answers saved successfully!');
            window.location.href = 'sprint_board.html';
        }
        else
        {
            selectedQuestionsDB.once('value').then((snapshot) =>
            {
                const adminsecurityCredentials = snapshot.val();
    
                const originalanswer1 = adminsecurityCredentials.question1.answer;
                const originalanswer2 = adminsecurityCredentials.question2.answer;
                const originalanswer3 = adminsecurityCredentials.question3.answer;
    
                if(answer1 === originalanswer1 && answer2 === originalanswer2 && answer3 === originalanswer3) 
                {
                    alert('All the questions have been answered correctly! Redirecting to the forget password page.');
                    window.location.href = 'forget_password.html';
                }
                else 
                {
                    alert('Incorrect answers. Redirecting back to login. ');
                    window.location.href = 'main_login.html';
                }
            })
        }
    })
});
