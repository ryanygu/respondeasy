/* E4 server.js */
'use strict';
const log = console.log;

const express = require('express')
const bodyParser = require('body-parser')

const { ObjectID } = require('mongodb')

// For authentication
const session = require('express-session')
const hbs = require('hbs')

// Mongoose
const { mongoose } = require('./db/mongoose');

// Import the models
const { User } = require('./models/User');
const { Event } = require('./models/Event');


// Express
const port = process.env.PORT || 5000
const app = express();
// body-parser middleware setup.  Will parse the JSON and convert to object
app.use(bodyParser.json());
// parse incoming parameters to req.body
app.use(bodyParser.urlencoded({ extended:true }))

// set the view library
app.set('view engine', 'hbs')

// static js directory
app.use("/actions", express.static(__dirname + '/client/src/actions'))



/* Authentication */
// Add express sesssion middleware
app.use(session({
	secret: 'oursecret',
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 600000,
		httpOnly: true
	}
}))

// Add middleware to check for logged-in users
const sessionChecker = (req, res, next) => {
	if (req.session.user) {
		res.redirect('dashboard')
	} else {
		next();
	}
}

// route for root; redirect to login
app.get('/', sessionChecker, (req, res) => {
	res.redirect('login')
})

// route for login
app.route('/login')
	.get(sessionChecker, (req, res) => {
		res.sendFile(__dirname + '/client/src/containers/Login.js')
	})

app.get('/dashboard', (req, res) => {
	// check if we have active session cookie
	if (req.session.user) {
		//res.sendFile(__dirname + '/public/dashboard.html')
		// res.render('dashboard.hbs', {
		res.render('/client/src/containers/Login.js', {
			email: req.session.email
		})
	} else {
		res.redirect('/login')
	}
})

// User login and logout routes

app.post('/users/login', (req, res) => {
	const email = req.body.email
	const password = req.body.password
	console.log("SERVER>JS", req.body)
	User.findByEmailPassword(email, password).then((user) => {
		if(!user) {
			console.log("INVALID")
			// res.redirect('/login')
		} else {
			// Add the user to the session cookie that we will
			// send to the client
			req.session.user = user._id;
			req.session.email = user.email;
			// res.redirect('/dashboard')
			res.send({user})
		}
	}).catch((error) => {
		res.status(400)//.redirect('/login')
	})
})

app.get('/users/logout', (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			res.status(500).send(error)
		} else {
			res.redirect('/')
		}
	})
})


// Middleware for authentication for resources
const authenticate = (req, res, next) => {
	if (req.session.user) {
		User.findById(req.session.user).then((user) => {
			if (!user) {
				return Promise.reject()
			} else {
				req.user = user
				next()
			}
		}).catch((error) => {
			res.redirect('/login')
		})
	} else {
		res.redirect('/login')
	}
}

// API STUFF //

/// Route for adding a new user (signup), with an empty event arrays
/* 
Request body expects:
{
	"name": <name of user>,
	"email": <email>,
	"password": <password>
}
Returned JSON should be the database document added.
*/
// POST /users
app.post('/users', (req, res) => {
	// Create new use
	const new_user = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		myEvents: [],
		upcomingEvents: [],
	})

	// Save new restaurant to the database
	new_user.save().then((result) => {
		// Send as a response the object that was saved
		res.send(result)
	}, (error) => {
		res.status(400).send(error) // 400 for bad request
	})
})


// Route for getting all users (display all user for admin)
// Returns an array of User objects //
// GET /users
app.get('/users', (req, res) => {
	User.find().then((result) => {
		res.send({result}) //put in object in case we want to add other properties
	}, (error) => {
		res.status(400).send(error)
	})
})


