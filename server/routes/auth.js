import express from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';

let router = express.Router();

router.post('/', (req, res) => {
  console.log(req.body);
  const { userName, password, type } = req.body;

  User.query({
    where: { username: userName },
    orWhere: { email: userName }
  }).fetch().then(user => {
    if (user) {
      if (bcrypt.compareSync(password, user.get('password_digest'))) {
        // const token = jwt.sign({
        //   id: user.get("id"),
        //   username: user.get("username")
        // }, config.jwtSecret);
        const token = jwt.sign({
          status: 'ok',
          type,
          id: user.get("id"),
          currentAuthority: ['writer'],
          exp: Math.floor(Date.now() / 1000) + (60 * 60)
        }, config.jwtSecret);
        // body json
        // res.sendHeader({ token })
        console.log(req.cookies['token']);
        res.set({ token })
        res.cookie('token', token)
        res.json({ token });
        // res.json({
        //   status: 'ok',
        //   type,
        //   currentAuthority: ['writer', 'admin'],
        // })
      } else {
        res.status(401).json({ errors: { form: "Invalid Credentials" } })
      }
    } else {
      res.status(401).json({ errors: { form: "Invalid Credentials" } })
    }
  })
});

export default router;
