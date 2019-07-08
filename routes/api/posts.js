// for posts

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

// @route     POST api/posts ---
// @desc      route to create posts
// @access    Public
router.post('/',[
    auth,
    check('text', 'text is required')
        .not()
        .isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }

        try {
            // brings in all the user information
            const user = await User.findById(req.user.id).select('-password');

            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            })

            const post = await newPost.save(); // can send as response

            res.json(post);
        } catch(err) {
            console.error(err.message);
            res.status(500).send('server error')
        }
    }
);

// @route     GET api/posts ---
// @desc      get all posts
// @access    Private
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 }); // sort by most recent date
        res.json(posts);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('server error')
    }
});

// @route     GET api/posts/:id ---
// @desc      get posts by ID
// @access    Private
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id); // sort by most recent date
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' })
        }

        res.json(post);
    } catch(err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' })
        }
        res.status(500).send('server error')
    }
});

// @route     DELETE api/posts/:id ---
// @desc      Delete a post --  by ID
// @access    Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' })
        }

        // check user to make sure you can only delete it if you wrote it.
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' })
        }

        await post.remove();

        res.json({ msg: 'post removed' });

        res.json(post);
    } catch(err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' })
        }
        res.status(500).send('server error')
    }
});

// @route     PUT api/posts/like/:id ---
// @desc      like a post --  by post ID
// @access    Private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id); // find the post first, then do likes

        //  check to see if post has been liked by this user already
        // likes is an array of the users who have liked it??
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0 ) {
            return res.status(400).json({ msg: 'post already liked' })
        }

        post.likes.unshift({ user: req.user.id });

        await post.save();

        res.json(post.likes);  // return the likes, not the object

    } catch(err) {
        console.error(err.message);
        res.status(500).send('server error')
    }
});


// @route     PUT api/posts/unlike/:id ---
// @desc      UN-like a post --  by post ID
// @access    Private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id); // find the post first, then do likes

        //  check to see if post has been liked by this user already
        // likes is an array of the users who have liked it??
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0 ) {
            return res.status(400).json({ msg: 'Post has not been liked yet' })
        }

        // get remove index
        const removeIndex = post.likes
            .map(like => like.user.toString())
            .indexOf(req.user.id);

        // once we hve the index, use it in splice to remove that experience from the profile
        post.likes.splice(removeIndex, 1);

        // save the profile and return whole profile again.
        await post.save();
        res.json(post.likes);


    } catch(err) {
        console.error(err.message);
        res.status(500).send('server error')
    }
});

module.exports = router;