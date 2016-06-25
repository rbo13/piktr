var home = require('../controllers/home'),
    image = require('../controllers/image');

    var multer = require('multer');

    var upload = multer ({ 'dest': 'image_uploads/' });

module.exports.initialize = function(app) {
    app.get('/', home.index);
    app.get('/image/:image_id', image.index);
    app.post('/images', image.create);
    app.post('/image/:image_id/like', image.like);
    app.post('/image/:image_id/comment', image.comment);
    app.delete('/image/:image_id', image.remove);
};
