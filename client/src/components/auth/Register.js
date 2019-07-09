import React, { Fragment, useState } from 'react';

const Register = () => {
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

    const onSubmit = e => {
        e.preventDefault();

        // useState hook allows all state values to be accessible anywhere. no need to pass it in.
        if (password !== password2) {
            console.log("passwords do not match");
        } else {
            console.log(formData);
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
                           required
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
                           minLength="6"
                           value={password}
                           onChange={e => onChange(e)}
                       />
                   </div>
                   <div className="form-group">
                       <input
                           type="password"
                           placeholder="Confirm Password"
                           name="password2"
                           minLength="6"
                           value={password2}
                           onChange={e => onChange(e)}
                       />
                   </div>
                   <input type="submit" className="btn btn-primary" value="Register"/>
               </form>
               <p className="my-1">
                   Already have an account? <a href="login.html">Sign In</a>
               </p>

       </Fragment>
    )
};

export default Register;

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

