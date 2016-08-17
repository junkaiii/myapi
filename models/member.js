var mongoose = require('mongoose');
//setting up the json structuresadsa
var memberSchema = new mongoose.Schema( {
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  password: {
    type: String
  },
  website: {
    type: String,
    trim: true,
    get: function(url) {
      if (!url) {
        return url;
      } else {
        if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
          url = 'http://' + url;
        }
        return url;
      }
    }
  },
},
{
  timestamps: {}
}

);

// setting up a virtual attribute
memberSchema.virtual('fullName').get(function(){
  return this.firstName + " " + this.lastName;
});

// register the modifiers
memberSchema.set('toJSON', { getters: true, virtuals: true});

//register the Schema
var Member = mongoose.model('Member', memberSchema);

//make this available to other files

module.exports = Member;
