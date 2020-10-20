const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const port = 8000;

let movies;
let people;

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) =>
{
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/movie.html', (req, res) =>
{
    res.sendFile(path.join(__dirname + '/movie.html'));
});

app.get('/person.html', (req, res) =>
{
    res.sendFile(path.join(__dirname + '/person.html'));
});

app.get('/signin.html', (req, res) =>
{
    res.sendFile(path.join(__dirname + '/signin.html'));
});

app.get('/userprofile.html', (req, res) =>
{
    res.sendFile(path.join(__dirname + '/userprofile.html'));
});

init();
app.listen(port);

function findInArr(arr, attr, val)
{
    for(var i = 0; i < arr.length; i += 1)
    {
        if(arr[i][attr] === val)
        {
            return i;
        }
    }
    return -1;
}

function init()
{
    console.log("Starting Up");
    movies = JSON.parse(fs.readFileSync(path.join(__dirname + '/public/json/movie-data-short.json')));
    console.log(movies);

    people = [];

    for(movie in movies)
    {
        title = movies[movie]["Title"];

        //Get the director, see if they exist in the person array
        director = movies[movie]["Director"];
        let i = findInArr(people, "Name", director);
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
            i = findInArr(people, "Name", writer);
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
            i = findInArr(people, "Name", actor);
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