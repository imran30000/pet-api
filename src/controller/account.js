import  mongoose from 'mongoose';
import { Router } from 'express';
import Account from '../model/account';
import bodyParser from 'body-parser';
import passport from 'passport';
import config from '../config';
import Profile from '../model/profile';

import {generateAccessToken, respond, authenticate} from '../middleware/authMiddleware';

export default ({ config, db }) => {
  let api = Router();

     //v1/account/profile/add/:email

     api.post('/profile/add/:id', (req, res) => {
      Account.findById(req.params.id, (err, account) => {
        if (err) {
          res.send(err);
        }
        let newProfile = new Profile();
  
        newProfile.firstName = req.body.firstName;
        newProfile.lastName = req.body.lastName;
        newProfile.account = account._id;
        newProfile.save((err, profile) => {
          if (err) {
            res.send(err);
          }
          account.profiles.push(newProfile);
          account.save(err => {
            if (err) {
              res.send(err);
            }
            res.json({ message: 'profile saved' });
          });
        });
      });
    });

  // '/v1/account'
  api.get('/', (req, res) => {
    res.status(200).send({ user: req.user });
  });

  // '/v1/account/register'
  api.post('/register', (req, res) => {
    Account.register(new Account({ username: req.body.email}), req.body.password, function(err, account) {
      if (err) {
        return res.status(500).send('An error occurred: ' + err);
      }

      passport.authenticate(
        'local', {
          session: false
      })(req, res, () => {
        res.status(200).send('Successfully created new account');
      });
    });
  });

  // '/v1/account/login'
  api.post('/login', passport.authenticate(
    'local', {
      session: false,
      scope: []
    }), generateAccessToken, respond);

  // '/v1/account/logout'
  api.get('/logout', authenticate, (req, res) => {
    req.logout();
    res.status(200).send('Successfully logged out');
  });

  api.get('/me', authenticate, (req, res) => {
    res.status(200).json(req.user);
  });

  return api;
}
