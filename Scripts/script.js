function signinPage()
{
    document.location.href = "signin.html";
}

function signIn()
{
    document.location.href = "userprofile.html";
}

function home()
{
    document.location.href = "home.html";
}

function search(ele)
{
    ele = ele || window.event;
    if(ele.keyCode == 13)
    {
        document.location.href = "movie.html";
    }
}

function movie()
{
    document.location.href = "movie.html";
}

function person()
{
    document.location.href = "person.html";
}