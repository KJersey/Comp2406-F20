const express = require('express');
const app = express();
const router = express.Router();
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { get } = require('http');
const { isContext } = require('vm');
const userMethods = require('./user.js')
const personMethods = require('./person.js')
const movieMethods = require('./movie.js')
const port = 8000;

let movies = require(__dirname + '/public/json/movie-data-short.json');
let people = personMethods.people;
let users = require(__dirname + '/public/json/users.json');

function init()
{
    console.log("Starting Up");
    // console.log(movies);

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

//--------------------------Pages--------------------------//

router.get('/', (req, res, next) =>
{
    let user = userMethods.methods.getUser(req.session.Username);
    res.render(path.join(__dirname + '/index'),
    {
        signedin: userMethods.methods.isSignedIn(req),
        contributor: userMethods.methods.isContributor(user)
    });
    next();
});

router.get('/movie/:movieID', (req, res, next) =>
{
    let m = movieMethods.methods.getMovie(req.params.movieID);
    let user = userMethods.methods.getUser(req.session.Username);
    if(!m)
    {
        res.render(path.join(__dirname + '/404'),
        {
            signedin: userMethods.methods.isSignedIn(req),
            contributor: userMethods.methods.isContributor(user)
        });
        return;
    }

    res.render(path.join(__dirname + '/movie'),
    {
        signedin: userMethods.methods.isSignedIn(req),
        contributor: userMethods.methods.isContributor(user),
        movie: m
    });
});

router.get('/createMovie', (req, res, next) =>
{
    let user = userMethods.methods.getUser(req.session.Username);
    if(!userMethods.methods.isContributor(user))
    {
        res.render(path.join(__dirname + '/404'),
        {
            signedin: userMethods.methods.isSignedIn(req),
            contributor: userMethods.methods.isContributor(user)
        });
        return;
    } 

    res.render(path.join(__dirname + '/createmovie'),
    {
        signedin: userMethods.methods.isSignedIn(req),
        contributor: userMethods.methods.isContributor(user)
    });
});

router.get('/person/:person', (req, res, next) =>
{
    let user = userMethods.methods.getUser(req.session.Username);
    let person = personMethods.methods.getPerson(req.params.person);
    res.render(path.join(__dirname + '/person'),
    {
        signedin: userMethods.methods.isSignedIn(req),
        contributor: userMethods.methods.isContributor(user),
        name: person.Name
    });
});

router.get('/createPerson', (req, res, next) => {
    let user = userMethods.methods.getUser(req.session.Username);
    if(!userMethods.methods.isContributor(user))
    {
        res.render(path.join(__dirname + '/404'),
        {
            signedin: userMethods.methods.isSignedIn(req),
            contributor: userMethods.methods.isContributor(user)
        });
        return;
    } 

    res.render(path.join(__dirname + '/createperson'),
    {
        signedin: userMethods.methods.isSignedIn(req),
        contributor: userMethods.methods.isContributor(user)
    });
});

router.get('/signin', (req, res, next) =>
{
    delete req.session.Username;
    res.render(path.join(__dirname + '/signin'),
    {
        signedin: false,
        contributor: false
    });
});

router.get('/userprofile', (req, res, next) =>
{
    let user = userMethods.methods.getUser(req.session.Username);
    if(!userMethods.methods.isSignedIn(req))
    {
        res.render(path.join(__dirname + '/404'),
        {
            signedin: userMethods.methods.isSignedIn(req),
            contributor: userMethods.methods.isContributor(user)
        });
        return;
    }

    res.redirect('/userprofile/' + req.session.Username)
});

router.get('/userprofile/:user', (req, res, next) =>
{
    let user = userMethods.methods.getUser(req.params.user);
    if(!user)
    {
        res.render(path.join(__dirname + '/404'),
        {
            signedin: userMethods.methods.isSignedIn(req),
            contributor: userMethods.methods.isContributor(user)
        });
        return;
    }

    let r = [];
    for(let i in user.Reviews)
    {
        r.push({});
        r[i].imdbID = user.Reviews[i].imdbID;
        r[i].Poster = movieMethods.methods.getMovie(user.Reviews[i].imdbID).Poster;
        r[i].Score = user.Reviews[i].Score;
    }

    let m = [];
    for(let i = 0; i < 5; ++i)
    {
        m.push(movieMethods.methods.getSimilar(null));
    }

    res.render(path.join(__dirname + '/userprofile'),
    {
        signedin: userMethods.methods.isSignedIn(req),
        contributor: userMethods.methods.isContributor(user),
        username: userMethods.methods.getUser(req.session.Username).Username,
        reviews: r,
        movies: m
    });
});

//--------------------------User API-----------------------//

router.post('/login', (req, res, next) =>
{
    let body = req.body;
    let user = userMethods.methods.getUser(body.Username);
    if(!user || body.Password !== user.Password)
    {
        res.redirect(req.baseUrl + '/404');
        return;
    }
    
    req.session.Username = body.Username;
    res.redirect(req.baseUrl + '/userprofile');
});

router.post('/createUser', (req, res, next) =>
{
    let body = req.body;
    if(body.Username === '' || body.Password === '' || userMethods.methods.getUser(body.Username))
    {
        res.redirect(req.baseUrl + '/404');
        return;
    }
    
    let newUser = {Username: body.Username, Password: body.Password, Contributor: false, Reviews: []};
    users.push(newUser);
    req.session.Username = body.Username;
    res.redirect(req.baseUrl + '/userprofile');
});

router.get('/users/:username', (req, res, next) =>
{
    res.send(userMethods.methods.getUser(req.params.username));
});

router.get('/allUsers', (req, res, next) =>
{
    res.send(users); 
});

router.get('/searchUser/:query', (req, res, next) =>
{
    res.send(user.searchUser(req.params.query));
});

//Will be post
router.get('/deleteUser/:username', (req, res, next) =>
{
    res.send(userMethods.methods.deleteUser(req.params.username));
});

router.get('/userMethods.methods.isContributor/:username', (req, res, next) =>
{
    res.send(userMethods.methods.userMethods.methods.isContributor(userMethods.methods.getUser(req.params.username)));
});

//--------------------------Movie API-----------------------//

router.get('/getMovie/:movieID', (req, res, next) =>
{

    res.send(movieMethods.methods.getMovie(req.params.movieID));
});

router.get('/allMovies', (req, res, next) =>
{
    res.send(movies);
});

router.get('/searchMovie/:query', (req, res, next) =>
{
    res.send(movieMethods.methods.searchMovie(req.params.query));
});

router.post('/createMovie', (req, res, next) =>
{
    let user = userMethods.methods.getUser(req.session.Username);
    if(!userMethods.methods.isSignedIn(req) || !userMethods.methods.isContributor(user))
    {
        res.render(path.join(__dirname + '/404'),
        {
            signedin:false,
            contributor: false
        });
        return;
    }

    let body = req.body;
    
    if (movieMethods.methods.createMovie(body)) {
        res.redirect('/movie/' + body.imdbID);
    }
});

//Will be post
router.get('/deleteMovie/:movieID', (req, res, next) =>
{
    res.send(movieMethods.methods.deleteMovie(req.params.movieID));
});

//Will be post
router.get('/modifyMovie/:movieID&:prop=:val', (req, res, next) =>
{
    res.send(movieMethods.methods.modifyMovie(req.params.movieID, req.params.prop, req.params.val));
});

router.get('/getSimilar/:title', (req, res, next) =>
{
    res.send(movieMethods.methods.getSimilar(req.params.title));
});

router.get('/getRecommended', (req, res, next) =>
{
    res.send(movieMethods.methods.getRecommendations(null));
});

//--------------------------People API----------------------//

router.get('/people/:name', (req, res, next) =>
{
    res.send(personMethods.methods.getPerson(req.params.name));
});

router.get('/allPeople', (req, res, next) =>
{
    res.send(people);
});

router.get('/searchPeople/:query', (req, res, next) =>
{
    res.send(personMethods.methods.searchPerson(req.params.query));
});

router.post('/createPerson', (req, res, next) =>
{
    let user = userMethods.methods.getUser(req.session.Username);
    if(!userMethods.methods.isSignedIn(req) || !userMethods.methods.isContributor(user))
    {
        res.render(path.join(__dirname + '/404'),
        {
            signedin:false,
            contributor: false
        });
        return;
    }

    let body = req.body;
    
    if (personMethods.methods.createPerson(body)) {
        res.redirect('/person/' + body.name);
    }
});

//Will be post
router.get('/deletePerson/:name', (req, res, next) =>
{
    res.send(personMethods.methods.deletePerson(req.params.name));
});

//Internal, here for testing
router.get('/modifyPerson/name=:name&:prop=:val', (req, res, next) =>
{
    res.send(personMethods.methods.modifyPerson(req.params.name, req.params.prop, req.params.val));
});

//-------------------------------404------------------------------//

router.get('*', (req, res, next) =>
{
    let user = userMethods.methods.getUser(req.session.Username);
    res.render(path.join(__dirname + '/404'),
    {
        signedin: userMethods.methods.isSignedIn(req),
        contributor: userMethods.methods.isContributor(user)
    });
});

//--------------------------Server Stuff--------------------------//

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(session(
{
    secret: 'pepesecret',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}
}
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(router);
init();
app.listen(port);