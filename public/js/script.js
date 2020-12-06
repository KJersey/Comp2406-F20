function signInPage()
{
    document.location.href = "/signin";
}

function createPersonPage()
{
    document.location.href = "/createperson";
}

function createMoviePage()
{
    document.location.href = "/createmovie";
}

function signInPage()
{
    document.location.href = "/signin";
}

function profilePage()
{
    document.location.href = "/userprofile";
}

function signInLoad()
{
    document.getElementById('user').addEventListener("keyup", function(event)
    {
        if (event.key === "Enter")
        {
            signIn()
        }
    });

    document.getElementById('pass').addEventListener("keyup", function(event)
    {
        if (event.key === "Enter")
        {
            signIn()
        }
    });
}

function signIn()
{

    let user = document.getElementById("user").value;
    let pass = document.getElementById("pass").value;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/login', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        Username: user,
        Password: pass
    }));

    xhr.onload = () =>
    {
        document.location.href = xhr.responseURL;
    }
}

function createUser()
{
    let user = document.getElementById("user").value;
    let pass = document.getElementById("pass").value;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/createUser', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        Username: user,
        Password: pass
    }));

    xhr.onload = () =>
    {
        document.location.href = xhr.responseURL;
    }
}

function home()
{
    document.location.href = "/";
}

function createReviewPage(imdbID)
{
    document.location.href = "/createReview/" + imdbID;
}

function search(ele)
{
    ele = ele || window.event;
    if(ele.keyCode == 13)
    {
        let search = document.getElementById("search").value;

        var xmlHttp = new XMLHttpRequest();

        switch(document.getElementById("filter").value)
        {
        case "Title":
            xmlHttp.open( "GET", 'searchMovie/' + search, false );
            break;
        case "Person":
            xmlHttp.open( "GET", 'searchMovieByPerson/' + search, false );
            break;
        case "Genre":
            xmlHttp.open( "GET", 'searchMovieByGenre/' + search, false );
            break;
        }
        
        xmlHttp.send(null);
        console.log(JSON.parse(xmlHttp.responseText));
    }
}

function updateContributor()
{
    let contributor = {val: document.getElementById("contributor").checked}

    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/updateContributor', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify(contributor));

    location.reload();
}

function updateUserFollowage(user)
{
    let followage = {val: document.getElementById("userFollowage").checked, user: user}

    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/updateUserFollowage', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify(followage));

    location.reload();
}

function updatePersonFollowage(person)
{
    let followage = {val: document.getElementById("personFollowage").checked, person: person}

    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/updatePersonFollowage', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify(followage));

    location.reload();
}

function createMovie()
{
    let title = document.getElementById("title").value;
    let imdbID = document.getElementById("imdbID").value;
    let year = document.getElementById("year").value;
    let rated = document.getElementById("rated").value;
    let genre = document.getElementById("genre").value;
    let actors = document.getElementById("actors").value;
    let plot = document.getElementById("plot").value;

    // create basic movie object
    let movie = {Title: title, imdbID: imdbID, Year: year, Rated: rated, Genre: genre, Actors: actors, Plot: plot};

    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/createMovie', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify(movie));

    xhr.onload = () =>
    {
        document.location.href = xhr.responseURL;
    }
}

function person()
{
    document.location.href = "person";
}

function movie(title)
{
    document.location.href = "/movie/" + title;
}

function createPerson()
{
    let name = document.getElementById("name").value;
    let directed = document.getElementById("directed").value.split(", ");
    let wrote = document.getElementById("wrote").value.split(", ");
    let acted = document.getElementById("acted").value.split(", ");

    // create basic movie object
    let person = {Name: name, Acted: acted, Directed: directed, Wrote: wrote};

    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/createperson', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify(person));

    xhr.onload = () =>
    {
        document.location.href = xhr.responseURL;
    }
}

function createReview(imdbID)
{
    var xhr = new XMLHttpRequest();

    let summary = document.getElementById("summary").value;
    let description = document.getElementById("description").value;
    let score = document.getElementById("score").value;

    xhr.open("GET", '/getMovie/' + imdbID, false);
    xhr.send(null);
    response = JSON.parse(xhr.responseText);

    if(response === undefined) return;

    let review = {imdbID: response.imdbID, summary: summary, description: description, score: score};

    xhr.open("POST", '/createreview', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(review));

    xhr.onload = () =>
    {
        document.location.href = xhr.responseURL;
    }
}