Jersey Aubin-Déry 101079607
Partner: Malcolm Smith
(p.s if you have word wrapping enabled, this might be hard to read)

Movie Database

INSTALL AND RUN INSTRUCTIONS
cd --ProjectFolderPath
npm install
node server.js

- the business logic file is server.js
- all business logic is completed in memory, and the actual JSON database is never being modified

- we have started implemented using a template engine,
check out ./public/partials/

you can test the business logic for this project by...

Note: currently all requests are GET requests so you can just visit the webpage.
We will be changing this to POST requests later

List of GET requests you can try out:



Webpages:
Index/home page:                                /
Movie page:                                     /movie
Person page:                                    /person
Sign in page:                                   /signin
User profile page:                              /userprofile

Get info on a given user:                       /users/:username                (e.g. /users/Jersey)
Get all users:                                  /allUsers
Search for all users matching a query:          /searchUser/:query              (e.g. /searchUser/e)
Create a user with a username and password:     /createUser/username=:username&password=:password 
                                                                                (e.g. /createUser/username=Hello&password=123)
Delete a user with a given username:            /deleteUser/:username           (e.g. /deleteUser/Jersey)
Check if a user is a contributor:               /isContributor/:username        (e.g. isContributor/Dave)

Get info on a given movie:                      /movie/:movieID                 (e.g. /movie/tt0114709)
Get all movies:                                 /allMovies
Search for all movies matching a query:         /searchMovie/:query             (e.g. /searchMovie/Toy)
Create a movie with a title and imdbID:         /createMovie/title=:title&imdbID=:imdbID 
                                                                                (e.g. /createMovie/title=Test&imdbID=123)
Delete a movie with a given imdbID:             /deleteMovie/:movieID           (e.g. /deleteMovie/tt0114709)
Modify a parameter (not the id) of a movie:     /modifyMovie/:movieID&:prop=:val 
                                                                                (e.g. /modifyMovie/movieID=tt0114709&Title=Test)
                                                
Get a similar movie to a title (random movie)   /getSimilar/:title (e.g. /modifyMovie/test)
Get a list of similar movies:                   /getRecommended

Get info on a person:                           /people/:name                   (e.g. /people/Greg%20Kinnear)
Getl all people:                                /allPeople
Search for all people matching a query:         /searchPeople/:query            (e.g. /searchPeople/z)
Create a person with a name:                    /createPerson/name=:name        (e.g. /createPerson/name=First%20Last)
Delete a person with a given name:              /deletePerson/:name             (e.g. /deletePerson/Greg%20Kinnear)
Modify a paremeter of a person (for testing):   /modifyPerson/:name&:prop=:val  (e.g. /modifyPerson/name=Greg%20Kinnear&Wrote=test)
