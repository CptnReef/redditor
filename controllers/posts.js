const Post = require('../models/post');
const User = require('../models/user');

module.exports = (app) => {

    // CREATE
    app.get('/posts/new', (req, res) => {
      res.render('posts-new');
    });
  
    app.post('/posts/new', (req, res) => {
      if (req.user) {
        // INSTANTIATE INSTANCE OF POST MODEL
        var post = new Post(req.body);
        // SAVE INSTANCE OF POST MODEL TO DB
        post.author = req.user._id;
        post.upVotes = [];
        post.downVotes = [];
        post.voteScore = 0;
      
        post
        .save()
        .then(post => {
          return User.findById(req.user._id);
        })
        .then(user => {
          user.posts.unshift(post);
          user.save();
          // REDIRECT TO THE NEW POST
          res.redirect(`/posts/${post._id}`);
        })
        .catch(err => {
          console.log(err.message);
        });
      } else {
        res.status(401).send({'401': 'Not authorised'})
      }
    });

    // INDEX
    app.get("/", (req, res) => {
      var currentUser = req.user;
      // res.render('home', {});
      console.log(req.cookies);
      Post.find({})
      .lean()
      .populate('author')
      .then(posts => {
        res.render('posts-index', { posts, currentUser });
        // res.render('home', {});
      })
      .catch(err => {
        console.log(err.message);
      })
    })
    //
    // SHOW
    app.get("/posts/:id", function(req, res) {
      // LOOK UP THE POST
      var currentUser = req.user;
      Post
      .findById(req.params.id)
      .lean()
      .populate({path:'comments', populate: {path: 'author'}})
      .populate('author')
      .then(post => {
        res.render("posts-show", { posts, currentUser });
      })
      .catch(err => {
        console.log(err.message);
      });
    });

    
    // SUBREDDIT
    app.get("/n/:subreddit", (req, res) => {
        var currentUser = req.user;
        Post
        .find({ subreddit: req.params.subreddit })
        .lean()
        .populate('author')
        .then(posts => {
          res.render("posts-index", { posts, currentUser });
        })
        .catch(err => {
          console.log(err);
        });
      });
    
    // VOTES
    app.put("/posts/:id/vote-up", function(req, res) {
      Post.findById(req.params.id).exec(function(err, post) {
        post.upVotes.push(req.user._id);
        post.voteScore = post.voteScore + 1;
        post.save();
    
        res.status(200).send({'yay': 'It worked'});
      });
    });
    
    app.put("/posts/:id/vote-down", function(req, res) {
      Post.findById(req.params.id).exec(function(err, post) {
        post.downVotes.push(req.user._id);
        post.voteScore = post.voteScore - 1;
        post.save();
    
        res.status(200).send({'mike test': '1-2-3'});
      });
    });
    
    app.get("/posts/:id/vote-count", function(req, res) {
      Post.findById(req.params.id).exec(function(err, post) {
    
        res.status(200).send({'count': post.voteScore});
      });
    });
};