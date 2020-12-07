const Enmap = require("enmap");

const personMethods = require('./person.js');
const movieMethods = require('./movie.js');

let usersDB = new Enmap({name: "users"});
let reviewMethods;

let reviewsDB = new Enmap({name: "reviews"});
let userMethods;

let moviesDB = new Enmap({name: "movies"});

//---------------------------------------USER---------------------------------------

userMethods = 
{
    isValidUser: function (user)
    {
        if (!user) {
            return false;
        }

        if (!user.hasOwnProperty("Username") || !user.hasOwnProperty("Password")) {
            return false;
        }

        return true;
    },

    isSignedIn: function (req)
    {
        return typeof req.session.Username !== 'undefined';
    },

    getUser: function (username)
    {
        if(!username) return undefined;
        return usersDB.find(user => user.Username.toLowerCase() === username.toLowerCase());
    },

    searchUser: function (query)
    {
        return usersDB.filterArray(user => user.Username.toLowerCase().includes(query.toLowerCase()));
    },

    createUser: function (newUser)
    {
        if(!userMethods.isValidUser(newUser)) return null;
        if(userMethods.getUser(newUser.Username)) return null;

        usersDB.set(newUser.Username, newUser);

        return newUser;
    },

    deleteUser: function (username)
    {
        let user = userMethods.getUser(username);
        if(!user) return;

        for(r in user.Reviews)
        {
            reviewMethods.deleteReview(user.Reviews[r]);
        }

        usersDB.delete(username);
    },

    isFollowingUser: function (username, followerName)
    {
        if(username === followerName) return false;

        let user = userMethods.getUser(username);
        if(!user) return false;

        let follower = userMethods.getUser(followerName);
        if(!follower) return false;

        return user.FollowedUsers.includes(follower.Username);
    },

    followUser: function (username, followerName)
    {
        if(username === followerName) return;

        let user = userMethods.getUser(username);
        if(!user) return;

        let follower = userMethods.getUser(followerName);
        if(!follower) return;

        usersDB.push(user.Username, follower.Username, "FollowedUsers");
    },

    unfollowUser: function (username, followerName)
    {
        if(username === followerName) return;

        let user = userMethods.getUser(username);
        if(!user) return;

        let follower = userMethods.getUser(followerName);
        if(!follower) return;

        usersDB.remove(user.Username, follower.Username, "FollowedUsers");
    },

    isFollowingPerson: function (username, personName)
    {
        let user = userMethods.getUser(username);
        if(!user) return false;

        let person = personMethods.methods.getPerson(personName);
        if(!person) return false;

        return user.FollowedPeople.includes(person.Name);
    },

    followPerson: function (username, personName)
    {
        let user = userMethods.getUser(username);
        if(!user) return;

        let person = personMethods.methods.getPerson(personName);
        if(!person) return;

        usersDB.push(user.Username, person.Name, "FollowedPeople");
    },

    unfollowPerson: function (username, personName)
    {
        let user = userMethods.getUser(username);
        if(!user) return;

        let person = personMethods.methods.getPerson(personName);
        if(!person) return;

        usersDB.remove(user.Username, person.Name, "FollowedPeople");
    },

    updateContributor: function(user, val)
    {
        if(!user) return false;
        usersDB.set(user.Username, val, "Contributor");
    },

    isContributor: function (user)
    {
        if(!user) return false;
        if(!user.hasOwnProperty('Contributor')) return false;
        return user.Contributor;
    },

    getRecommendedMovies: function (userName)
    {
        let user = userMethods.getUser(userName);
        if(!user) return moviesDB.random(4);

        let recommended = new Map();

        for (let followed in user.FollowedUsers) {
            let f = userMethods.getUser(user.FollowedUsers[followed]);
            for (let reviewID in f.Reviews) {
                let movie = movieMethods.methods.getMovie(reviewMethods.getReview(f.Reviews[reviewID]).imdbID);
                if (recommended.get(movie.imdbID) === undefined) {
                    recommended.set(movie.imdbID, 1);
                } else {
                    recommended.set(movie.imdbID, recommended.get(movie.imdbID) + 1);
                }
            }
        }
        
        for (let followed in user.FollowedPeople) {
            let p = personMethods.methods.getPerson(user.FollowedPeople[followed]);
            for (let movieID in p.Acted) {
                movie = (movieMethods.methods.getMovie(p.Acted[movieID]));
                if (recommended.get(movie.imdbID) === undefined) {
                    recommended.set(movie.imdbID, 1);
                } else {
                    recommended.set(movie.imdbID, recommended.get(movie.imdbID) + 1);
                }
            }
            for (let movieID in p.Wrote) {
                movie = movieMethods.methods.getMovie(p.Wrote[movieID]);
                if (recommended.get(movie.imdbID) === undefined) {
                    recommended.set(movie.imdbID, 1);
                } else {
                    recommended.set(movie.imdbID, recommended.get(movie.imdbID) + 1);
                }
            }
            for (let movieID in p.Directed) {
                movie = movieMethods.methods.getMovie(p.Directed[movieID]);
                if (recommended.get(movie.imdbID) === undefined) {
                    recommended.set(movie.imdbID, 1);
                } else {
                    recommended.set(movie.imdbID, recommended.get(movie.imdbID) + 1);
                }
            } 
        }

        for(let rev in user.Reviews)
        {
            recommended.delete(reviewMethods.getReview(user.Reviews[rev]).imdbID);
        }

        recommended = new Map([...recommended.entries()].sort((a, b) => b[1] - a[1]));
        recommended = Array.from(new Set(recommended)); // remove duplicates
        recommended = Array.from(recommended).slice(0, 4);

        let movies = [];

        for(let m in recommended)
        {
            movies.push(movieMethods.methods.getMovie(recommended[m][0]));
        }

        return movies;
    }
};

//--------------------------------------REVIEW--------------------------------------

reviewMethods = 
{
    isValidReview: function (review)
    {
        if (!review) {
            return false;
        }

        if (!review.hasOwnProperty("score")) {
            return false;
        }

        return true;
    },


    getReview: function (reviewID)
    {
        if(!reviewID) return undefined;
        return reviewsDB.fetch(reviewID);
    },

    searchReviewByMovie: function (query)
    {
        return reviewsDB.findAll("imdbID", query);
    },

    searchReviewByUser: function (user)
    {
        return reviewsDB.filterArray(review => review.user.toLowerCase() === user.Username.toLowerCase());
    },

    createReview: function (review)
    {
        if(!reviewMethods.isValidReview(review)) return null;
        if(!userMethods.getUser(review.user)) return null;
        
        if(reviewMethods.searchReviewByMovie(review.imdbID).filter(r => r.user === review.user).length !== 0) return null;

        if(!review.hasOwnProperty("summary")) review.summary = "";
        if(!review.hasOwnProperty("description")) review.description = "";
        
        let reviewID = reviewsDB.autonum.toString();
        
        reviewsDB.set(reviewID, review);
        usersDB.push(review.user, reviewID, "Reviews");

        return review;
    },

    deleteReview: function (reviewID)
    {
        let review = reviewsDB.fetch(reviewID);
        if(!review) return;
        let username = review.user;
        usersDB.remove(username, reviewID, "Reviews");
        reviewsDB.delete(reviewID);
    },

};

exports.usersDB = usersDB;
exports.userMethods = userMethods;
exports.reviewsDB = reviewsDB;
exports.reviewMethods = reviewMethods;