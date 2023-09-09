const express = require('express');
const Users = require('./users-model')
const Posts = require('../posts/posts-model')
const { validatePost, validateUser, validateUserId, logger } = require('../middleware/middleware')

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(err => next(err))
  
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.user)
  
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Users.insert(req.body)
   .then(user=> {
    res.status(201).json(user)
   })
   .catch(err => next(err))
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const { id } = req.params;
  Users.update(id, req.body)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => next(err))
      
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  const { id } = req.params
  const user = await Users.getById(id)
  Users.remove(id)
    .then(resp => {
      res.status(200).json(user)
    })
    .catch(err => next(err))
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  const { id } = req.params;
  Users.getUserPosts(id)
    .then(posts => {
      res.status(200).json(posts)
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const { id } = req.params;
  const postToAdd = {...req.body, user_id: id}
  Posts.insert(postToAdd)
    .then(post => {
      res.status(201).json(post)
    })
    .catch(err => console.log(err))
});

// do not forget to export the router
module.exports = router
