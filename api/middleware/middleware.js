const Users = require('../users/users-model');
const Posts = require('../posts/posts-model');


function logger(req, res, next) {
  // DO YOUR MAGIC
}

async function validateUserId(req, res, next) {
  const { id } = req.params;
  try {
    const user = await Users.getById(id);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).json({ message: 'user not found'})
    }
  }
  catch (err){
    next(err)
  }
  
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ message: 'missing required name field'})
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  const { text } = req.body;
  console.log(req.body);
  if (!text) {
    res.status(400).json({ message: 'missing required text field'})
  } else {
    next();
  }
}

// do not forget to expose these functions to other modules

module.exports = {
  validateUserId,
  validateUser,
  logger,
  validatePost
}