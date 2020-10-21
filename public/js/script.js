function signinPage()
{
    document.location.href = "signin";
}

function signIn()
{
    document.location.href = "userprofile";
}

function home()
{
    document.location.href = "/";
}

function search(ele)
{
    ele = ele || window.event;
    if(ele.keyCode == 13)
    {
        document.location.href = "movie";
    }
}

function movie()
{
    document.location.href = "movie";
}

function person()
{
    document.location.href = "person";
}