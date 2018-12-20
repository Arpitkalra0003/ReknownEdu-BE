var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

let emailLengthChecker = (email) => {
  if (!email) {
    return false;
  } else {
    if (email.length < 5 || email.length > 30) {
      return false;
    } else {
      return true;
    }
  }
};

let validEmailChecker = (email) => {
  if (!email) {
    return false;
  } else {
    // Regular expression to test for a valid e-mail
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regExp.test(email); // Return regular expression test results (true or false)
  }
};

const emailValidators = [{
  validator: emailLengthChecker,
  message: 'Email must be at least 5 characters but no more than 30 '
}, {
  validator: validEmailChecker,
  message: 'Must be a valid email'
}];

// Validate Function to check password length
let passwordLengthChecker = (password) => {
  // Check if password exists
  if (!password) {
    return false; // Return error
  } else {
    // Check password length
    if (password.length < 8 || password.length > 35) {
      return false; // Return error if passord length requirement is not met
    } else {
      return true; // Return password as valid
    }
  }
};

// Array of Password validators
const passwordValidators = [
  // First password validator
  {
    validator: passwordLengthChecker,
    message: 'Password must be at least 8 characters but no more than 35'
  }];

const UserSchema = mongoose.Schema({
  firstname: { type: String, require: true },
  lastname: { type: String, require: true },
  email: { type: String, require: true, unique: true, lowercase: true, validate: emailValidators },
  mobilenumber: { type: Number, require: true },
  country: { type: String, require: true },
  location: { type: String, require: true },
  aboutme: { type: String, require: true },
  password: { type: String, require: true, validate: passwordValidators, select: false },
  active: { type: Boolean, required: true, default: false },
  temporarytoken: { type: String, required: true },
  resettoken: { type: String, required: false },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  //cnfpassword:{ type: String, required: false },
  creation_dt: { type: Date, require: true }
});



module.exports.getUserById = function (id, callback) {
  User.findById(id, callback);
}

module.exports.getUserByEmail = function (email, callback) {
  const query = { email: email }
  User.findOne(query, callback);
}

//module.exports.addUser = function(newUser, callback){
//bcrypt.genSalt(10, (err, salt) => {
//  bcrypt.hash(newUser.password, salt, (err, hash) => {
//    if(err) throw err;
//   newUser.password = hash;
//  newUser.save(callback);
// });
//});
// }
UserSchema.pre('save', function (next) {
  if (!this.isModified('password'))
    return next();

  bcrypt.hash(this.password, null, null, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});


//User.methods.comparePassword = function (candidatePassword, hash, callback) {
//bcrypt.compare(candidatePassword,this.password, hash, (err, isMatch) => {
//if (err) throw err;
// callback(null, isMatch);
//});
//}
//UserSchema.methods.comparePassword = function(password) {
// var user = this;

//return bcrypt.compareSync(password, user.password);
//}

UserSchema.methods.comparePassword = function (candidatePassword) {
  var user = this
  if (user.password != null) {
    return bcrypt.compareSync(candidatePassword, user.password);
  } else {
    return false;
  }
};

const User = module.exports = mongoose.model('User', UserSchema);
