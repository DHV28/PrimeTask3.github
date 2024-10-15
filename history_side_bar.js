// Toggle the history sidebar to show
function toggleHistory() 
{
    let taskHistory = document.getElementById('task-history');
    let historyIcon = document.getElementById('history-icon');
    let crossIcon = document.getElementById('close-icon');

    historyIcon.style.display = 'none';
    crossIcon.style.display = 'inline';

    taskHistory.classList.add('show');

    // Fetch and display task history when opening the history sidebar
    getHistory();
}

// Toggle the history sidebar to close
function toggleClose() 
{
    let taskHistory = document.getElementById('task-history');
    let historyIcon = document.getElementById('history-icon');
    let crossIcon = document.getElementById('close-icon');

    historyIcon.style.display = 'inline';
    crossIcon.style.display = 'none';

    taskHistory.classList.remove('show');
}

function getHistory() {
    const historyDB = firebase.database().ref("history-message");

    historyDB.on('value', (snapshot) => {
        const history = snapshot.val();
        if (history) {
            let taskHistory = document.getElementById('task-history');

            // Clear previous history but keep the title intact
            taskHistory.innerHTML = `<li class="title"><a>Task History</a></li>`;

            let keys = Object.keys(history);
            keys.reverse()
            // Sort the keys based on the timeMessage
            keys.sort((a, b) => {
                const dateA = new Date(history[a].timeMessage.split(' at ')[0]);
                const dateB = new Date(history[b].timeMessage.split(' at ')[0]);
                return dateB - dateA; // Sort latest to oldest
            });

            // Append the sorted history items
            keys.forEach((key) => {
                let historyMessage = history[key];
                let timeAndDate = historyMessage.timeMessage;
                let date = historyMessage.timeMessage.split(',')[0];
                let time = historyMessage.timeMessage.split(',')[1];

                // Extract HH:MM part and convert to 12-hour format manually
                let timePart = timeAndDate.match(/(\d{2}):(\d{2})/); // Match HH:MM format
                
                if (timePart) 
                {
                    let hours = parseInt(timePart[1]);
                    let minutes = timePart[2];
                    let ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    hours = hours ? hours : 12; // Handle 12 AM/PM case
                    let formattedTime = `${hours}:${minutes} ${ampm}`;

                    let message = historyMessage.message.toLowerCase();  

                    // Replace only the keyword, keeping the rest of the message intact and white
                    if (message.includes("added")) {
                        message = historyMessage.message.replace("added", `<span class="added">added</span>`);
                    } else if (message.includes("edited")) {
                        message = historyMessage.message.replace("edited", `<span class="edited">edited</span>`);
                    } else if (message.includes("deleted")) {
                        message = historyMessage.message.replace("deleted", `<span class="deleted">deleted</span>`);
                    }

                    let formattedMessage = `${date} ${time} - ${message}`; // Format with AM/PM

                    // Create a list item to hold each history entry
                    let historyItem = document.createElement('li');
                    historyItem.className = 'history-item';
                    historyItem.innerHTML = formattedMessage;

                    // Append history item to task history
                    taskHistory.appendChild(historyItem);
                } else {
                    console.log("Invalid time format found:", timeAndDate);
                }
            });
        } else {
            console.log("No history data found");
        }
    });
}

