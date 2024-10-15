const toTeamDashboard = document.getElementById('memberDashboardButton');

toTeamDashboard.addEventListener('click', function () 
{
    window.location.href = "date_form_member.html";
});


const toAddMembers = document.getElementById('resetPasswordButton');

toAddMembers.addEventListener('click', function () 
{
    window.location.href = "member_password_reset.html";
});