var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Profile = require('../models/profile');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('../config/database');
const multer = require('multer');
const path = require('path');
var passport = require('passport');

/** Storage Engine */
const storageEngine = multer.diskStorage({
  destination: './uploads',
  filename: function (req, file, fn) {
    fn(null, new Date().getTime().toString() + '-' + file.fieldname + path.extname(file.originalname));
  }
});

//init

const upload = multer({
  storage: storageEngine,
  limits: { fileSize: 200000 },
  fileFilter: function (req, file, callback) {
    validateFile(file, callback);
  }
}).single('profileimage');


var validateFile = function (file, cb) {
  allowedFileTypes = /jpeg|jpg|png|gif/;
  const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedFileTypes.test(file.mimetype);
  if (extension && mimeType) {
    return cb(null, true);
  } else {
    cb("Invalid file type. Only JPEG, PNG and GIF file are allowed.")
  }
}

/* Get*/
router.get('/', function (req, res, next) {
  res.send('Express API');
});
//get all user
router.get('/user', function (req, res, next) {
  User.find(function (err, result) {
    if (err) {
      return (err);
    }
    else {
      res.json(result);
    }
  });
});

//get profile for education and work exp
router.get('/profiledetails', function (req, res, next) {
  Profile.find(function (err, prfl) {
    if (err) {
      return (err);
    }
    else {
      res.json(prfl);
    }
  });
});


// update image  profile  info
router.put('/profileimage/:id', (req, res, next) => {
  upload(req, res, next => {
    var fullPath = "uploads/" + req.file.filename;

    Profile.findByIdAndUpdate({ _id: req.params.id }, {
      $set: {
        path: fullPath,
        caption: req.body.caption
      }
    },
      function (err, result) {
        if (err) {
          res.json(err);
        }
        else {
          res.json(result);
        }

      });
  });
});


// update user details edu  info
router.put('/education/:id', (req, res, next) => {
  Profile.findByIdAndUpdate({ _id: req.params.id }, {
    $set: {
      educationinfo: {
        universityname: req.body.universityname,
        degree: req.body.degree,
        coursecompletionyear: req.body.coursecompletionyear,
        collegename: req.body.collegename,
        specialization: req.body.specialization,
        marks: req.body.marks,
        courselevel: req.body.courselevel
      }
    }
  },
    function (err, result) {
      if (err) {
        res.json(err);
      }
      else {
        res.json(result);
      }

    });
});

// update user details work info
router.put('/work/:id', (req, res, next) => {
  Profile.findByIdAndUpdate({ _id: req.params.id }, {
    $set: {
      workexp: {
        companyname: req.body.companyname,
        designation: req.body.designation,
        department: req.body.department,
        workexperience: req.body.workexperience
      }
    }
  },
    function (err, result) {
      if (err) {
        res.json(err);
      }
      else {
        res.json(result);
      }

    });
});

// update user details personal info
router.put('/user/:id', (req, res, next) => {
  User.findByIdAndUpdate({ _id: req.params.id }, {
    $set: {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email.toLowerCase(),
      password: req.body.password,
      mobilenumber: req.body.mobilenumber,
      country: req.body.country,
      location: req.body.location,
      aboutme: req.body.aboutme,
      creation_dt: Date.now()
    }
  },
    function (err, result) {
      if (err) {
        res.json(err);
      }
      else {
        res.json(result);
      }

    });
});



