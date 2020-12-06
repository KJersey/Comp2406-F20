//---------------------------------------PERSON---------------------------------------

const Enmap = require("enmap");

let peopleDB = new Enmap({name: "people"});
let moviesDB = new Enmap({name: "movies"});

let methods = 
{
    isValidPerson: function (person)
    {
        if (!person) {
            return false;
        }

        if (!person.hasOwnProperty("Name")) {
            return false;
        }

        return true;
    },

    getPerson: function (personName)
    {
        return peopleDB.fetch(personName);
    },

    searchPerson: function (query)
    {
        return peopleDB.filterArray(person => person.Name.toLowerCase().includes(query.toLowerCase()));
    },

    createPerson: function (newPerson)
    {
        if(!methods.isValidPerson(newPerson)) return null;
        if(methods.getPerson(newPerson.name)) return null;

        peopleDB.set(newPerson.Name, newPerson);

        return newPerson;
    },

    deletePerson: function (personName)
    {
        let person = getPerson(personName);
        peopleDB = peopleDB.filter(p => p !== person);
        return peopleDB;
    },

    modifyPerson: function (personName, prop, val)
    {
        let person = methods.getPerson(personName);
        if(!person) return null;

        if(prop != "Name" && person.hasOwnProperty(prop)) {
            personDB.set(name, val, prop);
        }

        return methods.getPerson(personName);
    },

    getFrequentCollaborators: function (personName)
    {
        let person = methods.getPerson(personName);
        if(!person) return [];

        let movies = moviesDB.filterArray(movie => movie.Director.includes(person.Name));
        movies = movies.concat(moviesDB.filterArray(movie => movie.Writer.includes(person.Name)));
        movies = movies.concat(moviesDB.filterArray(movie => movie.Actors.includes(person.Name)));
        movies = Array.from(new Set(movies)); // remove duplicates

        let collaborators = new Map();

        for (let m in movies) {
            let movie = movies[m];
            let directors = movie.Director.split(", ");
            for (let d in directors) {
                let director = directors[d];
                if (collaborators.get(director) === undefined) {
                    collaborators.set(director, 1);
                } else {
                    collaborators.set(director, collaborators.get(director) + 1);
                }
            }

            let writers = movie.Writer.split(", ");
            for (let w in writers) {
                let writer = writers[w].split(" (")[0];
                if (collaborators.get(writer) === undefined) {
                    collaborators.set(writer, 1);
                } else {
                    collaborators.set(writer, collaborators.get(writer) + 1);
                }
            }

            let actors = movie.Actors.split(", ");
            for (let a in actors) {
                let actor = actors[a];
                if (collaborators.get(actor) === undefined) {
                    collaborators.set(actor, 1);
                } else {
                    collaborators.set(actor, collaborators.get(actor) + 1);
                }
            }
        }

        collaborators.delete(personName);

        collaborators = new Map([...collaborators.entries()].sort((a, b) => b[1] - a[1]));

        return Array.from(collaborators).slice(0, 5);
    }
};

exports.peopleDB = peopleDB;
exports.methods = methods;