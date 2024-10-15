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


window.addEventListener('DOMContentLoaded',function(){

    let doneButton = this.document.getElementById("done-button")

    doneButton.addEventListener('click',function()
    {
        let selectedQuestions = {};
        let checkCount = document.querySelectorAll('input[type="checkbox"]:checked').length;

        if (checkCount < 3)
        {
            alert("Please choose three security questions to answer.")
        }
        else
        {
            document.querySelectorAll('input[type="checkbox"]:checked').forEach(function (checkbox, index) 
            {
                let idNumber = checkbox.id.slice(-1);
                let questionText = document.getElementById(idNumber).querySelector('.question').textContent;

                selectedQuestions[`question${index + 1}`] = {
                    question: questionText = questionText.split('.').slice(1).join('.').trim(),
                    answer: ""
                };
            });

            selectedQuestionsDB.set(selectedQuestions).then(() => 
            {
                window.location.href = "security_question.html";
            }).catch((error) => 
            {
                console.error("Error saving to database: ", error);
            });
        }
    })

    let checkBoxes = this.document.querySelectorAll('input[type="checkbox"]');

    let maximumAllowed = 3;

    checkBoxes.forEach(function(checkbox)
    {
        checkbox.addEventListener('change', function()
        {
            let checkCount = document.querySelectorAll('input[type="checkbox"]:checked').length;

            if (checkCount > maximumAllowed)
            {
                this.checked=false;
            }
            if (checkCount == maximumAllowed)
            {
                checkBoxes.forEach(function(otherCheckBox)
                {
                    if (!otherCheckBox.checked)
                    {
                        otherCheckBox.disabled = true;
                    }
                })
                
            }
            else
            {
                checkBoxes.forEach(function(otherCheckBox)
                {
                    otherCheckBox.disabled = false;
                })
            }

            if (this.checked)
            {
                let idNumber = this.id.slice(-1)
                document.getElementById(idNumber).className = "selected-box"
            }
            else
            {
                let idNumber = this.id.slice(-1)
                document.getElementById(idNumber).className = "unselected-box"
            }
        })
    })

})

// retrieve all questions from the database

const questionsDB = firebase.database().ref('security-questions');

questionsDB.once('value').then((snapshot) => 
{
    let questions = snapshot.val();
    let question = Object.keys(questions);

    question.forEach((key) => {
        let questionNumber = key.slice(-1);
        let questionText = questions[key].question;

        document.getElementById(questionNumber).querySelector('.question').innerText = `${questionNumber}. ${questionText}`;
    });

}).catch((error) => 
{
    console.error("Error fetching questions: ", error);
});


