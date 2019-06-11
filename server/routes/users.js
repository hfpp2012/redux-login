import express from 'express';
import isEmpty from 'lodash/isEmpty';
import validator from 'validator';
import bcrypt from 'bcrypt';
// import Promise from 'bluebird';

import User from '../models/user';
import authenticate from '../middlewares/authenticate';

let router = express.Router();

const commonValidateInput = (data) => {
  let errors = {};

  if (validator.isEmpty(data.username)) {
    errors.username = "The field is required";
  }

  if (validator.isEmpty(data.email)) {
    errors.email = "The field is required";
  }

  if (!validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "The field is required";
  }

  if (validator.isEmpty(data.passwordConfirmation)) {
    errors.passwordConfirmation = "The field is required";
  }

  if (!validator.equals(data.password, data.passwordConfirmation)) {
    errors.passwordConfirmation = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

const validateInput = (data, otherValidations) => {
  let { errors } = otherValidations(data);

  return User.query({
    where: { email: data.email },
    orWhere: { username: data.username }
  }).fetch().then(user => {
    if (user) {
      if (user.get('email') === data.email) {
        errors.email = "There is user with such email";
      }

      if (user.get('username') === data.username) {
        errors.username = "There is user with such username";
      }
    }

    return {
      errors,
      isValid: isEmpty(errors)
    }
  })

  // return Promise.all([
  //   User.where({ email: data.email }).fetch().then(user => {
  //     if (user) { errors.email = "There is user with such email"; }
  //   }),
  //   User.where({ username: data.username }).fetch().then(user => {
  //     if (user) { errors.username = "There is user with such username"; }
  //   })
  // ]).then(() => {
  //   return {
  //     errors,
  //     isValid: isEmpty(errors)
  //   }
  // })
}

router.get('/:identifier', (req, res) => {
  User.query({
    select: ["username", "email"],
    where: { email: req.params.identifier },
    orWhere: { username: req.params.identifier }
  }).fetch().then(user => {
    res.json({ user });
  })
});

router.get('/', authenticate, (req, res) => {
  const pageSize = req.query.pageSize || 1;
  const page = req.query.page || 1;

  User.count().then(count => {
    // var waitTill = new Date(new Date().getTime() + 1 * 1000);
    // while (waitTill > new Date()) {}

    User.query(qb => {
      qb.limit(pageSize);
      qb.offset(pageSize * (page - 1));
    }).fetchAll().then(users => {
      res.json({ list: users, pagination: { total_count: parseInt(count), current_page: parseInt(page), pageSize: parseInt(pageSize) } });
    })

  })
});

router.post('/', (req, res) => {
  validateInput(req.body, commonValidateInput).then(({ errors, isValid }) => {
    if (isValid) {
      const { username, password, email } = req.body;
      const password_digest = bcrypt.hashSync(password, 10);

      User.forge({
        username, password_digest, email
      }, { hasTimestamps: true }).save()
        .then(user => res.json({ success: true }))
        .catch(err => res.status(500).json({ errors: err }))
    } else {
      res.status(400).json(errors);
    }
  });
});

export default router;
