//---------------------------------------USER---------------------------------------

let users = require(__dirname + '/public/json/users.json');

let methods = 
{
    isValidUser: function (user)
    {
        if (!user) {
            return false;
        }

        if (!user.hasOwnProperty("Username") || !user.hasOwnProperty("Password")) {
            return false;
        }

        return true;
    },

    isSignedIn: function (req)
    {
        return typeof req.session.Username !== 'undefined';
    },

    getUser: function (username)
    {
        if(!username) return undefined;
        return users.find(user => user.Username.toLowerCase() === username.toLowerCase());
    },

    searchUser: function (query)
    {
        // if query = "dragon", returns array of all users which contain dragon in their username
        return users.filter(user => user.Username.toLowerCase().includes(query.toLowerCase()));
    },

    createUser: function (newUser)
    {

        if(!isValidUser(newUser)) return null;
        if(getUser(newUser.Username)) return null;

        newUser.Contributor = false;
        newUser.Reviews = [];
        users.push(newUser);

        return newUser;
    },

    deleteUser: function (username)
    {
        let user = getUser(username);
        users = users.filter(u => u !== user);
        return users;
    },

    isContributor: function (user)
    {
        if(!user) return false;
        if(!user.hasOwnProperty('Contributor')) return false;
        return user.Contributor;
    }
};

exports.users = users;
exports.methods = methods;