require('../data/reddit-db');

const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');

Comment.remove({}, function(err) { 
    console.log('Comment collection removed') 
 });

 Post.remove({}, function(err) { 
    console.log('Post collection removed') 
 });

 User.remove({}, function(err) { 
    console.log('User collection removed') 
 });
