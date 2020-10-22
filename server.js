const express = require('express');
const fs = require('fs');
const { get } = require('http');
const app = express();
const path = require('path');
const { isContext } = require('vm');
const port = 8000;

let movies = require(__dirname + '/public/json/movie-data-short.json');
let people;
let users = require(__dirname + '/public/json/users.json');

app.use(express.static(__dirname + '/public'));

function init()
{
    console.log("Starting Up");
    // console.log(movies);

    people = [];

    for(movie in movies)
    {
        imdbID = movies[movie].imdbID;

        //Get the director, see if they exist in the person array
        let director = movies[movie].Director;
        let i = people.findIndex(p => p.Name === director);
        if(i == -1)
        {
            //If they don't, add them with them directing the title
            people.push({Name : director, Directed : [imdbID], Wrote : [], Acted : []});
        }
        else
        {
            //If they exist, see if they already direct the title, if not, add that they direct it
            if(!people[i].Directed.some (e => e === imdbID)) people[i].Directed.push(imdbID);
        }

        //Get the list of writers, and check for each writer
        let writers = movies[movie].Writer.split(', ');
        for(w in writers)
        {
            //If they exist in the person array
            let writer = writers[w].split(' (')[0];
            i = people.findIndex(p => p.Name === writer);
            if(i == -1)
            {
                //If not, add them with them writing the title
                people.push({Name : writer, Directed : [], Wrote : [imdbID], Acted : []});
            }
            else
            {
                //If they exist, see if they already wrote the title, if not, add that they wrote it
                if(!people[i].Wrote.some (e => e === imdbID)) people[i].Wrote.push(imdbID);
            }
        }

        //Get the list of actors, and check for each actors
        let actors = movies[movie].Actors.split(', ');
        for(a in actors)
        {
            //If they exist in the person array
            let actor = actors[a]
            i = people.findIndex(p => p.Name === actor);
            if(i == -1)
            {
                //If not, add them with them acting in the title
                people.push({Name : actor, Directed : [], Wrote : [], Acted : [imdbID]});
            }
            else
            {
                //If they exist, see if they already acted in the title, if not, add that they acted in it
                if(!people[i]["Acted"].some (e => e === imdbID)) people[i].Acted.push(imdbID);
            }
        }
    }

    console.log("Finished Starting");
}


//---------------------------------------USER---------------------------------------

function isValidUser(user) {
    if (!user) {
        return false;
    }

    if (!user.hasOwnProperty("Username") || !user.hasOwnProperty("Password")) {
        return false;
    }

    return true;
}

function getUser(username) {
    return users.find(user => user.Username === username);
}

function searchUser(query) {
    // if query = "dragon", returns array of all users which contain dragon in their username
    return users.filter(user => user.Username.toLowerCase().includes(query.toLowerCase()));
}

function createUser(newUser) {

    if(!isValidUser(newUser)) return null;
    if(getUser(newUser.Username)) return null;

    newUser.Contributor = false;
    newUser.Reviews = [];
    users.push(newUser);

    return newUser;
}

function deleteUser(username) {
    let user = getUser(username);
    users = users.filter(u => u !== user);
    return users;
}

function isContributor(user) {
    if(!user) return false;
    if(!user.hasOwnProperty('Contributor')) return false;
    return user.Contributor;
}

//---------------------------------------MOVIE---------------------------------------

function isValidMovie(movie) {
    if (!movie) {
        return false;
    }

    if (!movie.hasOwnProperty("Title") || !movie.hasOwnProperty("imdbID")) {
        return false;
    }

    return true;
}

function getMovie(movieID) {
    return movies.find(movie => movie.imdbID === movieID);
}

function searchMovie(query) {
    // if query = "dragon", returns array of all users which contain dragon in their username
    return movies.filter(movie => movie.Title.toLowerCase().includes(query.toLowerCase()));
}

function createMovie(newMovie) {

    if(!isValidMovie(newMovie)) return null;
    if(getMovie(newMovie.imdbID)) return null;

    for (prop in movies[0]) {
        if(!newMovie[prop]) {
            newMovie[prop] = 'N/A';
        }
    }

    movies.push(newMovie);

    return newMovie;
}

function deleteMovie(movieID) {
    let movie = getMovie(movieID);
    movies = movies.filter(m => m !== movie);
    return movies;
}

function modifyMovie(movieID, prop, val) {
    let movie = getMovie(movieID);
    if(!movie) return null;

    if(prop != "imdbID" && movie.hasOwnProperty(prop)) {
        movie[prop] = val;
    }

    return movie;
}

function getSimilar(title) {
    return movies[Math.floor(Math.random() * movies.length)];
}

