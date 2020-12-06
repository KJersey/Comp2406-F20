Jersey Aubin-Déry 101079607
Partner: Malcolm Smith 101143404
(p.s if you have word wrapping enabled, this might be hard to read)

Movie Database

OpenStack Information:

IP:         134.117.130.117
Port:       3000
Username:   student
Password:   JerMal2406

INSTALL AND RUN INSTRUCTIONS
cd MovieDatabase
node server.js

IF SERVER BREAKS, RUN THIS SCRIPT IN HOME
./reset.sh

- you are able to search for movies with the search bar found on the home page of the website, and
  if no movie matches exactly, will return whatever is first in the list of possible movies
- all business logic is completed in memory, and the actual JSON database is never being modified
- the website fully supports different sessions and for users to login on different sessions
- we templated our pages, with ejs
- the toolbar at the top of the page changes dynamically depending on if you are signed in or not
- the recommended similar movies at the bottom of a movie webpage changes with each load to a new random movie,
  there is no correlation between the viewed movie and recommended movies yet

The Movie Database allows you to view Movies, User Profiles, and People (Actors, etc.) without being signed in

The Movie Database allows you to do all of the above, create movies / persons (if you are a contributor account that is signed in)

List of URL's you can try out:

Webpages:
Index/home page:                                /
Movie page:                                     /movie/:imdbID
Person page:                                    /person/:name
Sign in page:                                   /signin
User profile page:                              /userprofile/:user
Create person:                                  /createUser     (must be signed into a a contributor)
Create movie:                                   /createMovie    (must be signed into a a contributor)

-----API REQUESTS-----

User:
Get info on a given user:                       /users/:username                (e.g. /users/Jersey)
Get all users:                                  /allUsers
Search for all users matching a query:          /searchUser/:query              (e.g. /searchUser/e)

Movie:
Get all movies:                                 /allMovies
Search for all movies matching a query:         /searchMovie/:query             (e.g. /searchMovie/Toy)  
Get a similar movie to a title (random movie)   /getSimilar/:title              (e.g. /getSimilar/test)
Get a list of similar movies:                   /getRecommended

Person:
Get info on a person:                           /people/:name                   (e.g. /people/Greg%20Kinnear)
Getl all people:                                /allPeople
Search for all people matching a query:         /searchPeople/:query            (e.g. /searchPeople/z)


-----TO BE UPDATED-----

User:
Delete a user with a given username:            /deleteUser/:username           (e.g. /deleteUser/Jersey)

Movie:
Get info on a given movie:
Delete a movie with a given imdbID:             /deleteMovie/:movieID           (e.g. /deleteMovie/tt0114709)
Modify a parameter (not the id) of a movie:     /modifyMovie/:movieID&:prop=:val 
                                                                                (e.g. /modifyMovie/tt0114319&Title=Test)

Person:
Delete a person with a given name:              /deletePerson/:name             (e.g. /deletePerson/Greg%20Kinnear)
Modify a paremeter of a person (for testing):   /modifyPerson/:name&:prop=:val  (e.g. /modifyPerson/name=Izabella%20Scorupco&Wrote=test)