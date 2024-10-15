document.querySelector('form').addEventListener('submit', function(event) 
{
    event.preventDefault();

    let startDateMember = document.getElementById('startDateMember').value;
    let endDateMember = document.getElementById('endDateMember').value;

    // Validate that the end date is after the start date
    if (new Date(endDateMember) < new Date(startDateMember)) 
    {
        alert("End date cannot be earlier than the start date.");
        return;
    }

    localStorage.setItem("startDateMember",startDateMember)
    localStorage.setItem("endDateMember",endDateMember)
        
    window.location.href = "team_dashboard_member.html"
});