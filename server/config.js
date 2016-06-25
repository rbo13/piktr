var connect = require('connect'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    path = require('path'),
    routes = require('./routes'),
    exphbs = require('express-handlebars'),
    moment = require('moment'),
    express = require('express');


module.exports = function(app) {
    app.engine('handlebars', exphbs.create({
        defaultLayout: 'main',
        layoutsDir: app.get('views') + '/layouts',
        partialsDir: [app.get('views') + '/partials'],
        helpers: {
            timeago: function(timestamp) {
                return moment(timestamp).startOf('minute').fromNow();
            }
        }
    }).engine);
    app.set('view engine', 'handlebars');

    app.use(morgan('dev'));
    // app.use(connect.bodyParser({
    //     uploadDir:path.join(__dirname, '../public/upload/temp')
    // }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ 'extended': 'true' }));
    // app.use(connect.methodOverride());
    // app.use(connect.cookieParser('some-secret-value-here'));
    //app.use(app.router);
    app.use('/public/', express.static(path.join(__dirname, '../public')));

    // if ('development' === app.get('env')) {
    //     app.use(connect.errorHandler());
    // }

    routes.initialize(app);

    return app;
};
