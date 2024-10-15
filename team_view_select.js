const toAdminPage = document.getElementById('adminButton');

toAdminPage.addEventListener('click', function () 
{
    window.location.href = "admin_login.html";
});

const toMemberPage = document.getElementById('memberButton');
toMemberPage.addEventListener('click', function(){
    window.location.href = "member_view.html";
})