//---------------------------------------MOVIE---------------------------------------

const Enmap = require("enmap");
const peopleDB = require("./person");

let moviesDB = new Enmap({name: "movies"});

let methods = 
{
    isValidMovie: function (movie)
    {
        if (!movie) {
            return false;
        }

        if (!movie.hasOwnProperty("Title") || !movie.hasOwnProperty("imdbID")) {
            return false;
        }

        return true;
    },

    getMovie: function (movieID)
    {
        return moviesDB.fetch(movieID);
    },

    searchMovie: function (query)
    {
        return moviesDB.filterArray(movie => movie.Title.toLowerCase().includes(query.toLowerCase()));
    },

    searchMovieByRated: function (query)
    {
        return moviesDB.filterArray(movie => movie.RatedtoLowerCase() == query.toLowerCase());
    },

    searchMovieByGenre: function (query)
    {
        return moviesDB.filterArray(movie => movie.Genre.toLowerCase().includes(query.toLowerCase()));
    },

    searchMovieByDirector: function (query)
    {
        return moviesDB.filterArray(movie => movie.Director.toLowerCase().includes(query.toLowerCase()));
    },

    searchMovieByWriter: function (query)
    {
        return moviesDB.filterArray(movie => movie.Writer.toLowerCase().includes(query.toLowerCase()));
    },

    searchMovieByActor: function (query)
    {
        return moviesDB.filterArray(movie => movie.Actors.toLowerCase().includes(query.toLowerCase()));
    },

    searchMovieByPerson: function (query)
    {
        let movies = [];
        movies = movies.concat(methods.searchMovieByDirector(query));
        movies = movies.concat(methods.searchMovieByWriter(query));
        movies = movies.concat(methods.searchMovieByActor(query));

        movies = movies.filter((movie, index, self) =>
        index === self.findIndex((t) => (
            t.place === movie.place && t.imdbID === movie.imdbID
        )));

        return movies;
    },

    createMovie: function (newMovie)
    {
        if(!methods.isValidMovie(newMovie)) return null;
        if(methods.getMovie(newMovie.imdbID)) return null;

        for (prop in moviesDB.array()[0]) {
            if(!newMovie[prop]) {
                newMovie[prop] = 'N/A';
            }
        }

        let directors = newMovie.Director.split(", ");
        for(let i in directors)
        {
            if(!peopleDB.fetch(directors[i])) return null;
        }

        let writers = newMovie.Writer.split(", ");
        for(let i in writers)
        {
            if(!peopleDB.fetch(writers[i])) return null;
        }

        let actors = newMovie.Actors.split(", ");
        for(let i in actors)
        {
            if(!peopleDB.fetch(actors[i])) return null;
        }

        moviesDB.set(newMovie.imdbID, newMovie);

        for(let i in directors)
        {
            peopleDB.push(directors[i], newMovie.imdbID, "Directed");
        }

        for(let i in writers)
        {
            peopleDB.push(writers[i], newMovie.imdbID, "Wrote");
        }

        for(let i in actors)
        {
            peopleDB.push(actors[i], newMovie.imdbID, "Acted");
        }

        moviesDB.set(newMovie.imdbID, newMovie);

        return newMovie;
    },

    deleteMovie: function (movieID)
    {
        moviesDB.delete(movieID);
    },

    modifyMovie: function (movieID, prop, val)
    {
        let movie = methods.getMovie(movieID);
        if(!movie) return null;

        if(prop != "imdbID" && movie.hasOwnProperty(prop)) {
            moviesDB.set(movieID, val, prop);
        }

        return methods.getMovie(movieID);
    },

    getSimilar: function (imdbID)
    {
        let movie = methods.getMovie(imdbID);
        if(!movie) return null;

        let genres = movie.Genre.split(", ");
        let rated = movie.Rated;

        let similarList = [];
        
        for(let i in genres)
        {
            similarList = similarList.concat(methods.searchMovieByGenre(genres[i]));
        }

        similarList = similarList.filter(movie => movie.Rated === rated);

        if(similarList.length <= 1)
        {
            return moviesDB.random(1)[0];
        }

        let similar = movie;
        while(similar.Title === movie.Title)
        {
            similar = similarList[Math.floor(Math.random() * similarList.length)];
        }
        
        return similar;
    },

    /*getMovieFromIMDB: function (URL) {
        let URL = "http://www.imdb.com/title/tt0058331/";
        String[] lines = loadStrings(url);
        String html = join(lines, ""); 
    }*/
};

exports.moviesDB = moviesDB;
exports.methods = methods;