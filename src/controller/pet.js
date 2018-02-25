import mongoose from 'mongoose';
import { Router } from 'express';
import Pet from '../model/pet';
import Review from '../model/review';
import bodyParser from 'body-parser';
import passport from 'passport';

import { authenticate } from '../middleware/authMiddleware';

export default({ config, db }) => {
  let api = Router();

  // '/v1/pet' - GET all pet trucks
  api.get('/', (req, res) => {
    Pet.find({}, (err, pets) => {
      if (err) {
        res.send(err);
      }
      res.json(pets);
    });
  });

  // '/v1/pet/:id' - GET a specific pet 
  api.get('/:id', (req, res) => {
    Pet.findById(req.params.id, (err, pet) => {
      if (err) {
        res.send(err);
      }
      res.json(pet);
    });
  });

  // '/v1/pet/add' - POST - add a pet 
  api.post('/add', (req, res) => {
    let newPet = new Pet();
    newPet.name = req.body.name;
    newPet.foodtype = req.body.foodtype;
    newPet.price = req.body.price;
    

    newPet.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Pet saved successfully' });
    });
  });

  // '/v1/pet/:id' - DELETE - remove a pet 
  api.delete('/:id', (req, res) => {
    Pet.remove({
      _id: req.params.id
    }, (err, pet) => {
      if (err) {
        res.send(err);
      }
      Review.remove({
        pet: req.params.id
      }, (err, review) => {
        if (err) {
          res.send(err);
        }
        res.json({message: "Pet and Reviews Successfully Removed"});
      });
    });
  });

  // '/v1/pet/:id' - PUT - update an existing record
  api.put('/:id', (req, res) => {
    Pet.findById(req.params.id, (err, pet) => {
      if (err) {
        res.send(err);
      }
      pet.name = req.body.name;
      pet.foodtype = req.body.foodtype;
      pet.price = req.body.price;
      pet.save(function(err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: 'Pet info updated' });
      });
    });
  });

  // add a review by a specific pet id
  // '/v1/pet/reviews/add/:id'
  api.post('/reviews/add/:id', (req, res) => {
    Pet.findById(req.params.id, (err, pet) => {
      if (err) {
        res.send(err);
      }
      let newReview = new Review();

      newReview.title = req.body.title;
      newReview.text = req.body.text;
      newReview.pet = pet._id;
      newReview.save((err, review) => {
        if (err) {
          res.send(err);
        }
        pet.reviews.push(newReview);
        pet.save(err => {
          if (err) {
            res.send(err);
          }
          res.json({ message: 'Pet review saved' });
        });
      });
    });
  });

  // get reviews for a specific pet id
  // '/v1/pet/reviews/:id'
  api.get('/reviews/:id', (req, res) => {
    Review.find({pet: req.params.id}, (err, reviews) => {
      if (err) {
        res.send(err);
      }
      res.json(reviews);
    });
  });

  return api;
}
