const Sauce = require('../models/sauce');

//  demande { sauce: String,image: File } 

exports.createSauce = (req, res, next) => {
     delete req.body._id;
     const sauce = new Sauce({  
     name : { type: String, required: true },
     manufacturer: { type: String, required: true },
     imageUrl: { type: String, required: true },
     heat: { type: Number, required: true },
     likes: { type: Number, required: true },
     dislikes: { type: Number, required: true },
     usersLiked : { type: [ "String <userId>" ], required: true },     
     usersDisliked: { type:[ "String <userId>" ], required: true }  
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Sauce saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneThing = (req, res, next) => {
  Sauces.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  const sauce = new Sauce({
     userId: { type: String, required: true },
     name : { type: String, required: true },
     manufacturer: { type: String, required: true },
     imageUrl: { type: String, required: true },
     heat: { type: Number, required: true }
  });
  Sauce.updateOne({_id: req.params.id}, sauce).then(
    () => {
      res.status(201).json({
        message: 'Sauce updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteSauce = (req, res, next) => {
  Sauce.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};