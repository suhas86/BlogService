//Including the Module
var mongoose = require('mongoose');
//Declare Schema Object
var Schema = mongoose.Schema;

var blogSchema = new Schema({
    title: { type: String, default: '', required: true },
    subtitle: { type: String, default: '' },
    blogBody: { type: String, default: '' },
    tags: [],
    created: { type: Date },
    lastModified: { type: Date },
    authorInfo: {}
});

mongoose.model('Blog', blogSchema);