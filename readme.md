Jersey Aubin-Déry 101079607
Partner: Malcolm Smith

Movie Database

//HTML
home.html		    The home page, allows the user to search for a movie, results will be shown in a drop
                    down menu appearing from the bottom of the search bar
signin.html		    The sign in page, allows the user to sign into their account, or create a new account
userprofile.html    The user's profile page, shows basic user info, as well as movies they've watched and reviews.
                    - will have same layout as other users, but will dynamically add settings icon if the profile 
                    being viewed belongs to the user that is currently signed in, similar to instagram or facebook
movie.html			The movie page, shows basic movie info, as well as user reviews and average score.
                    - the movies themselves will be objects in our database, and will have some properties
                    - movies will have category / genre tags, which will be used to recommend similar movies
                    - movie objects will have links to person objects (actors, directors, etc.) 
                    - movie objects will have links to other movies in a series
person.html         The person page, shows information on an actor/actress/director/etc.
                    - people objects will have links towards movies they have worked on or are associated with

//CSS
style.css		    Contains css to style the pages instead of css inside the html

//JS
script.js		    Contains the js code for the home and sign in page

Additional functionality:
Simple js functions for changing pages, such as:
                    - Home button takes you to home page
                    - Sign In button takes you to signin page
                    - Signing in or creating a new account takes you to user profile page
                    - Hitting enter on search bar takes you to movie page
                    - Clicking on a person/movie will take you to the person/movie page

Future Functionality Considered:
As far as recommending similar movies to users, different properties of movies will be observed with different 
weights, such as:
                    - Sequels / Prequel movies (highest priority)
                    - Similar genre of movie
                    - Similar cast of actors, directors
                    - Similar ratings to this movie
                    - Movies also reviewed by the same users