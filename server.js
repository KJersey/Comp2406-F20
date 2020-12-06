const math = require('mathjs');
const express = require('express');
const app = express();
const router = express.Router();
const Enmap = require("enmap");
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { get } = require('http');
const { isContext } = require('vm');
const userAndReviewMethods = require('./user.js');
const personMethods = require('./person.js');
const movieMethods = require('./movie.js');
const port = 8000;

let users = userAndReviewMethods.usersDB;
let reviews = userAndReviewMethods.reviewsDB;
let movies = movieMethods.moviesDB;
let people = personMethods.peopleDB;

function init()
{
    console.log("Starting Up");

    console.log("Finished Starting");
}

//--------------------------Pages--------------------------//

router.get('/', (req, res, next) =>
{
    let user = userAndReviewMethods.userMethods.getUser(req.session.Username);
    res.render(path.join(__dirname + '/index'),
    {
        signedin: userAndReviewMethods.userMethods.isSignedIn(req),
        contributor: userAndReviewMethods.userMethods.isContributor(user)
    });
});

router.get('/movie/:movieID', (req, res, next) =>
{
    let m = movieMethods.methods.getMovie(req.params.movieID);
    let user = userAndReviewMethods.userMethods.getUser(req.session.Username);
    if(!m)
    {
        res.render(path.join(__dirname + '/404'),
        {
            signedin: userAndReviewMethods.userMethods.isSignedIn(req),
            contributor: userAndReviewMethods.userMethods.isContributor(user)
        });
        return;
    }

    let r = userAndReviewMethods.reviewMethods.searchReviewByMovie(req.params.movieID);

    let ratings = [];

    for(let rev in m.Ratings)
    {
        let string = m.Ratings[rev].Value;
        string = string.replace("%", "/100");
        ratings.push({score: math.round(math.evaluate(string) * 100) / 10});
    }

    res.render(path.join(__dirname + '/movie'),
    {
        signedin: userAndReviewMethods.userMethods.isSignedIn(req),
        contributor: userAndReviewMethods.userMethods.isContributor(user),
        movie: m,
        reviews: r,
        ratings: ratings,
        similar: movieMethods.methods.getSimilar(m.imdbID)
    });
});

router.get('/createMovie', (req, res, next) =>
{
    let user = userAndReviewMethods.userMethods.getUser(req.session.Username);
    if(!userAndReviewMethods.userMethods.isContributor(user))
    {
        res.render(path.join(__dirname + '/404'),
        {
            signedin: userAndReviewMethods.userMethods.isSignedIn(req),
            contributor: userAndReviewMethods.userMethods.isContributor(user)
        });
        return;
    } 

    res.render(path.join(__dirname + '/createmovie'),
    {
        signedin: userAndReviewMethods.userMethods.isSignedIn(req),
        contributor: userAndReviewMethods.userMethods.isContributor(user)
    });
});

router.get('/createReview/:imdbID', (req, res, next) =>
{
    let user = userAndReviewMethods.userMethods.getUser(req.session.Username);
    if(!user)
    {
        res.render(path.join(__dirname + '/404'),
        {
            signedin: userAndReviewMethods.userMethods.isSignedIn(req),
            contributor: userAndReviewMethods.userMethods.isContributor(user)
        });
        return;
    } 

    if(!movieMethods.methods.getMovie(req.params.imdbID))
    {
        res.render(path.join(__dirname + '/404'),
        {
            signedin: userAndReviewMethods.userMethods.isSignedIn(req),
            contributor: userAndReviewMethods.userMethods.isContributor(user)
        });
        return;
    } 

    res.render(path.join(__dirname + '/createreview'),
    {
        signedin: userAndReviewMethods.userMethods.isSignedIn(req),
        contributor: userAndReviewMethods.userMethods.isContributor(user),
        imdbID: req.params.imdbID
    });
});