function getRecommendations(username) {
    let recommended = [];
    
    for(let i = 0; i < 5; i++) {
        let movie = getSimilar(null);
        if(!recommended.includes(movie)) recommended.push(movie);
    }

    return recommended;
}

//---------------------------------------PERSON---------------------------------------

function isValidPerson(person) {
    if (!person) {
        return false;
    }

    if (!person.hasOwnProperty("Name")) {
        return false;
    }

    return true;
}

function getPerson(personName) {
    return people.find(person => person.Name === personName);
}

function searchPerson(query) {
    // if query = "dragon", returns array of all users which contain dragon in their username
    return people.filter(person => person.Name.toLowerCase().includes(query.toLowerCase()));
}


function createPerson(newPerson) {


    if(!isValidPerson(newPerson)) return null;
    if(getPerson(newPerson.imdbID)) return null;

    newPerson.Directed = [];
    newPerson.Wrote = [];
    newPerson.Acted = [];

    people.push(newPerson);

    return newPerson;
}

function deletePerson(personName) {
    let person = getPerson(personName);
    people = people.filter(p => p !== person);
    return people;
}

function modifyPerson(personName, prop, val) {
    let person = getPerson(personName);
    if(!person) return null;

    if(prop != "Name" && person.hasOwnProperty(prop)) {
        person[prop] = val;
    }

    return person;
}

//--------------------------Pages--------------------------//

app.get('/', (req, res) =>
{
    res.render(path.join(__dirname + '/index'));
});

app.get('/movie', (req, res) =>
{
    res.render(path.join(__dirname + '/movie'));
});

app.get('/person', (req, res) =>
{
    res.render(path.join(__dirname + '/person'));
});

app.get('/signin', (req, res) =>
{
    res.render(path.join(__dirname + '/signin'));
});

app.get('/userprofile', (req, res) =>
{
    res.render(path.join(__dirname + '/userprofile'));
});

//--------------------------Users--------------------------//

app.get('/users/:username', (req, res) =>
{
    res.send(getUser(req.params.username));
});

app.get('/allUsers', (req, res) =>
{
    res.send(users);
});

app.get('/searchUser/:query', (req, res) =>
{
    res.send(searchUser(req.params.query));
});

//Will be post
app.get('/createUser/username=:username&password=:password', (req, res) =>
{
    res.send(createUser({"Username" : req.params.username, "Password" : req.params.password}));
});

//Will be post
app.get('/deleteUser/:username', (req, res) =>
{
    res.send(deleteUser(req.params.username));
});

app.get('/isContributor/:username', (req, res) =>
{
    res.send(isContributor(getUser(req.params.username)));
});

//--------------------------Movies--------------------------//

app.get('/movie/:movieID', (req, res) =>
{
    res.send(getMovie(req.params.movieID));
});

app.get('/allMovies', (req, res) =>
{
    res.send(movies);
});

app.get('/searchMovie/:query', (req, res) =>
{
    res.send(searchMovie(req.params.query));
});

//Will be post
app.get('/createMovie/title=:title&imdbID=:imdbID', (req, res) =>
{
    res.send(createMovie({"Title" : req.params.title, "imdbID" : req.params.imdbID}));
});

//Will be post
app.get('/deleteMovie/:movieID', (req, res) =>
{
    res.send(deleteMovie(req.params.movieID));
});

//Will be post
app.get('/modifyMovie/:movieID&:prop=:val', (req, res) =>
{
    res.send(modifyMovie(req.params.movieID, req.params.prop, req.params.val));
});

app.get('/getSimilar/:title', (req, res) =>
{
    res.send(getSimilar(req.params.title));
});

app.get('/getRecommended', (req, res) =>
{
    res.send(getRecommendations(null));
});

//--------------------------People--------------------------//

app.get('/people/:name', (req, res) =>
{
    res.send(getPerson(req.params.name));
});

app.get('/allPeople', (req, res) =>
{
    res.send(people);
});

app.get('/searchPeople/:query', (req, res) =>
{
    res.send(searchPerson(req.params.query));
});

//Will be post
app.get('/createPerson/name=:name', (req, res) =>
{
    res.send(createPerson({"Name" : req.params.name}));
});

//Will be post
app.get('/deletePerson/:name', (req, res) =>
{
    res.send(deletePerson(req.params.name));
});

//Internal, here for testing
app.get('/modifyPerson/name=:name&:prop=:val', (req, res) =>
{
    res.send(modifyPerson(req.params.name, req.params.prop, req.params.val));
});

//--------------------------Server Stuff--------------------------//

app.set('view engine', 'ejs');
init();
app.listen(port);