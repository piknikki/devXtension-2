import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from "../../actions/auth";

// bring in props, and destructure auth to only pull in isAuth and loading
// hide-sm is css to hide the text if on small device, and use the icon only
const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
    const authLinks = (
        <ul>
            <li><Link to="/profiles">
                Developers
            </Link></li>
            <li><Link to="/posts">
                Posts
            </Link></li>
            <li><Link to="/dashboard">
                <i className="fas fa-user"></i>{'  '}
                <span className="hide-sm">Dashboard</span>
            </Link></li>
            <li><a
                href="#!"
                onClick={logout}>
                <i className="fas fa-sign-out-alt"></i>{'  '}
                <span className="hide-sm">Logout</span>
            </a></li>

        </ul>
    );

    const guestLinks = (
        <ul>
            <li><Link to="/profiles">Developers</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    );


    // make sure loading is false before showing navbar
    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to="/"><i className="fas fa-code"></i> Dev X-tension</Link>
            </h1>
            { !loading && (<Fragment>{ isAuthenticated ? authLinks : guestLinks }</Fragment>) }
        </nav>
    )
};

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(
    mapStateToProps,
    { logout }
)(Navbar);