// Register
router.post('/register', (req, res, next) => {
  if (!req.body.email) {
    res.json({ success: false, message: 'You must provide an e-mail' });
  } else {
    if (!req.body.firstname) {
      res.json({ success: false, message: 'You must provide a firstname' });
    }
    else {
      if (!req.body.lastname) {
        res.json({ success: false, message: 'You must provide a lastname' });
      } else {
        if (!req.body.password) {
          res.json({ success: false, message: 'You must provide a password' });
        } else {
          let user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email.toLowerCase(),
            password: req.body.password,
            mobilenumber: req.body.mobilenumber,
            country: req.body.country,
            location: req.body.location,
            aboutme: req.body.aboutme,
            temporarytoken: jwt.sign({ email: 'user.email' }, config.secret, { expiresIn: '24h' }),
            creation_dt: Date.now()
          });
          user.save((err) => {
            if (err) {
              if (err.code == 11000) {
                res.json({ success: false, message: 'email already exists' });
              } else {
                if (err.errors) {
                  if (err.errors.email) {
                    res.json({ success: false, message: err.errors.email.message });
                  } else {
                    // Check if validation error is in the password field
                    if (err.errors.password) {
                      res.json({ success: false, message: err.errors.password.message }); // Return error
                    } else {
                      res.json({ success: false, message: err }); // Return any other error not already covered
                    }
                  }
                } else {
                  res.json({ success: false, message: 'Could not save user.Error:', err });
                }
              }
            } else {
              // Create e-mail object to send to user            
              nodemailer.createTestAccount((err, account) => {
                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                  host: 'smtp.gmail.com',
                  port: 587, //587
                  secure: false, // true for 465, false for other ports
                  auth: {
                    user: "schoolingcouncil2018@gmail.com", // your own gmail eg abc@gmail.com
                    pass: "Schoolingcouncil@2018"  // Enter secret gmail password not gmail login password
                  }
                });
                const email = {
                  from: 'schoolingcouncil Staff, staff@schoolingcouncil.com',
                  to: user.email,
                  subject: 'schoolingcouncil Activation Link',
                  text: 'Hello ' + user.email + ', thank you for registering at schoolingcouncil.com. Please click on the following link to complete your activation: http://localhost:4200/activate/' + user.temporarytoken,
                  html: 'Hello<strong> ' + user.email + '</strong>,<br><br>Thank you for registering at schoolingcouncil.com. Please click on the link below to complete your activation:<br><br><a href="http://localhost:4200/activate/' + user.temporarytoken + '">http://localhost:4200/activate/</a>'
                };
                transporter.sendMail(email, (error, info) => {
                  if (error) {
                    return console.log(error);
                  }
                  console.log('Message sent: %s', info.messageId);
                  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                });
              });
              res.json({ success: true, message: 'Acount registered! Please check your e-mail for activation link.' }); // Return success
            }
          });
        }
      }
    }
  }

});

// Route to activate the user's account	
router.put('/activate/:token', function (req, res) {
  User.findOne({ temporarytoken: req.params.token }, function (err, user) {
    if (err) throw err; // Throw error if cannot login
    var token = req.params.token; // Save the token from URL for verification 

    // Function to verify the user's token
    //jwt.verify(token, config.secret, function(err, decoded) {
    if (err) {
      res.json({ success: false, message: 'Activation link has expired.' }); // Token is expired
    } else if (!user) {
      res.json({ success: false, message: 'Activation link has expired.' }); // Token may be valid but does not match any user in the database
    } else {
      user.temporarytoken = false; // Remove temporary token
      user.active = true; // Change account status to Activated
      // Mongoose Method to save user into the database
      user.save(function (err) {
        if (err) {
          console.log(err); // If unable to save user, log error info to console/terminal
        } else {
          // If save succeeds, create e-mail object // Create e-mail object to send to user            
          nodemailer.createTestAccount((err, account) => {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
              host: 'smtp.gmail.com',
              port: 587, //587
              secure: false, // true for 465, false for other ports
              auth: {
                user: "schoolingcouncil2018@gmail.com", // eg john@gmail.com
                pass: "Schoolingcouncil@2018"  // hjdkalsfajs
              }
            });
            const email = {
              from: 'schoolingcouncil Staff, staff@schoolingcouncil.com',
              to: user.email,
              subject: 'Account Activated',
              text: 'Hello ' + user.email + ', Your account has been successfully activated!',
              html: 'Hello<strong> ' + user.email + '</strong>,<br><br>Your account has been successfully activated!'
            };
            transporter.sendMail(email, (error, info) => {
              if (error) {
                return console.log(error);
              }
            });
          });
          res.json({ success: true, message: 'Account activated!' }); // Return success message to controller
        }
      });
    }
  });
  // });
});

