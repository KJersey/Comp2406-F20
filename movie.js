//---------------------------------------MOVIE---------------------------------------

let movies = require(__dirname + '/public/json/movie-data.json');

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
        return movies.find(movie => movie.imdbID === movieID);
    },

    searchMovie: function (query)
    {
        // if query = "dragon", returns array of all users which contain dragon in their username
        return movies.filter(movie => movie.Title.toLowerCase().includes(query.toLowerCase()));
    },

    createMovie: function (newMovie)
    {
        if(!methods.isValidMovie(newMovie)) return null;
        if(methods.getMovie(newMovie.imdbID)) return null;

        for (prop in movies[0]) {
            if(!newMovie[prop]) {
                newMovie[prop] = 'N/A';
            }
        }

        movies.push(newMovie);

        return newMovie;
    },

    deleteMovie: function (movieID)
    {
        let movie = methods.getMovie(movieID);
        movies = movies.filter(m => m !== movie);
        return movies;
    },

    modifyMovie: function (movieID, prop, val)
    {
        let movie = methods.getMovie(movieID);
        if(!movie) return null;

        if(prop != "imdbID" && movie.hasOwnProperty(prop)) {
            movie[prop] = val;
        }

        return movie;
    },

    getSimilar: function (title)
    {
        return movies[Math.floor(Math.random() * movies.length)];
    },

    getRecommendations: function (username)
    {
        let recommended = [];
        
        for(let i = 0; i < 5; i++) {
            let movie = methods.getSimilar(null);
            if(!recommended.includes(movie)) recommended.push(movie);
        }

        return recommended;
    }
};

exports.movies = movies;
exports.methods = methods;