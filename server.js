const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const { isContext } = require('vm');
const port = 8000;

let movies = require(__dirname + '/public/json/movie-data.json');
let people;
let users = require(__dirname + '/public/json/users.json');

app.use(express.static(__dirname + '/public'));

function init()
{
    console.log("Starting Up");
    console.log(movies);

    people = [];

    for(movie in movies)
    {
        title = movies[movie]["Title"];

        //Get the director, see if they exist in the person array
        director = movies[movie]["Director"];
        let i = people.findIndex(p => p["Name"] === director);
        if(i == -1)
        {
            //If they don't, add them with them directing the title
            people.push({Name : director, Directed : [title], Wrote : [], Acted : []});
        }
        else
        {
            //If they exist, see if they already direct the title, if not, add that they direct it
            if(!people[i]["Directed"].some (e => e === title)) people[i]["Directed"].push(title);
        }

        //Get the list of writers, and check for each writer
        writers = movies[movie]["Writer"].split(', ');
        for(w in writers)
        {
            //If they exist in the person array
            writer = writers[w].split(' (')[0];
            i = people.findIndex(p => p["Name"] === writer);
            if(i == -1)
            {
                //If not, add them with them writing the title
                people.push({Name : writer, Directed : [], Wrote : [title], Acted : []});
            }
            else
            {
                //If they exist, see if they already wrote the title, if not, add that they wrote it
                if(!people[i]["Wrote"].some (e => e === title)) people[i]["Wrote"].push(title);
            }
        }

        //Get the list of actors, and check for each actors
        actors   = movies[movie]["Actors"].split(', ');
        for(a in actors)
        {
            //If they exist in the person array
            actor = actors[a]
            i = people.findIndex(p => p["Name"] === actor);
            if(i == -1)
            {
                //If not, add them with them acting in the title
                people.push({Name : actor, Directed : [], Wrote : [], Acted : [title]});
            }
            else
            {
                //If they exist, see if they already acted in the title, if not, add that they acted in it
                if(!people[i]["Acted"].some (e => e === title)) people[i]["Acted"].push(title);
            }
        }
    }

    console.log(people);
}


//USER

// validuser
function isValidUser(user) {
    if (!user) {
        return false;
    }
    if (!users.hasOwnProperty(user.Username) || !user.Username) {
        return false;
    }
    return true;
}

// createuser
function createUser(newUser) {

    newUser = JSON.parse(newUser);

    if (!newUser.hasOwnProperty("Username") || !newUser.hasOwnProperty("Password")) {
        return null;
    }

    if (getUser(newUser.Username)) {
        return null;
    }

    newUser.Contributor = false;
    newUser.Reviews = [];
    users.push(newUser);

    return newUser;
}

// deleteuser
function deleteUser(user) {
    if (!isValidUser(user)) {
        return null;
    }

    users.remove(user);
}

// iscontributor
function isContributor(user) {
    if(!user) return false;
    if(!user.hasOwnProperty('Contributor')) return false;
    return user.Contributor;
}

// getuser
function getUser(username) {
    return users.find(user => user.Username === username);
}

// searchusers
function searchUser(query) {
    // if query = "dragon", returns array of all users which contain dragon in their username
    return users.filter(user => user.Username.toLowerCase().includes(query.toLowerCase()));
}

//MOVIE

// createmovie(user.iscontributor, movie)
// createuser
function createMovie(newMovie) {

    if (!newMovie.Title || !newMovie.imdbID) {
        return null;
    }

    if (movies.hasOwnProperty(newMovie.idmbID)) {
        return null;
    }

    // set default props
}

// deletemovie(user.iscontributor, movie)
// isValidMovie
function isValidMovie(movie) {
    if (!movie) {
        return false;
    }
    if (!movies.hasOwnProperty(movie.imdbID) || !movie.imdbID) {
        return false;
    }
    return true;
}

// searchmovie
function searchMovie(query) {
    // if query = "dragon", returns array of all users which contain dragon in their username
    return movies.filter(movie => movie.Title.toLowerCase().includes(query.toLowerCase()));
}

// getmovie
function getMovie(movieID) {
    return movies.find(movie => movie.imdbID === movieID);
}

// modify movie
function modifyMovie(movie) {
    if (!isValidMovie()) {
        return null;
    }
}
// getsimilar (entirely random for now)
// getrecommendations (multiple getsimilar)

//PERSON

// createperson
// delete person
// search person
// modify person

app.get('/', (req, res) =>
{
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/movie', (req, res) =>
{
    res.sendFile(path.join(__dirname + '/movie.html'));
});

app.get('/movie/:movieID', (req, res) =>
{
    let movie = getMovie(req.params.movieID);
    res.send(movie);
});

app.get('/person', (req, res) =>
{
    res.sendFile(path.join(__dirname + '/person.html'));
});

app.get('/signin', (req, res) =>
{
    res.sendFile(path.join(__dirname + '/signin.html'));
});

app.get('/userprofile', (req, res) =>
{
    res.sendFile(path.join(__dirname + '/userprofile.html'));
});

app.get('/users/:username', (req, res) =>
{
    let user = getUser(req.params.username);
    if(typeof user == 'undefined') res.send("User not found!");
    else res.send(user);
});

app.get('/searchUser/:query', (req, res) =>
{
    let users = searchUser(req.params.query);
    res.send(users);
});

app.get('/searchMovie/:query', (req, res) =>
{
    let movies = searchMovie(req.params.query);
    res.send(movies);
});

app.get('/isContributor/:username', (req, res) =>
{
    user = getUser(req.params.username);
    res.send(isContributor(user));
});

app.get('/createUser/:user', (req, res) =>
{
    res.send(createUser(req.params.user));
});

init();
app.listen(port);