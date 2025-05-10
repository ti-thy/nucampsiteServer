const express = require('express');
const PromotionRouter = express.Router();
const Promotion = require('../models/Promotion');

PromotionRouter.route('/')
.get((req, res, next) => {
    Promotion.find()
    .then(Promotions => res.status(200).json(Promotions))
    .catch(err => next(err))
})
.post((req, res, next) => {
    Promotion.create(req.body)
    .then(Promotion => res.status(200).json(Promotion))
    .catch(err => next(err))
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Promotions');
})
.delete((req, res, next) => {
    Promotion.deleteMany()
    .then(Promotions => res.status(200).json(Promotions))
    .catch(err => next(err))
});

PromotionRouter.route('/:PromotionId')
.get((req, res, next) => {
    Promotion.findById(req.params.PromotionId)
    .then(Promotion => res.status(200).json(Promotion))
    .catch(err => next(err))
})
.post((req, res) => {
  res.statusCode = 403;
    res.end(`POST operation not supported on /Promotions/${req.params.PromotionId}`);
})
.put((req, res, next) => {
    Promotion.findByIdAndUpdate(req.params.PromotionId, req.body, { new: true })
    .then(Promotion => res.status(200).json(Promotion))
    .catch(err => next(err))
})
.delete((req, res, next) => {
    Promotion.findByIdAndDelete(req.params.PromotionId)
    .then(Promotion => res.status(200).json(Promotion))
    .catch(err => next(err))
});

module.exports = PromotionRouter;