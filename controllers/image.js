var fs = require('fs'),
    path = require('path'),
    sidebar = require('../helpers/sidebar'),
    Models = require('../models'),
    md5 = require('MD5'),
    cloudinary = require('cloudinary'),
    multer = require('multer');

    var upload = multer({ 'dest': 'uploads/' }).single('file');

module.exports = {
    index: function(req, res) {
      var viewModel = {
        image: {},
        comments: []
      };

      Models.Image.findOne({ _id: req.params.image_id }, function(err, image){
        if(err) throw err;

        if(image){
          image.views = image.views + 1;
          viewModel.image = image;
          image.save();

          Models.Comment.find(
              { image_id: image._id},
              {},
              { sort: { 'timestamp': 1 }},
              function(err, comments){
                  viewModel.comments = comments;
                  sidebar(viewModel, function(viewModel) {
                      res.render('image', viewModel);
                  });
              }
          );
        }else{
          res.redirect('/');
        }
      });
    },
    create: function(req, res) {

      upload(req,res,function(err) {

        cloudinary.config({
          cloud_name: 'whaangbuu',
          api_key: '591541527659158',
          api_secret: 'BpYoq2mgj7xCSH85Ffm2B-lT0OQ'
        });

        cloudinary.uploader.upload(req.file.path, function(result){

          if(result !== null){
            var newImg = new Models.Image({
              title: req.body.title,
              description: req.body.description,
              filename: result.url
            });

            newImg.save(function(err, image){
              res.redirect("/image/" +image._id);
            });
          }
        });

	    });

    },

    like: function(req, res) {

        Models.Image.findOne({ _id: req.params.image_id },
            function(err, image) {
                if (!err && image) {
                    image.likes = image.likes + 1;
                    image.save(function(err) {
                        if (err) {
                            res.json(err);
                        } else {
                            res.json({ likes: image.likes });
                        }
                    });
                }
            });
    },
    comment: function(req, res) {

      Models.Image.findOne({ _id: req.params.image_id }, function(err, image) {
              if (!err && image) {
                  var newComment = new Models.Comment({
                    name: req.body.name,
                    email: req.body.email,
                    comment: req.body.comment
                  });

                  newComment.save(function(err, comment){
                    if(err) throw err;

                    res.redirect('/image/' + image._id + '#' + comment._id);
                  });
              } else {
                  res.redirect('/');
              }
      });
    },
    remove: function(req, res) {
        Models.Image.findById({ _id: req.params.image_id }, function(err, image) {
          if (err) { throw err; }

          image.remove(function(err){
            if(err)throw err;

            res.json(true);
          });

        });
    }
};
