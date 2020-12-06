//---------------------------------------MOVIE---------------------------------------

const Enmap = require("enmap");

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
        return moviesDB.filterArray(movie => movie.Rated == query);
    },

    searchMovieByGenre: function (query)
    {
        return moviesDB.filterArray(movie => movie.Genre.includes(query));
    },

    searchMovieByDirector: function (query)
    {
        return moviesDB.filterArray(movie => movie.Director.includes(query));
    },

    searchMovieByWriter: function (query)
    {
        return moviesDB.filterArray(movie => movie.Writer.includes(query));
    },

    searchMovieByActor: function (query)
    {
        return moviesDB.filterArray(movie => movie.Actors.includes(query));
    },

    createMovie: function (newMovie)
    {
        if(!methods.isValidMovie(newMovie)) return null;
        if(methods.getMovie(newMovie.imdbID)) return null;

        for (prop in moviesDB[0]) {
            if(!newMovie[prop]) {
                newMovie[prop] = 'N/A';
            }
        }

        moviesDB.set(newMovie.imdbID, newMovie);

        return newMovie;
    },

    deleteMovie: function (movieID)
    {
        moviesDB.remove(movieID);
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
};

exports.moviesDB = moviesDB;
exports.methods = methods;