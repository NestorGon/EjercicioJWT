var express = require("express");
const Joi = require("joi");
const Movie = require("../models/movie");
var HandlerGenerator = require("../handlegenerator.js");
var middleware = require("../middleware.js");
HandlerGenerator = new HandlerGenerator();
var router = express.Router();

router.post( '/login', HandlerGenerator.login);

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
});

router.get("/movies", middleware.checkToken, function (req, res, next) {
  if (req.role!=='Lectura') {
    res.send( 400 ).json( {
      success: false,
      message: 'Role failed'
    } );
  } else {
    Movie.findAll().then( result => {
      console.log("Movies", result);
      res.send(result);
    });
  }
});

router.get("/movies/:id", middleware.checkToken, function (req, res, next) {
  if (req.role!=='Lectura') {
    res.send(400).json( {
      success: false,
      message: 'Role failed'
    } );
  } else { 
    Movie.findByPk(req.params.id).then( result => {
      console.log("Movies", result);
      if (result === null) {
       res.status(404).send("La película con el id no existe");
      }
      res.send(result);
   });
  }
});

router.post("/movies", middleware.checkToken, function (req, res, next) {
  if (req.role!=='Escritura') {
    res.send( 400 ).json( {
      success: false,
      message: 'Role failed'
    } );
  } else {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(404).send(error);
    }
    Movie.create(
      {   
          name: req.body.name, 
      }).then( result => {
        console.log("Movies", result);
          res.send(result);
      });
  }
});

router.put("/movies/:id", middleware.checkToken, function (req, res, next) {
  if (req.role!=='Escritura') {
    res.send( 400 ).json( {
      success: false,
      message: 'Role failed'
    } );
  } else {
    Movie.update(req.body, {where: {id : req.params.id}}).then(result => {
      console.log("movie", result);
      if(result[0] !== 0) {
          res.send(movie);
        } else {
          return res.status(404).send("La película con el id no existe");
        }
    });
  }
});

router.delete("/movies/:id", middleware.checkToken, function (req, res, next) {
  if (req.role!=='Escritura') {
    res.send( 400 ).json( {
      success: false,
      message: 'Role failed'
    } );
  } else {
    Movie.destroy({where:{id: req.params.id}}).then((result) => {
      console.log("movie", result);
      if (result === 0) {
        res.status(404).send("La película con el id no existe");
      }
      else
      {
        res.status(204).send();
      }
    });
  }
});

module.exports = router;
