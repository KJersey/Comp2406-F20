const Enmap = require('enmap');

let users = new Enmap({name: "users"});
let reviews = new Enmap({name: "reviews"});
let movies = new Enmap({name: "movies"});
let people = new Enmap({name: "people"});

users.clear();
reviews.clear();
movies.clear();
people.clear();

users.import(JSON.stringify(require("./Default/Users.json")));
reviews.import(JSON.stringify(require("./Default/Reviews.json")));
movies.import(JSON.stringify(require("./Default/Movies.json")));
people.import(JSON.stringify(require("./Default/People.json")));