/// Route for creating a new event, and updating list of my events
/* 
Request body expects:
{
  "code": <code>,
  "bride": <bride's name>,
  "groom": <groom's name>,
  "date": <date>,
  "foodOptions": [String],
  "location": <location of wedding>
}
Returned JSON should be the database document added.
*/
// POST /restaurants
app.post('/events', (req, res) => {
	log(req.body)
	// Create new event under a user (host)
	const new_event = new Event({
    code: req.body.code,
    bride: req.body.bride,
    groom: req.body.groom,
    date: req.body.date,
    foodOptions: req.body.foodOptions,
    location: req.body.location,
    announcements: [],
    pendingGuests: [],
    confirmedGuests: [],
    declinedGuests: []
  	})

	// Save new event to the database
	new_event.save().then((result) => {
		// Send as a response the object that was saved
		res.send(result)
	}, (error) => {
		res.status(400).send(error) // 400 for bad request
  })
})

// Route for getting all the events
// GET /events
app.get('/events', (req, res) => {
	Event.find().then((events) =>{
		res.send({events})
	}, (error) => {
		res.status(400).send(error)
	})
})


/// Add this event to my event list (call /event POST prior to this call)
/*
Request body expects:
{
  "id": <Event ObjectId>,
}
*/
// POST /users/:id
app.post('/users/:id', (req, res) => {
	// Get userid parameter
  const userid = req.params.id;
  
  // Get body ObjectId
  const eventId = req.body.id;

	// Validate the id
	if (!ObjectID.isValid(userid)) {
		return res.status(404).send()
	}

	// Find by Id
	User.findById(userid).then((user) => {
		if (!user) {
			res.status(404).send()
    }

    // Push the new Event ObjectId to myEvents array
    const myEventList = user.myEvents;
		myEventList.push(eventId);
    
    // Save the updated myEvents array
    user.save().then((result) => {
			// Send as a response the object that was saved
			res.send({myEventList, result})
		}, (error) => {
			res.status(400).send(error) // 400 for bad request
    })
  }).catch((error) => {
    res.status(400).send(error)
  })
})


// Route for getting user object
// GET /users/:id
app.get('/users/:id', (req, res) => {
  // Get userid parameter from url
  const userid = req.params.id;

  // Validate the id
  if (!ObjectID.isValid(userid)) {
    return res.status(404).send()
  }

  // Find by ID and send
  User.findById(userid).then((user) => {
    if (!user) {
      res.status(404).send()
    }
    res.send({user})
  }).catch((error) => {
    res.status(400).send(error)
  })
})


// Route for changing user object
/*
Request body expects:
{
  "name": <new or old name>,
  "password": <new or old password>,
}
*/
// PATCH /users/:id
app.patch('/users/:id', (req, res) => {
  // Get userid parameter from url
  const userid = req.params.id;
  // const { name, email, password } = req.body;
	// const properties = { name, email, password }
	const { name} = req.body;
  const properties = { name }
  
  // Validate the id
  if (!ObjectID.isValid(userid)) {
    return res.status(404).send()
  }

  User.findByIdAndUpdate(userid, {$set: properties}, {new: true}).then((user) => {
    if (!user) {
      return res.status(404).send()
    } else {
      res.send({user})
    }
  }).catch((error) => {
    res.status(400).send(error)
  })
})

// Route for getting information for one event
// GET /events/id
app.get('/events/:id', (req, res) => {
	const event_id = req.params.id;

	if (!ObjectID.isValid(event_id)) {
		return res.status(404).send()		
	}

	Event.findById(event_id).then((event) => {
		if (!event) {
			res.status(404).send()
		} else {
			res.send({ event })
		}
	}).catch((error) => {
		res.status(400).send(error)
	})

})

// Route for adding an announcement for this event
/*
Request body expects:
{
	"announcement": <announcement>
}
*/
// Returned JSON should have the events database 
//   document that the announcements was added to:
//   { "event": <entire event document>}
// POST /events/id
app.post('/events/:id', (req, res) => {
	const event_id = req.params.id;
	
	if (!ObjectID.isValid(event_id)) {
		return res.status(404).send()
	}

	Event.findById(event_id).then((event) => {
		if (!event) {
			res.status(404).send()
		} else {
			event.announcements.push(req.body.announcement)
			event.save().then((result) => {
				res.send({ event })
			}, (error) => {
				res.status(400).send(error)
			})
		}
	}).catch((error) => {
		res.status(400).send(error)
	})
})


