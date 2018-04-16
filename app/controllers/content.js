var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Video = mongoose.model('Video'),
  User = mongoose.model('User');

var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

var config = require('../../config/config');
module.exports = function (app) {
  app.use('/videos', router);
};

router.get('/indexup', function(req, res){
    res.render('fupload', {
        title: 'Upload video',
        baseUrl: config.baseUrl,
    });
});
// Tomado de https://coligo.io/building-ajax-file-uploader-with-node/
router.post('/uploadf', function(req, res){

    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    //form.uploadDir = path.join(__dirname, '/uploads');
    form.uploadDir = '/nfs1/uploads';
    console.log(form.uploadDir);

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
        fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    // log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        res.end('success');
    });

    // parse the incoming request containing the form data
    form.parse(req);

});

router.get('/', function (req, res, next) {
  Video.find({ privacy: 'Public'})
    .populate('owner')
    .exec(function (err, fullVideoData) {
      if (err) res.send(err);

      userInfo = undefined;
      if(req.user){
        userInfo = {
          name: req.user.name,
          username: req.user.username,
        }
      }

      res.render('videos', {
        title: 'Videos',
        videos: fullVideoData,
        baseUrl: config.baseUrl,
        userInfo: userInfo
      });
    });
});

router.get('/list', function (req, res, next) {
  Video.find({ privacy: 'Public'})
    .populate('owner')
    .exec(function (err, fullVideoData) {
      if (err) res.send(err);

      res.json(fullVideoData);
    });
});

router.get('/search', function (req, res, next) {
  Video.find({title:new RegExp(req.query.query)},function(err, videos) {
    if (err) res.send(err);
    res.render('videos', {
      title: 'Videos',
      videos: videos,
      baseUrl: config.baseUrl
    });
  });
});

router.get('/upload', function (req, res, next) {

  res.render('upload', {
    title: 'Upload video',
    baseUrl: config.baseUrl,
    user: req.user
  });
});

router.post('/upload', function (req, res, next) {
  console.log(req.body);
  video = new Video({
    title: req.body.title,
    description: req.body.description,
    file_name: req.body.file_name,
    owner: req.user._id,
    privacy: req.body.privacy,
    category:  req.body.category,
    tags: req.body.tags
  });

  Video.create(video, function (err, video) {
    if(err)
      res.send(err);
    res.end("good");
  });
    console.log(video);
});

/*router.post('/upload', function (req, res, next) {
    console.log(req.body);
    video = new Video({
        title: req.body.title,
        description: req.body.description,
        owner: req.user._id,
        privacy: req.body.privacy,
        category: req.body.category,
        tags: req.body.tags
    });

    Video.create(video, function (err, video) {
        if(err)
            res.send(err);
        res.redirect(config.baseUrl + 'videos/me');
    });

});*/

router.get('/me', function (req, res, next) {
  userInfo = {
    name: req.user.name,
    username: req.user.username,
  }
  Video.find({ owner: req.user._id}, function (err, videos) {
    if (err) res.send(err);
    res.render('myvideos', {
      title: 'My videos',
      videos: videos,
      baseUrl: config.baseUrl,
      userInfo: userInfo,
      ip: config.ip
    });
  });
});

router.get('/me/share', function (req, res) {
  Video.findOne({ _id: req.query.id })
    .populate('users')
    .exec(function (err, video) {
      if(err)
        res.send(err)
      res.render('share', {
        title: "Share",
        video: video,
        baseUrl: config.baseUrl
      });
    });
});

router.post('/me/share', function (req, res, next) {

  shares = [];

  User.findOne({ username: req.body.sUsername }, function (err, user) {
    if (err || !user) {
      res.redirect(config.baseUrl + 'videos/me/share?id=598e576469fb9a15ce95972e&error');
      return next();
    }
    else {
      console.log("User to push " + user._id);

      Video.findByIdAndUpdate(req.body.idVideo, { $addToSet: {users : user._id}}, function (err, video) {
        if (err){
          console.log("Error: " + err);
          res.redirect(config.baseUrl + 'videos/me/share?id=598e576469fb9a15ce95972e&error2');
          return next();
        }
        res.redirect(config.baseUrl + 'videos/me');
        return next();
      });
    }
    //res.json(videoUpdated);
  });

  //res.end();

});

router.get('/shared/me', function (req, res) {
  Video.find({ users: req.user._id})
    .populate('owner')
    .exec(function (err, videos) {
    if (err) res.send(err);
    res.render('sharedwme', {
      title: 'Shared with me',
      videos: videos,
      baseUrl: config.baseUrl
    });
  });
});


router.get('/delete/:id', function (req, res, next) {
  Video.findByIdAndRemove(req.params.id, function (err, video) {
    if(err) {
      res.redirect(config.baseUrl + 'videos/me?err');
      return next(err);
    }
    res.redirect(config.baseUrl + 'videos/me');
  });
});

router.get('/edit', function (req, res, next){
  Video.findOne({ _id: req.query.id })
    .populate('users')
    .exec(function (err, video) {
      if(err)
        res.send(err)
      console.log("Users population: " + video);
      res.render('edit-video', {
        title: "Edit Video",
        video: video,
        baseUrl: config.baseUrl
      });

  });
});

router.post('/edit', function (req, res, next) {
  videoUpdated = {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    tags: req.body.tags
  };
  console.log(videoUpdated);
  console.log(req.body.idVideo);

  Video.findByIdAndUpdate(req.body.idVideo, { $set: videoUpdated}, { new: true }, function (err, video) {
    if (err) res.send(err);
    res.redirect(config.baseUrl + 'videos/me')
  });
});

