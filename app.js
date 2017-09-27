var express = require('express')
var app = express();

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Calling mongoose module
var mongoose = require('mongoose');

app.use(bodyParser.json({ limit: '10mb', extend: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extend: true }));

//Application Level MiddleWare
app.use(function (req, res, next) {
    console.log("Time of request ", Date.now());
    console.log("Request Url is ", req.originalUrl);
    console.log("Request IP Address ", req.ip);

    next();
});

//Define the configuration of the database
var dbPath = "mongodb://suhas:welcome1@ds153494.mlab.com:53494/blogdb";

//Command to connect with database
db = mongoose.connect(dbPath);

mongoose.connection.once('open', function () {
    console.log("Database connection open success");
});

//Include the Model File
var Blog = require('./blogModel.js');

var blogModel = mongoose.model('Blog');
//End Include

//Routes
app.get('/', function (req, res) {
    res.send("This is a Blog App");
});

//Get All Blogs
app.get('/blogs', function (req, res) {
    blogModel.find(function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

//Create a blog
app.post('/blog/create', function (req, res) {
    var newBlog = new blogModel({
        title: req.body.title,
        subtitle: req.body.subtitle,
        blogBody: req.body.blogBody
    }); // End New Blog

    //Set the date of creation
    var today = Date.now();
    newBlog.created = today;

    //Set the tags into array
    if (req.body.allTags != undefined && req.body.allTags != null) {
        newBlog.tags = req.body.allTags.split(',');
    }

    //Set Author Information
    var authorInfo = { fullName: req.body.authorFullName, email: req.body.email };
    newBlog.authorInfo = authorInfo;

    //Save the blog
    newBlog.save(function (error) {
        if (error) {
            res.send(error);
        } else {
            res.send(newBlog);
        }
    })
});

//Router to get one blog
app.get('/blogs/:id', function (req, res) {
    blogModel.findOne({ '_id': req.params.id }, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

//Router to update post
app.put('/blogs/:id/edit', function (req, res) {
    var update = req.body;
    //Update the modified date
    update.lastModified = Date.now();
    blogModel.findOneAndUpdate({ _id: req.params.id }, update, { new: true }, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

//Router to delete the blog
app.post('/blogs/:id/delete', function (req, res) {
    blogModel.remove({ _id: req.params.id }, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

app.get('*', function (req, res, next) {
    res.status = '404';
    next("This url doesnt exists");
});
//Error handle MiddleWare
app.use(function (err, req, res, next) {
    console.log("Inside Error Handler");
    if (res.status == '404') {
        res.send("This request doesnt exists. Please check the url");
    } else {
        res.send(err);
    }
});
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Blog Service listening on port 3000!')
});
