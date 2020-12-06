//--------------------------------------REVIEW--------------------------------------

const Enmap = require("enmap");

let reviewsDB = new Enmap({name: "reviews"});

let userMethods = require("./user.js");
let usersDB = userMethods.usersDB;

let methods = 
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
        if(!methods.isValidReview(review)) return null;
        if(!userMethods.methods.getUser(review.user)) return null;
        
        if(methods.searchReviewByMovie(review.imdbID).filter(r => r.user === review.user).length !== 0) return null;

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

exports.reviewsDB = reviewsDB;
exports.methods = methods;