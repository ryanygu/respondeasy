import axios from "axios";
// import setAuthToken from "../utils/setAuthToken";
// import jwt_decode from "jwt-decode";

import {
  GET_ERRORS,
  GET_ALL_EVENTS,
  SET_CURRENT_EVENT,
  UPDATE_BASIC_FORM
} from "./types";

import { setCurrentUser } from "./authActions";

// Update user profile
export const joinEvent = (data, history) => dispatch => {
  axios //app.post('/users/:userid/:eventid',
    .post(`http://localhost:5000/users/${data.user_id}/${data.event_id}`, data)
    .then(res => {
      // app.post('/events/:event_id/:user_id'
      axios.post(
        `http://localhost:5000/events/${data.event_id}/${data.user_id}`
      );
      history.push("/dashboard");
    });
  // .catch(err =>
  // dispatch({
  //     type: GET_ERRORS,
  //     // payload: err.response.data
  // })
  // );
};

// Get all Events
export const getAllEvents = () => dispatch => {
  axios
    .get("/events")
    .then(res => {
      dispatch({
        type: GET_ALL_EVENTS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set current event
export const setCurrentEvent = (data, history) => dispatch => {
  dispatch({
    type: SET_CURRENT_EVENT,
    payload: data
  });
};

// Set current event
export const updateEvent = (data, history) => dispatch => {
  // const path = "/event/" +data.eventId;
  axios
    .patch("/events/" + data.eventId, data.updatedData)
    .then(res => {
      console.log("dispatching updateEvent");
      console.log(res.data);
      // set current event data again to the new info
      dispatch({
        type: SET_CURRENT_EVENT,
        payload: res.data //TODO confirm correct
        // res.data should contain the updated event object
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Set current event
export const addAnnouncement = (data, history) => dispatch => {
  // const path = "/event/" +data.eventId;
  axios
    .post("/events/" + data.eventId, data.newA)
    .then(res => {
      console.log("dispatching addAnnouncement");
      console.log(res.data);
      // set current event data again (to the new info)
      dispatch({
        type: SET_CURRENT_EVENT,
        payload: res.data //TODO confirm correct
        // res.data should contain the updated event object
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Create event
// TODO
export const createEvent = (eventData, thisUser, history) => dispatch => {
  axios
    .post("http://localhost:5000/events", eventData)
    .then(res => {
      // set current event data again (to the new info)
      const p = {
        id: res.data._id
      };
      axios.post(`http://localhost:5000/users/${thisUser._id}`, p);
      dispatch({
        type: SET_CURRENT_EVENT,
        payload: {
          event: res.data,
          type: "host"
        }
        //TODO confirm correct
        // res.data should contain the new event object
      });
      history.push(`/event/${res.data._id}`);
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Create event
export const updateBasicForm = (data, history) => dispatch => {
  dispatch({
    type: UPDATE_BASIC_FORM,
    payload: data //TODO confirm correct
  });
};

// add to guest list
// data.rsvpChoices = {
//   rsvp: true/false,
//   food: food option index,
// };
export const addToGuestList = (data, history) => dispatch => {
  let destination = (data.rsvpChoices.rsvp == true) ? 1 : 0;
  axios.patch( `http://localhost:5000/events/${data.eventId}/${data.userId}`, { from: -1, to: destination } )
    .then(res => {
      console.log(`successfully changed user ${data.userId} from pending to confirmed for event ${data.eventId}`);
      console.log(res.data);
      // set current event data again (to the new info)
      dispatch({
        type: SET_CURRENT_EVENT,
        payload: {
          event: res.data.event,
          type: "guest"
        }
      });

      // update current user
      axios.patch(`http://localhost:5000/users/${data.userId}/${data.eventId}`, {
          people: 1,
          rsvp: data.rsvpChoices.rsvp,
          food: data.rsvpChoices.food
        })
        .then(res => {
          console.log("Updated current user info");
          console.log(res.data);
          setCurrentUser(res.data.result);
        })
        .catch(err => {
          console.log(err);
          dispatch({
            type: GET_ERRORS,
            payload: err.response.data
          });
        });
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};
