const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes : 0,
      dislikes: 0,
      usersLiked : [],     
      usersDisliked: []

  });
  
  sauce.save()
  .then(() => { res.status(201).json({message: 'Sauce enregistrée !'})})
  .catch(error => { res.status(400).json( { error })})
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Sauce modifiée!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
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



exports.deleteSauce = (req, res, next) => {
   Sauce.findOne({ _id: req.params.id})
       .then(sauce => {
           if (sauce.userId != req.auth.userId) {
               res.status(401).json({message: 'Not authorized'});
           } else {
               const filename = sauce.imageUrl.split('/images/')[1];
               fs.unlink(`images/${filename}`, () => {
                   Sauce.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Sauce supprimée !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           }
       })
       .catch( error => {
           res.status(500).json({ error });
       });
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
exports.likeSauce = (req, res) => {
  const userId  = req.body.userId;
  const like = req.body.like;
  Sauce.findOne({ _id: req.params.id})
      .then((sauce) => {
        if (userId != req.auth.userId) {
          res.status(401).json({message: 'Not authorized'});
        }else{
          if(like === 1){
              sauce.likes++;
              if(!sauce.usersLiked.includes(userId)) {
                  sauce.usersLiked.push(userId);
              }
              const index = sauce.usersDisliked.indexOf(userId);
              if (index > -1) {
                  sauce.usersDisliked.splice(index, 1);
                  sauce.dislikes--;
              }
          } else if(like === -1){
              sauce.dislikes++;
              if(!sauce.usersDisliked.includes(userId)) {
                  sauce.usersDisliked.push(userId);
              }
              const index = sauce.usersLiked.indexOf(userId);
              if (index > -1) {
                  sauce.usersLiked.splice(index, 1);
                  sauce.likes--;
              }
          } else if(like === 0) {
              const index1 = sauce.usersLiked.indexOf(userId);
              if (index1 > -1) {
                  sauce.usersLiked.splice(index1, 1);
                  sauce.likes--;
              }
              const index2 = sauce.usersDisliked.indexOf(userId);
              if (index2 > -1) {
                  sauce.usersDisliked.splice(index2, 1);
                  sauce.dislikes--;
              }
          }
          sauce.save()
              .then((sauce) => {
                  res.json(sauce);
                  console.log(' Mise à jour de likes !'+ ' ' + userId + ' ' + like );
              })
              .catch((err) => {
                  res.status(500).json({ message: 'Error saving sauce', error: err });
              });
          }     
      })
      .catch((err) => {
          res.status(404).json({ message: 'Sauce not found', error: err });
      });
     
}
      

  
      
      
      
      
      