router.get('/person/:person', (req, res, next) =>
{
    let user = userAndReviewMethods.userMethods.getUser(req.session.Username);
    let person = personMethods.methods.getPerson(req.params.person);

    if(!person)
    {
        res.render(path.join(__dirname + '/404'),
        {
            signedin: userAndReviewMethods.userMethods.isSignedIn(req),
            contributor: userAndReviewMethods.userMethods.isContributor(user)
        });
        return;
    }

    let m = [];
    for(let i in person.Acted)
    {
        m.push(movieMethods.methods.getMovie(person.Acted[i]));
    }
    
    for(let i in person.Wrote)
    {
        m.push(movieMethods.methods.getMovie(person.Wrote[i]));
    }

    for(let i in person.Directed)
    {
        m.push(movieMethods.methods.getMovie(person.Directed[i]));
    }

    m = Array.from(new Set(m));

    let isFollowing = false;
    if(userAndReviewMethods.userMethods.isSignedIn(req))
    {
        isFollowing = userAndReviewMethods.userMethods.isFollowingPerson(req.session.Username, person.Name);
    }

    let collaborators = personMethods.methods.getFrequentCollaborators(person.Name);

    res.render(path.join(__dirname + '/person'),
    {
        signedin: userAndReviewMethods.userMethods.isSignedIn(req),
        contributor: userAndReviewMethods.userMethods.isContributor(user),
        name: person.Name,
        movies: m,
        collaborators: collaborators,
        isFollowing: isFollowing
    });
});

