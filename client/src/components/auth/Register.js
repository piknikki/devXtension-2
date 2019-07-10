import React, { Fragment, useState } from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { register } from "../../actions/auth";
import PropTypes from 'prop-types';

const Register = ({ setAlert, register }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const { name, email, password, password2 } = formData;

    // e.target accesses the event
    // e.target.name selects the name attribute
    // need this for every field
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();

        // useState hook allows all state values to be accessible anywhere. no need to pass it in.
        if (password !== password2) {
            setAlert("passwords do not match", "danger"); // this gets passed as a message to the action, uses css danger
        } else {
            // console.log("success");
            register({ name, email, password }); // using the params pulled out of component state formData
        }
    }

    return (
       <Fragment>
               <h1 className="large text-primary">Sign Up</h1>
               <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
               <form className="form" onSubmit={e => onSubmit(e)}>
                   <div className="form-group">
                       <input
                           type="text"
                           placeholder="Name"
                           name="name"
                           value={name}
                           // required
                           onChange={e => onChange(e)}
                       />
                   </div>
                   <div className="form-group">
                       <input
                           type="email"
                           placeholder="Email Address"
                           name="email"
                           value={email}
                           onChange={e => onChange(e)}
                       />
                       <small className="form-text"
                       >This site uses Gravatar so if you want a profile image, use a
                           Gravatar email
                       </small
                       >
                   </div>
                   <div className="form-group">
                       <input
                           type="password"
                           placeholder="Password"
                           name="password"
                           // minLength="6"
                           value={password}
                           onChange={e => onChange(e)}
                       />
                   </div>
                   <div className="form-group">
                       <input
                           type="password"
                           placeholder="Confirm Password"
                           name="password2"
                           // minLength="6"
                           value={password2}
                           onChange={e => onChange(e)}
                       />
                   </div>
                   <input type="submit" className="btn btn-primary" value="Register"/>
               </form>
               <p className="my-1">
                   Already have an account? <Link to="/login">Sign In</Link>
               </p>

       </Fragment>
    )
};

//
Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
}
// takes two params:  state and object with actions
// allows us to access props.setalert
export default connect(
    null,
    { setAlert, register }
    )(Register);







// not using hooks, would look like this:
//
// state = {
//     formData: {
//         name: '',
//         email: '',
//         password: '',
//         password2: ''
//     }
// }
//      setFormData is equivalent to this.setState() with new values passed in




// import axios from 'axios';
// const newUser = {
//     name, email, password
// }

// try {
//     const config = {
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     }
//
//     // send the body
//     const body = JSON.stringify(newUser);
//
//     // axios returns a promise -- this hits routes/users.js on the back end, to get a token back
//     // params for axios.post are the route, what to send, and the config
//     const res = await axios.post('/api/users', body, config);
//
//     // response data is the token we get back from sending the post request
//     console.log(res.data);
//
// } catch (err) {
//     console.error(err.response.data);
// }

