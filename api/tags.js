const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db');


tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    const { tagName } = req.params
    try {
        const allPosts = await getPostsByTagName(tagName)
        const posts = allPosts.filter(post => {
            if (post.active) {
                return true;
            }

            // the post is not active, but it belogs to the current user
            if (req.user && post.author.id === req.user[0].id) {
                return true;
            }

            // none of the above are true
            return false;
        });
        res.send({ posts })

        // use our method to get posts by tag name from the db
        // send out an object to the client { posts: // the posts }
    } catch ({ name, message }) {
        next({ name, message });
        // forward the name and message to the error handler
    }
});


tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();

    res.send({
        tags
    });
});

module.exports = tagsRouter;