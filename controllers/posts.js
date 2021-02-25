const Post = require('../models/post');

module.exports = (app) => {

    // CREATE
    app.post('/posts/new', (req, res) => {
      if (req.user) {
          // INSTANTIATE INSTANCE OF POST MODEL
          var post = new Post(req.body);
          // SAVE INSTANCE OF POST MODEL TO DB
          post.save(function(err, post) {
              // REDIRECT TO THE ROOT
              return res.redirect(`/`);
          });
      } else {
        return res.status(401); // UNAUTHORIZED
      }
    });

    app.get('/posts/new', (req, res) => {
      res.render('posts-new');
    });

    app.get('/', (req, res) => {
        var currentUser = req.user;
        Post.find({}).lean().then(posts => {
            res.render('posts-index', { posts, currentUser });
          })
          .catch(err => {
            console.log(err.message);
          })
    });

    app.get("/posts/:id", function(req, res) {
        // LOOK UP THE POST
        Post.findById(req.params.id).lean().populate('comments').then(post => {
            res.render("post-show", { post });
          })
          .catch(err => {
            console.log(err.message);
          });
    });
    
    // SUBREDDIT
    app.get("/n/:subreddit", function(req, res) {
      Post.find({ subreddit: req.params.subreddit }).lean()
        .then(posts => {
          res.render("posts-index", { posts });
        })
        .catch(err => {
          console.log(err);
        });
    });
};