router.get('/createPerson', (req, res, next) => {
    let user = userAndReviewMethods.userMethods.getUser(req.session.Username);
    if(!userAndReviewMethods.userMethods.isContributor(user))
    {
        res.render(path.join(__dirname + '/404'),
        {
            signedin: userAndReviewMethods.userMethods.isSignedIn(req),
            contributor: userAndReviewMethods.userMethods.isContributor(user)
        });
        return;
    } 

    res.render(path.join(__dirname + '/createperson'),
    {
        signedin: userAndReviewMethods.userMethods.isSignedIn(req),
        contributor: userAndReviewMethods.userMethods.isContributor(user)
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
    let user = userAndReviewMethods.userMethods.getUser(req.session.Username);
    if(!userAndReviewMethods.userMethods.isSignedIn(req))
    {
        res.render(path.join(__dirname + '/404'),
        {
            signedin: userAndReviewMethods.userMethods.isSignedIn(req),
            contributor: userAndReviewMethods.userMethods.isContributor(user)
        });
        return;
    }

    res.redirect('/userprofile/' + req.session.Username)
});

router.get('/userprofile/:user', (req, res, next) =>
{
    let user = userAndReviewMethods.userMethods.getUser(req.params.user);
    if(!user)
    {
        res.render(path.join(__dirname + '/404'),
        {
            signedin: userAndReviewMethods.userMethods.isSignedIn(req),
            contributor: userAndReviewMethods.userMethods.isContributor(user)
        });
        return;
    }

    let r = userAndReviewMethods.reviewMethods.searchReviewByUser(user);

    for(let m in r)
    {
        r[m].title = movieMethods.methods.getMovie(r[m].imdbID).Title
        r[m].poster = movieMethods.methods.getMovie(r[m].imdbID).Poster;
    }

    let m = userAndReviewMethods.userMethods.getRecommendedMovies(user.Username);

    let onOwnProfile = false;
    let isFollowing = false;
    if(userAndReviewMethods.userMethods.isSignedIn(req))
    {
        if(req.session.Username.toLowerCase() === user.Username.toLowerCase())
        {
            onOwnProfile = true;
        }
        else
        {
            isFollowing = userAndReviewMethods.userMethods.isFollowingUser(req.session.Username, user.Username);
        }
    }

    let followers = users.filterArray(u => u.FollowedUsers.includes(user.Username)).length;
    let followingUsers = user.FollowedUsers;
    let followingPeople = user.FollowedPeople;

    res.render(path.join(__dirname + '/userprofile'),
    {
        signedin: userAndReviewMethods.userMethods.isSignedIn(req),
        contributor: userAndReviewMethods.userMethods.isContributor(user),
        user: user,
        isOwnProfile: onOwnProfile,
        followers: followers,
        followingUsers: followingUsers,
        followingPeople: followingPeople,
        isFollowing: isFollowing,
        reviews: r,
        movies: m
    });
});

//--------------------------User API-----------------------//

router.post('/login', (req, res, next) =>
{
    let body = req.body;
    let user = userAndReviewMethods.userMethods.getUser(body.Username);
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
    if(body.Username === '' || body.Password === '' || userAndReviewMethods.userMethods.getUser(body.Username))
    {
        res.redirect(req.baseUrl + '/404');
        return;
    }
    
    let newUser = {Username: body.Username, Password: body.Password, Contributor: false, Reviews: []};
    userAndReviewMethods.userMethods.createUser(newUser);
    req.session.Username = body.Username;
    res.redirect(req.baseUrl + '/userprofile');
});

router.get('/users/:username', (req, res, next) =>
{
    res.send(userAndReviewMethods.userMethods.getUser(req.params.username));
});

router.get('/allUsers', (req, res, next) =>
{
    res.send(users); 
});

router.get('/searchUser/:query', (req, res, next) =>
{
    res.send(userAndReviewMethods.userMethods.searchUser(req.params.query));
});

router.post('/updateUserFollowage', (req, res, next) =>
{
    let user = userAndReviewMethods.userMethods.getUser(req.session.Username);
    if(!userAndReviewMethods.userMethods.isSignedIn(req))
    {
        res.render(path.join(__dirname + '/404'),
        {
            signedin:false,
            contributor: false
        });
        return;
    }

    let body = req.body;

    if(body.val)
    {
        userAndReviewMethods.userMethods.followUser(user.Username, body.user);
    }
    else
    {
        userAndReviewMethods.userMethods.unfollowUser(user.Username, body.user);
    }
});

router.post('/updatePersonFollowage', (req, res, next) =>
{
    let user = userAndReviewMethods.userMethods.getUser(req.session.Username);
    if(!userAndReviewMethods.userMethods.isSignedIn(req))
    {
        res.render(path.join(__dirname + '/404'),
        {
            signedin:false,
            contributor: false
        });
        return;
    }

    let body = req.body;

    if(body.val)
    {
        userAndReviewMethods.userMethods.followPerson(user.Username, body.person);
    }
    else
    {
        userAndReviewMethods.userMethods.unfollowPerson(user.Username, body.person);
    }
});

router.post('/updateContributor', (req, res, next) =>
{
    let user = userAndReviewMethods.userMethods.getUser(req.session.Username);
    if(!userAndReviewMethods.userMethods.isSignedIn(req))
    {
        res.render(path.join(__dirname + '/404'),
        {
            signedin:false,
            contributor: false
        });
        return;
    }

    let body = req.body;
    
    userAndReviewMethods.userMethods.updateContributor(user, body.val);
});

router.get('/isContributor/:username', (req, res, next) =>
{
    res.send(userAndReviewMethods.userMethods.userMethods.userMethods.isContributor(userAndReviewMethods.userMethods.getUser(req.params.username)));
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
    let user = userAndReviewMethods.userMethods.getUser(req.session.Username);
    if(!userAndReviewMethods.userMethods.isSignedIn(req) || !userAndReviewMethods.userMethods.isContributor(user))
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

router.post('/createReview', (req, res, next) =>
{
    let user = userAndReviewMethods.userMethods.getUser(req.session.Username);
    if(!userAndReviewMethods.userMethods.isSignedIn(req))
    {
        res.render(path.join(__dirname + '/404'),
        {
            signedin:false,
            contributor: false
        });
        return;
    }

    let body = req.body;
    body.user = user.Username;
    
    if (userAndReviewMethods.reviewMethods.createReview(body))
    {
        res.redirect('/movie/' + body.imdbID);
    }
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
    let user = userAndReviewMethods.userMethods.getUser(req.session.Username);
    if(!userAndReviewMethods.userMethods.isSignedIn(req) || !userAndReviewMethods.userMethods.isContributor(user))
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
        res.redirect('/person/' + body.Name);
    }
});

//-------------------------------404------------------------------//

router.get('*', (req, res, next) =>
{
    let user = userAndReviewMethods.userMethods.getUser(req.session.Username);
    res.render(path.join(__dirname + '/404'),
    {
        signedin: userAndReviewMethods.userMethods.isSignedIn(req),
        contributor: userAndReviewMethods.userMethods.isContributor(user)
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