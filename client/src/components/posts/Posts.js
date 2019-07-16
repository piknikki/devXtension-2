import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {getPosts} from "../../actions/post";
import Spinner from '../layout/spinner2.gif'

//  loading page will fetch post from api and put it into state
const Posts = ({
        getPosts,
        post: { posts, loading }
   }) => {

    useEffect(() => {
        getPosts();
    }, [getPosts]);

    return <div />

}

// action
Posts.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
}

// get state into post prop
const mapStateToProps = state => ({
    post: state.post
})

// action is second param of connect
export default connect(mapStateToProps, { getPosts })(Posts);