/* ===================================================================
 Route to verify user credentials and re-sending a new activation link	
 ====================================================================== */
router.post('/resend', (req, res) => {
  User.findOne({ email: req.body.email }).select('email password temporarytoken active').exec((err, user) => {
    if (err) throw err; // Throw error if cannot connect
    // Check if email is found in database
    if (!user) {
      res.json({ success: false, message: 'Could not authenticate user' }); // email does not match username found in database
    } else if (user) {
      // Check if password is sent in request
      if (req.body.password) {
        var validPassword = user.comparePassword(req.body.password); // Password was provided. Now check if matches password in database
        if (!validPassword) {
          res.json({ success: false, message: 'Could not authenticate password' }); // Password does not match password found in database
        } else if (user.active) {
          res.json({ success: false, message: 'Account is already activated.' }); // Account is already activated
        } else {
          // If save succeeds, create e-mail object // Create e-mail object to send to user            
          nodemailer.createTestAccount((err, account) => {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
              host: 'smtp.gmail.com',
              port: 587, //587
              secure: false, // true for 465, false for other ports
              auth: {
                user: "schoolingcouncil2018@gmail.com", // eg john@gmail.com
                pass: "Schoolingcouncil@2018"  // eg password sdjafhjkfaf
              }
            });
            // If user successfully saved to database, create e-mail object
            var email = {
              from: 'schoolingcouncil Staff, staff@schoolingcouncil.com',
              to: user.email,
              subject: 'schoolingcouncil Activation Link Request',
              text: 'Hello ' + user.email + ', You recently requested a new account activation link. Please click on the following link to complete your activation: http://localhost:4200/activate/' + user.temporarytoken,
              html: 'Hello<strong> ' + user.email + '</strong>,<br><br>You recently requested a new account activation link. Please click on the link below to complete your activation:<br><br><a href="http://localhost:4200/activate/' + user.temporarytoken + '">http://localhost:4200/activate/</a>'
            };
            // Function to send e-mail to user
            transporter.sendMail(email, (error, info) => {
              if (error) {
                return console.log(error);
              }
            });
          });
          res.json({ success: true, message: 'Activation link has been sent to ' + user.email + '!' }); // Return success message to controller
        }
      }
    }
  });
});

// Route for user logins
router.post('/authenticate', function (req, res) {
  User.findOne({ email: req.body.email }).select('email password active').exec(function (err, user) {
    if (err) throw err; // Throw err if cannot connect

    // Check if user is found in the database (based on username)			
    if (!user) {
      res.json({ success: false, message: 'email not found' }); // Username not found in database
    } else if (user) {
      // Check if user does exist, then compare password provided by user
      if (!req.body.password) {
        res.json({ success: false, message: 'No password provided' }); // Password was not provided
      } else {
        var validPassword = user.comparePassword(req.body.password); // Check if password matches password provided by user 
        if (!validPassword) {
          res.json({ success: false, message: 'Could not authenticate password' }); // Password does not match password in database
        } else if (!user.active) {
          res.json({ success: false, message: 'Account is not yet activated. Please check your e-mail for activation link.', expired: true }); // Account is not activated 
        } else {
          //var token = jwt.sign({ email: user.email}, config.secret, { expiresIn: '24h' }); // Logged in: Give user token
          const token = jwt.sign({ userId: user._id }, config.secret, {
            expiresIn: 604800 // 1 week
          });
          res.json({
            success: true, message: 'User authenticated!', token: token, user: { email: user.email }
          }); // Return token in JSON object to controller
        }
      }
    }
  });
});


