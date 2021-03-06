const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

module.exports = (app) => {
    // CREATE Comment
    app.post("/posts/:postId/comments", function(req, res) {
        // INSTANTIATE INSTANCE OF MODEL
        const comment = new Comment(req.body);
        comment.author = req.user._id;

        // SAVE INSTANCE OF Comment MODEL TO DB
        comment
            .save()
            .then(comment => {
                return Promise.all([
                    Post.findById(req.params.postId)
                ]);
            })
            .then(([post, user]) => {
                post.comments.unshift(comment);
                return Promise.all([
                    post.save()
                ]);
            })
            .then(post => {
                res.redirect(`/posts/${req.params.postId}`);
            })
            .then(post => {
                res.redirect(`/`);
            })
            .catch(err => {
                console.log(err);
            });
    });
};
