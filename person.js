//---------------------------------------PERSON---------------------------------------

let people = require(__dirname + '/public/json/people.json');

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
        return people.find(person => person.Name === personName);
    },

    searchPerson: function (query)
    {
        // if query = "dragon", returns array of all users which contain dragon in their username
        return people.filter(person => person.Name.toLowerCase().includes(query.toLowerCase()));
    },

    createPerson: function (newPerson)
    {
        if(!methods.isValidPerson(newPerson)) return null;
        if(methods.getPerson(newPerson.name)) return null;

        people.push(newPerson);

        return newPerson;
    },

    deletePerson: function (personName)
    {
        let person = getPerson(personName);
        people = people.filter(p => p !== person);
        return people;
    },

    modifyPerson: function (personName, prop, val)
    {
        let person = getPerson(personName);
        if(!person) return null;

        if(prop != "Name" && person.hasOwnProperty(prop)) {
            person[prop] = val;
        }

        return person;
    }
};

exports.people = people;
exports.methods = methods;