// Route for changing event information 
/*
Request body expects:
{
  "bride": <bride's name>,
  "groom": <groom's name>,
  "date": <date>,
	"location": <location of wedding>
	"foodOptions": [String]
}
*/
// PATCH /events/id
app.patch('/events/:id', (req, res) =>{
	const event_id = req.params.id
	const { bride, groom, date, location , foodOptions } = req.body
	const properties = { bride, groom, date, location, foodOptions }

	if(!ObjectID.isValid(event_id)){
		return res.status(404).send()
	}

	Event.findByIdAndUpdate(event_id, {$set: properties}, {new: true}).then((event) => {
		if(!event){
			res.status(404).send()
		}else{
			res.send({ event })
		}
	}).catch((error) => {
		res.status(400).send(error)
	})
})

// Route for deleting an event
//DELETE /events/id
app.delete('/events/:id', (req, res) => {
	const event_id = req.params.id;
	
	if(!ObjectID.isValid(event_id)){
		return res.status(404).send()
	}

	Event.findByIdAndRemove(event_id).then((event) => {
		if (!event) {
			res.status(404).send()
		} else {
			res.send({ event })
		}
	}).catch((error) => {
		res.status(400).send(error)
	})
})


// Route for getting the corresponding the event id given the code
// GET /events/event_code
app.get('/code/:code', (req, res) => {
	const event_code = req.params.code;

	Event.find({ code: event_code }).then((event) => {
		if (!event) {
			res.status(404).send()
		} else {
			res.send({ event })
		}
	}).catch((error) => {
		res.status(400).send(error)
	})
})


// Route for adding an event to this user (joining existing event)
// POST /users/:user_id/:event_id
app.post('/users/:userid/:eventid', (req, res) => {
  // Get userid and eventid parameters
  const userid = req.params.userid;
  const eventid = req.params.eventid;

  if (!ObjectID.isValid(eventid) || !ObjectID.isValid(userid)) {
		return res.status(404).send()
  }
  
  User.findById(userid).then((user) => {
    if (!user) {
      res.status(404).send()
    }

    // Push the EventInvitation Object to upcomingEvents array
    const invitation = user.upcomingEvents;
    user.upcomingEvents.push({
      event: eventid,
      people: null,
      rsvp: null,
      food: null,
    })

    // Save the upcomingEvents array
    user.save().then((result) => {
      res.send({invitation, result})
    }, (error) => {
      res.status(400).send(error)
    })
  }).catch((error) => {
		res.status(400).send(error)
	})
})


// Route for editing user's EventInvitation info
/*
Request body expects:
{
  "people": <Number of people>,
  "rsvp": <Boolean value>,
  "food": <Food type indicie>,
}
*/
// PATCH /users/:user_id/:event_id
app.patch('/users/:userid/:eventid', (req, res) => {
  // Get userid and eventid from params
  const userid = req.params.userid;
  const eventid = req.params.eventid;

  // Validate the ids
  if (!ObjectID.isValid(eventid) || !ObjectID.isValid(userid)) {
		return res.status(404).send()
  }

  User.findById(userid).then((user) => {
    if (!user) {
      res.status(404).send()
    }

    // Create const for the upcomingEvents array
    const upcomingEvents = user.upcomingEvents;

    upcomingEvents.forEach(function(invitation) {
      if (invitation.event == eventid) {
        invitation.people = req.body.people;
        invitation.rsvp = req.body.rsvp;
        invitation.food = req.body.food;
      }
    });

    // Save the updated user
    user.save().then((result) => {
      res.send({upcomingEvents, result})
    }, (error) => {
      res.status(400).send(error)
    })
  }).catch((error) => {
    res.status(400).send(error)
  })
})