//facebook login
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/login'
  }));

//google login
router.get('/auth/google',
  passport.authenticate('google', { scope: ['email'] }));

router.get('/auth/google/redirect',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/profile');
  });

//forgot password
router.put('/forgotpassword', (req, res) => {
  User.findOne({ email: req.body.email }).select('email active').exec((err, user) => {
    if (err) throw err; // Throw error if cannot connect
    if (!user) {
      res.json({ success: false, message: 'Email was not found' }); // Return error if username is not found in database
    } //else if (!user.active) {
    //res.json({ success: false, message: 'Account has not yet been activated' }); // Return error if account is not yet activated
    // }
    else {
      user.resettoken = jwt.sign({ firstname: user.firstname, email: user.email }, config.secret, { expiresIn: '24h' }); // Create a token for activating account through e-mail
      // Save token to user in database
      user.save((err) => {
        if (err) {
          res.json({ success: false, message: err }); // Return error if cannot connect
        } else {
          nodemailer.createTestAccount((err, account) => {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
              host: 'smtp.gmail.com',
              port: 587, //587
              secure: false, // true for 465, false for other ports
              auth: {
                user: "schoolingcouncil2018@gmail.com", // eg john@gmail.com
                pass: "Schoolingcouncil@2018"  // eg password jkfakfdhajfha
              }
            });
            const email = {
              from: 'schoolingcouncil Staff,schoolingcouncil2018@gmail.com',
              to: user.email,
              subject: 'schoolingcouncil Reset Password Request',
              text: 'Hello ' + user.email + ', You recently request a password reset link. Please click on the link below to reset your password:<br><br> <a href="http://localhost:4200/resetpassword/' + user.resettoken,
              html: 'Hello<strong> ' + user.email + '</strong>,<br><br>You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="http://localhost:4200/resetpassword/' + user.resettoken + '">http://localhost:4200/resetpassword/</a>'
            };
            transporter.sendMail(email, (error, info) => {
              if (error) {
                return console.log(error);
              }
              console.log('Message sent: %s', info.messageId);
              console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });
          });
          res.json({ success: true, message: 'Please check your e-mail for password reset link' }); // Return success message
        }
      });
    }
  });
});

// reset password
router.get('/resetpassword/:token', (req, res) => {

  User.findOne({ resettoken: req.params.token }).select('email').exec((err, user) => {
    if (err) throw err; // Throw err if cannot connect
    var token = req.params.token; // Save user's token from parameters to variable
    // Function to verify token
    //      jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      res.json({ success: false, message: 'Password Link Has Expired!!' });  // Token has expired or is invalid
    } else {
      if (!user) {
        res.json({ success: false, message: 'Password Link Has Expired' });  // Token is valid but not no user has that token anymore
      } else {
        res.json({ success: true, user: user, message: 'User Has Been Sent' });// Return user object to controller
      }
    }
  });
  //    });
});

