app.post("/login", function(req, res, next){
    //check that username and password are correct
    //If they are correct, set req.session.user = to the user, and redirect
    //If they are not correct, send 401 with invalid credential message
    db.collection("users").findOne({username: req.body.username}, function(err, result){
      //Once the database is finished looking for that user, the do this:
      if(err){
        res.status(500).send("Server broke. Maybe try again.");
        return;
      }
  
      if(!result){
        res.status(400).send("Unknown user.");
        return;
      }
  
      //The user does exist
      if(result.password == req.body.password){
        //the password was good
        req.session.username = req.body.username;
        res.redirect("/users/" + req.body.username);
        return;
      }else{
        res.status(404).send("Login unsuccessful.");
        return;
      }
    })
  })
  

  app.post("/users", function(req, res, next){
    if(req.body.username && req.body.password){
      newUser = {username: req.body.username, password: req.body.password};
      newUser.questions_created = [];
      newUser.quizzes_created = [];
      newUser.quiz_results = []
      newUser.friends = [];
  
      db.collection("users").insertOne(newUser, function(err, result){
        if(err)throw err;
        if(result){
          req.session.username = req.body.username;
          res.redirect("/users/" + req.body.username);
          return;
        }else{
          res.status(500).send("agegae");
          return;
        }
      })
    }else{
      res.status(400).send("ageaegae");
    }
  })

  app.get("/logout", function(req, res, next){
    if(req.session.user){
      req.session.user = null;
      res.status(200).send("Logged out!");
      return;
    }
    res.status(200).send("You have to be logged in before you can log out.");
  })

  app.get("/users", function(req, res, next){
    //Given a name to search for
    //We want to return all users that have that text in name
    //And that are also friends or viewable by the requesting person
  
    db.collection("users").findOne({username: req.session.username}, function(err, reqUser){
      if(err) throw err;
      if(!reqUser) {
        res.status(500).send("Uh oh");
        return;
      }
      //We have loaded the requesting user
      //Now we need to run the search as that requesting user
      //A user can view themselves AND their friends
      let search = RegExp(req.query.name);
      console.log(reqUser.friends);
      console.log(search);
      reqUser.friends.push(reqUser.username);
  
      db.collection("users").find({username: {$regex: search, $in: reqUser.friends}}).toArray(function(err, result){
        if(err) throw err;
  
        res.status(200).json(result);
      });
    })
  })

  app.get("/users/:uid", function(req, res, next){
    //Find the user with the given ID
    //If the request user has access to the user with the given ID
    //Then send a good response
    //Otherwise, send 404
  
    if(!req.session.username){
      res.status(403).send("You have to log in to view a user");
      return;
    }
  
    db.collection("users").findOne({username: req.params.uid}, function(err, result){
      if(err){
        res.status(500).send("Server malfunction.");
        return;
      }
  
      if(!result){
        res.status(404).send("Unknown user");
        return;
      }
  
      //If the result user has a friend with requesting users name, then its good
      if(result.friends.includes(req.session.username) || result.username == req.session.username){
        res.status(200).json(result);
        return;
      }else{
        res.status(404).send("Unknown user");
        return;
      }
  
    })
  })