// Route for deleting an event for this user (deletes from both myEvent vs upcomingEvents)
// DELETE /user/:user_id/:event_id
app.delete('/users/:userid/:eventid', (req, res) => {
  // Get userid and eventid from parameter URL
  const userid = req.params.userid;
  const eventid = req.params.eventid;
  
  // Validate the ids
  if (!ObjectID.isValid(eventid) || !ObjectID.isValid(userid)) {
		return res.status(404).send()
  }
  
  User.findById(userid).then((user) => {
    if (!user) {
      res.status(404).send()
    }

    // Create const for the upcomingEvents array and myEvents array
    const upcomingEvents = user.upcomingEvents;
    user.upcomingEvents = user.upcomingEvents.filter(item => item.event != eventid)
    const myEvents = user.myEvents;
    user.myEvents = user.myEvents.filter(item => item != eventid)

    // Save the changed user to the DB
    user.save().then((result) => {
      res.send({upcomingEvents, myEvents,  result})
    }, (error) => {
      res.status(400).send(error)
    })
  }).catch((error) => {
    res.status(400).send(error)
  })
})



// Route to add user to this event's guest list
// POST /events/event_id/user_id
app.post('/events/:event_id/:user_id', (req, res) => {
	const event_id = req.params.event_id;
	const user_id = req.params.user_id;
	
	if (!ObjectID.isValid(event_id) || !ObjectID.isValid(user_id)) {
		return res.status(404).send()
	}

	Event.findById(event_id).then((event) => {
		if (!event) {
			res.status(404).send()
		} else {
			event.pendingGuests.push(user_id)
			event.save().then((result) => {
				res.send({ event })
			}, (error) => {
				res.status(400).send(error)
			})
		}
	}).catch((error) => {
		res.status(400).send(error)
	})
})


// /events/:event_id/:user_id
// PATCH : move this user from pending to [declined or accepted or pending]
// DELETE : delete this user from this event

// Path to move this user from pending to [declined or accepted or pending]
/*
Request body expects:
{
  "from": <pending=-1, declined=0, accepted=1>
  "to" : <pending=-1, declined=0, accepted=1>
}
*/
// PATCH /events/event_id/user_id
app.patch('/events/:event_id/:user_id', (req, res) =>{
	const event_id = req.params.event_id;
	const user_id = req.params.user_id;
	const flag_from = req.body.from;
	const flag_to = req.body.to;

	if(!ObjectID.isValid(event_id) || !ObjectID.isValid(user_id)){
		return res.status(404).send()
	}

	Event.findById(event_id).then((event) => {
		if(!event){
			res.status(404).send()
		}else{
			// Remove this user from the current guest list
			if(flag_from == -1){
				event.pendingGuests = event.pendingGuests.filter(item => item != user_id)
			}else if(flag_from == 0){
				event.declinedGuests = event.declinedGuests.filter(item => item != user_id)
			}else{
				event.confirmedGuests = event.confirmedGuests.filter(item => item != user_id)
			}

			// Add to the correct guest list
			if(flag_to == 0){
				event.declinedGuests.push(user_id)
			}else{
				event.confirmedGuests.push(user_id)
			}

			event.save().then((result) => {
				res.send({ event })
			}, (error) => {
				res.status(400).send(error)
			})
			

		}
	}).catch((error) => {
		res.status(400).send(error)
	})
})

app.delete('/events/:event_id/:user_id', (req, res) =>{
	const event_id = req.params.event_id;
	const user_id = req.params.user_id;
	
	if(!ObjectID.isValid(event_id) || !ObjectID.isValid(user_id)){
		return res.status(404).send()
	}

	Event.findById(event_id).then((event) => {
		if(!event){
			res.status(404).send()
		}else{
			// Remove this user from the current guest list
			event.pendingGuests = event.pendingGuests.filter(item => item != user_id)
			event.declinedGuests = event.declinedGuests.filter(item => item != user_id)
			event.confirmedGuests = event.confirmedGuests.filter(item => item != user_id)

			event.save().then((result) => {
				res.send({ event })
			}, (error) => {
				res.status(400).send(error)
			})

		}
	}).catch((error) => {
		res.status(400).send(error)
	})
})

//////////
const path = require('path');
if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

app.listen(port, () => {
	log(`Listening on port ${port}...`)
});