/* ======================================
Save user's new password to database
========================================= */
router.put('/savepassword/', (req, res) => {
  User.findOne({ email: req.body.email }).select('email password resettoken').exec((err, user) => {
    if (err) throw err; // Throw error if cannot connect
    if (!user) {
      res.json({ success: false, message: 'User was not found' }); // Return error if user is not found in database
    }
    else if (!req.body.password || req.body.password == null || req.body.password == '') {
      res.json({ success: false, message: 'Password not provided' });
    } else {
      user.password = req.body.password; // Save user's new password to the user object
      //user.cnfpassword = req.body.cnfpassword;
      user.resettoken = false; // Clear user's resettoken 
      // Save user's new data
      user.save((err) => {
        if (err) {
          res.json({ success: false, message: err });
        } else {
          nodemailer.createTestAccount((err, account) => {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
              host: 'smtp.gmail.com',
              port: 587, //587
              secure: false, // true for 465, false for other ports
              auth: {
                user: "schoolingcouncil2018@gmail.com", // eg john@gmail.com
                pass: "Schoolingcouncil@2018"  // eg password jhsdajlkfhasj
              }
            });
            // Create e-mail object to send to user
            var email = {
              from: 'schoolingcouncil Staff, staff@schoolingcouncil.com',
              to: user.email,
              subject: 'schoolingcouncil Reset Password',
              text: 'Hello ' + user.email + ', This e-mail is to notify you that your password was recently reset at schoolingcouncil.com',
              html: 'Hello<strong> ' + user.email + '</strong>,<br><br>This e-mail is to notify you that your password was recently reset at schoolingcouncil.com'
            };
            transporter.sendMail(email, (error, info) => {
              if (error) {
                return console.log(error);
              }
              console.log('Message sent: %s', info.messageId);
              console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });
          });
          res.json({ success: true, message: 'Password has been reset!' }); // Return success message
        }
      });
    }
  });

});
//contactus
router.put('/contact', (req, res, next) => {
  if (!req.body.email) {
    res.json({ success: false, message: 'You must provide an email' });
  }
  else {
    if (!req.body.contactname) {
      res.json({ success: false, message: 'You must provide a name' });
    } else {
      if (!req.body.contactmessage) {
        res.json({ success: false, message: 'You must provide a message' });
      }
      else {
        // Create e-mail object to send to client
        nodemailer.createTestAccount((err, account) => {
          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587, //587
            secure: false, // true for 465, false for other ports
            auth: {
              user: "schoolingcouncil2018@gmail.com", // your own gmail eg abc@gmail.com
              pass: "Schoolingcouncil@2018"  // Enter secret gmail password not gmail login password
            }
          });
          const email = {
            from: 'Localhost Staff, staff@localhost.com',
            to: 'induece94@gmail.com',
            subject: 'Contact Form Submission',
            text: 'You have a submission with the following details... Name: ' + req.body.contactname + 'Email: ' + req.body.email + 'Message: ' + req.body.contactmessage,
            html: '<p>You have a submission with the following details...</p><ul><li>Name: ' + req.body.contactname + '</li><li>Email: ' + req.body.email.toLowerCase() + '</li><li>Message: ' + req.body.contactmessage + '</li></ul>'
          };
          transporter.sendMail(email, (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
          });
        });
        res.json({ success: true, message: 'we sent your information to our client' }); // Return success
      }
    }
  }
});

//middleware function
router.use((req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    res.json({ success: false, message: 'No token provided' });
  } else {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        res.json({ success: false, message: 'Token invalid' + err });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  }
});

//Profile
router.get('/profile', (req, res) => {
  User.findOne({ _id: req.decoded.userId }).select('firstname lastname email mobilenumber country location aboutme role').exec((err, user) => {
    if (err) {
      res.json({ success: false, message: err });
    } else {
      if (!user) {
        res.json({ success: false, message: 'User not found' });
      } else {
        res.json({ success: true, user: user });
      }
    }
  });
});

//profile info add
router.post('/profileinfo', function (req, res, next) {
  upload(req, res, next => {
    var fullPath = "uploads/" + req.file.filename;

    let newProfile = new Profile({
      _id: req.decoded.userId,
      path: fullPath,
      caption: req.body.caption,
      educationinfo: {
        universityname: req.body.universityname,
        degree: req.body.degree,
        coursecompletionyear: req.body.coursecompletionyear,
        collegename: req.body.collegename,
        specialization: req.body.specialization,
        marks: req.body.marks,
        courselevel: req.body.courselevel
      },
      workexp: {
        companyname: req.body.companyname,
        designation: req.body.designation,
        department: req.body.department,
        workexperience: req.body.workexperience
      }
    });
    newProfile.save((err, Profile) => {
      if (err) {
        res.json({ msg: 'Failded to add profiledetails' });
      } else {
        res.json({ msg: 'successfully add profile details' });
      }
    });
  });
});




module.exports = router;
