import express from 'express';
import isEmpty from 'lodash/isEmpty';
import validator from 'validator';
import bcrypt from 'bcrypt';
// import Promise from 'bluebird';

import User from '../models/user';

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

router.get('/', (req, res) => {
  User.fetchAll().then(users => {
    var waitTill = new Date(new Date().getTime() + 2 * 1000);
    while (waitTill > new Date()) {}
    res.json({ list: users });
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
