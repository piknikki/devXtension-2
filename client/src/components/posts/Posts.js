import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {getPosts} from "../../actions/post";
import PostItem from './PostItem';
import Spinner from '../layout/Spinner';

//  loading page will fetch post from api and put it into state
const Posts = ({
        getPosts,
        post: { posts, loading }
   }) => {

    useEffect(() => {
        getPosts();
    }, [getPosts]);

    return loading ? <Spinner/> : (
        <Fragment>
            <h1 className="large text-primary">Posts</h1>
            <p className="lead">
                <i className="fas fa-user"></i>Welcome to the community
            </p>
            {/*PostForm*/}
            <div className="posts">
                {posts.map(post => (
                    <PostItem key={post._id} post={post} />
                ))}
            </div>
        </Fragment>
    )

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