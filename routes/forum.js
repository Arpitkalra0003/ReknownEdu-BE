const express = require('express');//value of variable not gone change
const router = express.Router();
const Forum = require('../models/Forum');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

//get all questions
router.get('/allQuestion', (req, res) => {
    Forum.find({}, (err, forums) => {
        if (err) {
            res.json({ success: false, messgage: err });
        } else {
            if (!forums) {
                res.json({ success: false, message: 'No Question Found' });
            } else {
                res.json({ success: true, forums: forums })
            }
        }
    }).sort({ '_id': -1 });
});

//get single question
router.get('/singleQuestion/:id', (req, res) => {
    // Check if id is present in parameters
    if (!req.params.id) {
        res.json({ success: false, message: 'No Question ID was provided.' }); // Return error message
    } else {
        // Check if the question id is found in database
        Forum.findOne({ _id: req.params.id }, (err, forum) => {
            // Check if the id is a valid ID
            if (err) {
                res.json({ success: false, message: 'Not a valid question id' }); // Return error message
            } else {
                // Check if question was found by id
                if (!forum) {
                    res.json({ success: false, message: 'Question not found.' }); // Return error message
                } else {
                    res.json({ success: true, forum: forum }); // Return success 
                }
            }
        });
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
//forum
router.post('/askquestion', (req, res) => {
    // Check if  title was provided
    if (!req.body.title) {
        res.json({ success: false, message: 'title is missing' }); // Return error message
    } else {
        // Check if body was provided
        if (!req.body.body) {
            res.json({ success: false, message: 'body is missing.' }); // Return error message
        } else {
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!user) {
                        res.json({ success: false, message: 'Unable To Authenticate User' });
                    } else {
                        // Create the forum object for insertion into database
                        const forum = new Forum({
                            title: req.body.title, // Title field
                            body: req.body.body, // Body field
                            createdBy: user.email, // person who post thz question
                            creation_dt: Date.now()
                        });
                        // Save details into database
                        forum.save((err) => {
                            // Check if error
                            if (err) {
                                // Check if error is a validation error
                                if (err.errors) {
                                    // Check if validation error is in the title field
                                    if (err.errors.title) {
                                        res.json({ success: false, message: err.errors.title.message }); // Return error message
                                    } else {
                                        // Check if validation error is in the body field
                                        if (err.errors.body) {
                                            res.json({ success: false, message: err.errors.body.message }); // Return error message
                                        } else {
                                            res.json({ success: false, message: err }); // Return general error message
                                        }
                                    }
                                } else {
                                    res.json({ success: false, message: err }); // Return general error message
                                }
                            } else {
                                res.json({ success: true, message: 'Your Question Saved!' }); // Return success message
                            }
                        });
                    }

                }
            });
        }

    }
});


//update question(edit function)
router.put('/updateQus/:id', (req, res) => {
    if (!req.body.title) {
        res.json({ success: false, message: 'title is missing' }); // Return error message
    } else {
        if (!req.body.body) {
            res.json({ success: false, message: 'body is missing.' }); // Return error message
        } else {
            // Check if id exists in database
            Forum.findOne({ _id: req.params.id }, (err, forum) => {
                // Check if id is a valid ID
                if (err) {
                    res.json({ success: false, message: 'Not a valid Question id' }); // Return error message
                } else {
                    // Check if id was found in the database
                    if (!forum) {
                        res.json({ success: false, message: 'Question id was not found.' }); // Return error message
                    } else {
                        // Check who user is that is requesting Qus update
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            // Check if error was found
                            if (err) {
                                res.json({ success: false, message: err }); // Return error message
                            } else {
                                // Check if user was found in the database
                                if (!user) {
                                    res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                                } else {
                                    forum.title = req.body.title; // Save latest  title
                                    forum.body = req.body.body; // Save latest body
                                    forum.createdBy =user.email;
                                    forum.creation_dt = Date.now();
                                    forum.save((err) => {
                                        if (err) {
                                            if (err.errors) {
                                                res.json({ success: false, message: 'Please ensure form is filled out properly' });
                                            } else {
                                                res.json({ success: false, message: err }); // Return error message
                                            }
                                        } else {
                                            res.json({ success: true, message: 'Your Question Updated!' }); // Return success message
                                        }
                                    });
                                }

                            }
                        });
                    }
                }
            });
        }
    }

});
// delete question function only for created user
router.delete('/deleteQus/:id', (req, res) => {
    // Check if ID was provided in parameters
    if (!req.params.id) {
        res.json({ success: false, message: 'No id provided' }); // Return error message
    } else {
        // Check if id is found in database
        Forum.findOne({ _id: req.params.id }, (err, forum) => {
            // Check if error was found
            if (err) {
                res.json({ success: false, message: 'Invalid id' }); // Return error message
            } else {
                // Check if Question was found in database
                if (!forum) {
                    res.json({ success: false, messasge: 'Question was not found' }); // Return error message
                } else {
                    // Get info on user who is attempting to delete post
                    User.findOne({ _id: req.decoded.userId }, (err, user) => {
                        // Check if error was found
                        if (err) {
                            res.json({ success: false, message: err }); // Return error message
                        } else {
                            // Check if user's id was found in database
                            if (!user) {
                                res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                            } else {
                                if (user.email !== forum.createdBy) {
                                    res.json({ success: false, message: 'you cannot del others post' });
                                } else {
                                    // Remove the Question from database
                                    forum.remove((err) => {
                                        if (err) {
                                            res.json({ success: false, message: err }); // Return error message
                                        } else {
                                            res.json({ success: true, message: 'Your Question deleted!' }); // Return success message
                                        }
                                    });
                                }
                            }

                        }
                    });
                }
            }
        });
    }
});

//answer update for particular id
//router.put('/:id/answers', function (req, res, next) {
//   Forum.findOne({ _id: req.params.id }, { $push: { answers: req.body } }, function (err, num) {
//     if (err) { return handleError(res)(err); }
//       if (num === 0) { return res.send(404).end(); }
//exports.show(req, res);
//  });
//});
//add answers
router.put('/answer/:id', (req, res, next) => {
    if (!req.body.content) {
        res.json({ success: false, message: 'content is missing' }); // Return error message
    } else {
        Forum.findOne({ _id: req.params.id }, (err, forum) => {
            if (err) {
                res.json({ success: false, message: 'Invalid Question id' }); // Return error message
            } else {
                if (!forum) {
                    res.json({ success: false, message: 'Question not found.' }); // Return error message
                } else {
                    User.findOne({ _id: req.decoded.userId }, (err, user) => {
                        // Check if error was found
                        if (err) {
                            res.json({ success: false, message: err }); // Return error message
                        } else {
                            // Check if user was found in the database
                            if (!user) {
                                res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                            } else {
                                // answer in array
                                // Add the new answer to the question post's 
                                // content field
                                if (Array.isArray(forum.answers)) {
                                    forum.answers.push({ content: req.body.content, answercreatedBy: user.email, creation_dt: Date.now() });
                                } else {
                                    forum.answers = [{ content: req.body.content, answercreatedBy: user.email, creation_dt: Date.now() }];
                                }
                                forum.totalanswers = forum.answers.length;
                                // Save answer post
                                forum.save((err) => {
                                    // Check if error was found
                                    if (err) {
                                        res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                                    } else {
                                        res.json({ success: true, message: 'Answer saved' }); // Return success message
                                    }
                                });

                            }
                        }
                    });
                }
            }
        });
    }

});


//update answer
router.put('/answers/:answersId', (req, res, next) => {
    if (!req.body.content) {
        res.json({ success: false, message: 'content is missing' }); // Return error message
    } else {
        User.findOne({ _id: req.decoded.userId }, (err, user) => {
            // Check if error was found
            if (err) {
                res.json({ success: false, message: err }); // Return error message
            } else {
                // Check if user was found in the database
                if (!user) {
                    res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                } else {
                    Forum.update({ 'answers._id': req.params.answersId }, {
                        $set: {
                            'answers.$.content': req.body.content,
                            'answers.$.answercreatedBy': user.email,
                        },
                    },
                        function (err, result) {
                            if (err) {
                                res.json(err);
                                console.log('something went wrong');
                            }
                            else {
                                res.json({ success: true, message: 'Your Answer Updated!' }); // Return success message
                            }

                        });
                }
            }
        });
    }
});


// delete answer only for created user
router.delete("/:id/delanswers/:answerId", function (req, res) {
    Forum.findOne({ 'answers._id': req.params.answerId }, (err, ans) => {
        var x = req.params.answerId;
        for (i = 0; i < ans.answers.length; i++) {
            if (ans.answers[i]._id == x) {
                var ansresult = ans.answers[i];
                console.log(ansresult);

            }
        }
        if (err) {
            res.json({ success: false, message: 'Invalid id' }); // Return error message
        } else {
            if (!ansresult) {
                res.json({ success: false, messasge: 'Answer was not found' }); // Return error message
            } else {
                // Get info on user who is attempting to delete post
                User.findOne({ _id: req.decoded.userId }, (err, user) => {
                    if (err) {
                        res.json({ success: false, message: err }); // Return error message
                    } else {
                        // Check if user's id was found in database
                        if (!user) {
                            res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                        } else {
                            if (user.email !== ansresult.answercreatedBy) {
                                //console.log(ansresult.answercreatedBy);
                                res.json({ success: false, message: 'you cannot delete others Answer post' });
                            } else {
                                Forum.findOneAndUpdate({ _id: req.params.id }, {
                                    $pull: { "answers": { "_id": req.params.answerId } }
                                }, { safe: true },
                                    function (err, result) {
                                        if (err) {
                                            // console.log(err);
                                            res.json({ success: false, message: err }); // Return error message   
                                        }
                                        else {
                                            //console.log(answerId);
                                            res.json({ success: true, message: 'Your Answer deleted!' }); // Return success message
                                        }
                                    });
                            }
                        }
                    }
                });
            }
        }
    });



});

//question comments
router.put('/quscomment/:id', (req, res) => {
    // Check if comment was provided in request body
    if (!req.body.comment) {
        res.json({ success: false, message: 'No comment provided' }); // Return error message
    } else {
        // Use id to search for post in database
        Forum.findOne({ _id: req.params.id }, (err, forum) => {
            // Check if error was found
            if (err) {
                res.json({ success: false, message: 'Invalid question id' }); // Return error message
            } else {
                // Check if id matched the id of any question in the database
                if (!forum) {
                    res.json({ success: false, message: 'Question not found.' }); // Return error message
                } else {
                    // Grab data of user that is logged in
                    User.findOne({ _id: req.decoded.userId }, (err, user) => {
                        // Check if error was found
                        if (err) {
                            res.json({ success: false, message: 'Something went wrong' }); // Return error message
                        } else {
                            // Check if user was found in the database
                            if (!user) {
                                res.json({ success: false, message: 'User not found.' }); // Return error message
                            } else {
                                // Add the new comment to the question array
                                if (Array.isArray(forum.qus_comments)) {
                                    forum.qus_comments.push({ comment: req.body.comment, commentator: user.email });
                                } else {
                                    forum.qus_comments = [{ comment: req.body.comment, commentator: user.email }];
                                }
                                // Save 
                                forum.save((err) => {
                                    // Check if error was found
                                    if (err) {
                                        res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                                    } else {
                                        res.json({ success: true, message: 'Comment saved' }); // Return success message
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    }
});
//update qus comment only for commentator
router.put('/updateQuscomments/:commentId', (req, res) => {
    if (!req.body.comment) {
        res.json({ success: false, message: 'comment is missing' }); // Return error message
    } else {
        // Check if id exists in database
        Forum.findOne({ 'qus_comments._id': req.params.commentId }, (err, forum) => {
            //res.json(forum);
            var x = req.params.commentId;
            //var y = forum.answers[0].ans_comments.length;
            for (i = 0; i < forum.qus_comments.length; i++) {

                if (forum.qus_comments[i]._id == x) {
                    // res.json(forum.answers[i].ans_comments[j]);
                    var commentresultup = forum.qus_comments[i];
                    //console.log(commentresultup);
                }

            }
            if (err) {
                res.json({ success: false, message: 'Not a valid comment id' }); // Return error message
            } else {
                // Check if id was found in the database
                if (!commentresultup) {
                    res.json({ success: false, message: 'Comment id was not found.' }); // Return error message
                } else {
                    // Check who user is that is requesting Qus update
                    User.findOne({ _id: req.decoded.userId }, (err, user) => {
                        // Check if error was found
                        if (err) {
                            res.json({ success: false, message: err }); // Return error message
                        } else {
                            if (!user) {
                                res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                            } else {
                                if (user.email !== commentresultup.commentator) {
                                    //console.log(ansresult.answercreatedBy);
                                    res.json({ success: false, message: 'you cannot update others comment post' });
                                } else {
                                    commentresultup.comment = req.body.comment;// save latest comment in answer
                                    forum.save((err) => {
                                        if (err) {
                                            res.json({ success: true, message: 'Something went wrong' }); // Return error message
                                        } else {
                                            res.json({ success: true, message: 'Your Comment Updated!' }); // Return success message
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
            }
        });
    }
});
//delete qus comments only for commentator
router.delete("/:id/delQuscomments/:commentId", function (req, res) {
    Forum.findOne({ 'qus_comments._id': req.params.commentId }, (err, forum) => {
        //res.json(forum);
        var x = req.params.commentId;
        //var y = forum.answers[0].ans_comments.length;
        for (i = 0; i < forum.qus_comments.length; i++) {

            if (forum.qus_comments[i]._id == x) {
                // res.json(forum.answers[i].ans_comments[j]);
                var commentresultup = forum.qus_comments[i];
                //console.log(commentresultup);
            }

        }
        if (err) {
            res.json({ success: false, message: 'Invalid id' }); // Return error message
        } else {
            if (!commentresultup) {
                res.json({ success: false, messasge: 'Comment was not found' }); // Return error message
            } else {
                // Get info on user who is attempting to delete post
                User.findOne({ _id: req.decoded.userId }, (err, user) => {
                    if (err) {
                        res.json({ success: false, message: err }); // Return error message
                    } else {
                        // Check if user's id was found in database
                        if (!user) {
                            res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                        } else {
                            if (user.email !== commentresultup.commentator) {
                                //console.log(ansresult.answercreatedBy);
                                res.json({ success: false, message: 'you cannot delete others comment' });
                            } else {
                                Forum.findOneAndUpdate({ _id: req.params.id }, {
                                    $pull: { "qus_comments": { "_id": req.params.commentId } }
                                }, { safe: true },
                                    function (err, result) {
                                        if (err) {
                                            // console.log(err);
                                            res.json({ success: false, message: err }); // Return error message   
                                        }
                                        else {
                                            //console.log(answerId);
                                            res.json({ success: true, message: 'Your Comment deleted!' }); // Return success message
                                        }
                                    });
                            }
                        }
                    }
                });
            }
        }
    });



});


//add comments for answer
router.put('/comments/:answerId', (req, res, next) => {
    if (!req.body.comment) {
        res.json({ success: false, message: 'comment is missing' }); // Return error message
    } else {
        Forum.findOne({ 'answers._id': req.params.answerId }, (err, forum) => {
            var x = req.params.answerId;
            for (i = 0; i < forum.answers.length; i++) {
                if (forum.answers[i]._id == x) {
                    //console.log(forum.answers[i]);
                    var commentresult = forum.answers[i];
                }
            }
            if (err) {
                res.json({ success: false, message: 'Invalid Answer id' }); // Return error message
            } else {
                if (!commentresult) {
                    res.json({ success: false, message: 'Answer not found.' }); // Return error message
                } else {
                    User.findOne({ _id: req.decoded.userId }, (err, user) => {
                        // Check if error was found
                        if (err) {
                            res.json({ success: false, message: err }); // Return error message
                        } else {
                            // Check if user was found in the database
                            if (!user) {
                                res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                            } else {
                                if (Array.isArray(commentresult.ans_comments)) {
                                    commentresult.ans_comments.push({ comment: req.body.comment, commentator: user.email });
                                } else {
                                    commentresult.ans_comments = [{ comment: req.body.comment, commentator: user.email }];
                                }
                                forum.save((err) => {
                                    if (err) {
                                        res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                                    } else {
                                        res.json({ success: true, message: 'comment saved' }); // Return success message
                                    }
                                });
                            }
                        }
                    });
                }
            }

        });
    }

});

//update Answer comments
router.put('/updatecomments/:commentId', (req, res) => {
    if (!req.body.comment) {
        res.json({ success: false, message: 'comment is missing' }); // Return error message
    } else {
        // Check if id exists in database
        Forum.findOne({ 'answers.ans_comments._id': req.params.commentId }, (err, forum) => {
            //res.json(forum);
            var x = req.params.commentId;
            //var y = forum.answers[0].ans_comments.length;
            for (i = 0; i < forum.answers.length; i++) {
                for (j = 0; j < forum.answers[i].ans_comments.length; j++) {
                    if (forum.answers[i].ans_comments[j]._id == x) {
                        // res.json(forum.answers[i].ans_comments[j]);
                        var commentresultup = forum.answers[i].ans_comments[j];
                    }
                }
            }
            if (err) {
                res.json({ success: false, message: 'Not a valid comment id' }); // Return error message
            } else {
                // Check if id was found in the database
                if (!commentresultup) {
                    res.json({ success: false, message: 'Comment id was not found.' }); // Return error message
                } else {
                    // Check who user is that is requesting Qus update
                    User.findOne({ _id: req.decoded.userId }, (err, user) => {
                        // Check if error was found
                        if (err) {
                            res.json({ success: false, message: err }); // Return error message
                        } else {
                            if (!user) {
                                res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                            } else {
                                if (user.email !== commentresultup.commentator) {
                                    //console.log(ansresult.answercreatedBy);
                                    res.json({ success: false, message: 'you cannot update others comment post' });
                                } else {
                                    commentresultup.comment = req.body.comment;// save latest comment in answer
                                    forum.save((err) => {
                                        if (err) {
                                            res.json({ success: true, message: 'Something went wrong' }); // Return error message
                                        } else {
                                            res.json({ success: true, message: 'Your Comment Updated!' }); // Return success message
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
            }
        });
    }
});
// delete Answer Comments only for commentator
router.delete('/deletecomments/:commentId', (req, res) => {
    Forum.findOne({ 'answers.ans_comments._id': req.params.commentId }, (err, forum) => {
        var x = req.params.commentId;
        //var y = forum.answers[0].ans_comments.length;
        for (i = 0; i < forum.answers.length; i++) {
            for (j = 0; j < forum.answers[i].ans_comments.length; j++) {
                if (forum.answers[i].ans_comments[j]._id == x) {
                    // res.json(forum.answers[i].ans_comments[j]);
                    var commentresultdel = forum.answers[i].ans_comments[j];
                    // console.log(commentresultdel);
                    //res.json(commentresultdel);
                }
            }
        }
        if (err) {
            res.json({ success: false, message: 'Invalid id' }); // Return error message
        } else {
            if (!commentresultdel) {
                res.json({ success: false, messasge: 'Comment was not found' }); // Return error message
            } else {
                User.findOne({ _id: req.decoded.userId }, (err, user) => {
                    if (err) {
                        res.json({ success: false, message: err }); // Return error message
                    } else {
                        if (!user) {
                            res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                        } else {
                            if (user.email !== commentresultdel.commentator) {
                                console.log(commentresultdel.commentator);
                                res.json({ success: false, message: 'you cannot del others comment' });
                            } else {
                                // commentresultdel.remove();
                                commentresultdel.remove((err, resultcmnt) => {
                                    if (err) {
                                        res.json({ msg: "comment is not removed" });
                                    } else {
                                        forum.save((err) => {
                                            if (err) {
                                                res.json({ success: false, message: 'Something went wrong' }); // Return success message
                                            } else {
                                                res.json({ success: true, message: 'Your Comment deleted!' }); // Return success message
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    }
                });
            }
        }
    });
});

//likes for question
router.put('/likequs', (req, res) => {
    // Check if id was passed provided in request body
    if (!req.body.id) {
        res.json({ success: false, message: 'No id was provided.' }); // Return error message
    } else {
        // Search the database with id
        Forum.findOne({ _id: req.body.id }, (err, forum) => {
            // Check if error was encountered
            if (err) {
                res.json({ success: false, message: 'Invalid question id' }); // Return error message
            } else {
                // Check if id matched the id of a  post in the database
                if (!forum) {
                    res.json({ success: false, message: 'That question was not found.' }); // Return error message
                } else {
                    // Get data from user that is signed in
                    User.findOne({ _id: req.decoded.userId }, (err, user) => {
                        // Check if error was found
                        if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                        } else {
                            // Check if id of user in session was found in the database
                            if (!user) {
                                res.json({ success: false, message: 'Could not authenticate user.' }); // Return error message
                            } else {
                                // Check if user who liked post is the same user that originally created the post
                                if (user.email === forum.createdBy) {
                                    res.json({ success: false, message: 'Cannot like your own post.' }); // Return error message
                                } else {
                                    // Check if the user who liked the post has already liked the  post before
                                    if (forum.likedBy.includes(user.email)) {
                                        res.json({ success: false, message: 'You already liked this post.' }); // Return error message
                                    } else {
                                        // Check if user who liked post has previously disliked a post
                                        if (forum.dislikedBy.includes(user.email)) {
                                            forum.dislikes--; // Reduce the total number of dislikes
                                            const arrayIndex = forum.dislikedBy.indexOf(user.email); // Get the index of the username in the array for removal
                                            forum.dislikedBy.splice(arrayIndex, 1); // Remove user from array
                                            forum.likes++; // Increment likes
                                            forum.likedBy.push(user.email); // Add username to the array of likedBy array
                                            // Save data
                                            forum.save((err) => {
                                                // Check if error was found
                                                if (err) {
                                                    res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                                                } else {
                                                    res.json({ success: true, message: 'Question liked!' }); // Return success message
                                                }
                                            });
                                        } else {
                                            forum.likes++; // Incriment likes
                                            forum.likedBy.push(user.email); // Add liker's username into array of likedBy
                                            // Save post
                                            forum.save((err) => {
                                                if (err) {
                                                    res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                                                } else {
                                                    res.json({ success: true, message: 'Question liked!' }); // Return success message
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            }
        });
    }
});

//dislikes for qus
router.put('/dislikeQus', (req, res) => {
    // Check if id was provided inside the request body
    if (!req.body.id) {
        res.json({ success: false, message: 'No id was provided.' }); // Return error message
    } else {
        // Search database for  post using the id
        Forum.findOne({ _id: req.body.id }, (err, forum) => {
            // Check if error was found
            if (err) {
                res.json({ success: false, message: 'Invalid question id' }); // Return error message
            } else {
                // Check if  post with the id was found in the database
                if (!forum) {
                    res.json({ success: false, message: 'That question was not found.' }); // Return error message
                } else {
                    // Get data of user who is logged in
                    User.findOne({ _id: req.decoded.userId }, (err, user) => {
                        // Check if error was found
                        if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                        } else {
                            // Check if user was found in the database
                            if (!user) {
                                res.json({ success: false, message: 'Could not authenticate user.' }); // Return error message
                            } else {
                                // Check if user who disliekd post is the same person who originated the  post
                                if (user.email === forum.createdBy) {
                                    res.json({ success: false, messagse: 'Cannot dislike your own post.' }); // Return error message
                                } else {
                                    // Check if user who disliked post has already disliked it before
                                    if (forum.dislikedBy.includes(user.email)) {
                                        res.json({ success: false, message: 'You already disliked this post.' }); // Return error message
                                    } else {
                                        // Check if user has previous disliked this post
                                        if (forum.likedBy.includes(user.email)) {
                                            forum.likes--; // Decrease likes by one
                                            const arrayIndex = forum.likedBy.indexOf(user.email); // Check where username is inside of the array
                                            forum.likedBy.splice(arrayIndex, 1); // Remove username from index
                                            forum.dislikes++; // Increase dislikeds by one
                                            forum.dislikedBy.push(user.email); // Add username to list of dislikers
                                            // Save data
                                            forum.save((err) => {
                                                // Check if error was found
                                                if (err) {
                                                    res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                                                } else {
                                                    res.json({ success: true, message: 'Question disliked!' }); // Return success message
                                                }
                                            });
                                        }

                                        else {
                                            forum.dislikes++; // Increase likes by one
                                            forum.dislikedBy.push(user.email); // Add username to list of likers
                                            // Save  data
                                            forum.save((err) => {
                                                // Check if error was found
                                                if (err) {
                                                    res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                                                } else {
                                                    res.json({ success: true, message: 'Question disliked!' }); // Return success message
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            }
        });
    }
});

//likes for answer
router.put('/likeans/:answerId', (req, res) => {
    // Check if id was passed provided in request body
    // Search the database with id
    Forum.findOne({ 'answers._id': req.params.answerId }, (err, ans) => {
        var x = req.params.answerId;
        for (i = 0; i < ans.answers.length; i++) {
            if (ans.answers[i]._id == x) {
                //console.log(ans.answers[i]);
                var ansresult = ans.answers[i];
                //console.log(ansresult);
                //res.json(ans.answers[i]);
            }
        }
        // Check if error was encountered
        if (err) {
            res.json({ success: false, message: 'Invalid Answer id' }); // Return error message
        } else {
            // Check if id matched the id of a  post in the database
            if (!ansresult) {
                res.json({ success: false, message: 'That answer was not found.' }); // Return error message
            } else {
                // Get data from user that is signed in
                User.findOne({ _id: req.decoded.userId }, (err, user) => {
                    // Check if error was found
                    if (err) {
                        res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                    } else {
                        // Check if id of user in session was found in the database
                        if (!user) {
                            res.json({ success: false, message: 'Could not authenticate user.' }); // Return error message
                        } else {
                            // Check if user who liked post is the same user that originally created the post
                            if (user.email === ansresult.answercreatedBy) {
                                //console.log(ansresult.answercreatedBy);
                                res.json({ success: false, messagse: 'Cannot like your own post.' }); // Return error message
                            } else {
                                // Check if the user who liked the post has already liked the  post before
                                if (ansresult.likedAnswerBy.includes(user.email)) {
                                    res.json({ success: false, message: 'You already liked this post.' }); // Return error message
                                } else {
                                    // Check if user who liked post has previously disliked a post
                                    if (ansresult.dislikedAnswerBy.includes(user.email)) {
                                        ansresult.dislikesAnswer--; // Reduce the total number of dislikes
                                        const arrayIndex = ansresult.dislikedAnswerBy.indexOf(user.email); // Get the index of the username in the array for removal
                                        ansresult.dislikedAnswerBy.splice(arrayIndex, 1); // Remove user from array
                                        ansresult.likesAnswer++; // Increment likes
                                        ansresult.likedAnswerBy.push(user.email); // Add username to the array of likedBy array
                                        // Save data
                                        ans.save((err) => {
                                            // Check if error was found
                                            if (err) {
                                                res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                                            } else {
                                                res.json({ success: true, message: 'Answer liked!' }); // Return success message
                                            }
                                        });
                                    } else {
                                        ansresult.likesAnswer++; // Incriment likes
                                        ansresult.likedAnswerBy.push(user.email); // Add liker's username into array of likedBy
                                        // Save post
                                        ans.save((err) => {
                                            if (err) {
                                                res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                                            } else {
                                                res.json({ success: true, message: 'Answer liked!' }); // Return success message
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
    });

});

router.put('/likea/:answerId', (req, res) => {
    // var query = { 'answers._id' : req.params.answerId };

    //console.log(query);
    Forum.findOne({ 'answers._id': req.params.answerId }, function (err, item) {
        var x = req.params.answerId;

        for (i = 0; i < item.answers.length; i++) {
            if (item.answers[i]._id == x) {
                console.log(item.answers[i]);
                res.json(item.answers[i]);
            }
        }
        // var ans = item.answers[0];
        /// console.log(ans);
        // var list = item.answers.length;
        // if(err)
        // {
        //     res.json({msg:"something went wrong"});
        //}else
        // {
        //console.log(list);
        //res.json(item);
        // }
    });

});



//dislikes for answer
router.put('/dislikeans/:answerId', (req, res) => {
    // Check if id was passed provided in request body
    // Search the database with id
    Forum.findOne({ 'answers._id': req.params.answerId }, (err, ans) => {
        var x = req.params.answerId;
        for (i = 0; i < ans.answers.length; i++) {
            if (ans.answers[i]._id == x) {
                //console.log(ans.answers[i]);
                var ansresult = ans.answers[i];
                //console.log(ansresult);
                //res.json(ans.answers[i]);
            }
        }
        // Check if error was encountered
        if (err) {
            res.json({ success: false, message: 'Invalid Answer id' }); // Return error message
        } else {
            // Check if id matched the id of a  post in the database
            if (!ansresult) {
                res.json({ success: false, message: 'That answer was not found.' }); // Return error message
            } else {
                // Get data from user that is signed in
                User.findOne({ _id: req.decoded.userId }, (err, user) => {
                    // Check if error was found
                    if (err) {
                        res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                    } else {
                        // Check if id of user in session was found in the database
                        if (!user) {
                            res.json({ success: false, message: 'Could not authenticate user.' }); // Return error message
                        } else {
                            // Check if user who disliked post is the same user that originally created the post
                            if (user.email === ansresult.answercreatedBy) {
                                //console.log(ansresult.answercreatedBy);
                                res.json({ success: false, messagse: 'Cannot dislike your own post.' }); // Return error message
                            } else {
                                // Check if the user who disliked the post has already disliked the  post before
                                if (ansresult.dislikedAnswerBy.includes(user.email)) {
                                    res.json({ success: false, message: 'You already disliked this post.' }); // Return error message
                                } else {
                                    // Check if user has previous disliked this post
                                    if (ansresult.likedAnswerBy.includes(user.email)) {
                                        ansresult.likesAnswer--; // Reduce the total number of dislikes
                                        const arrayIndex = ansresult.likedAnswerBy.indexOf(user.email); // Get the index of the username in the array for removal
                                        ansresult.likedAnswerBy.splice(arrayIndex, 1); // Remove user from array
                                        ansresult.dislikesAnswer++; // Increment dislikes
                                        ansresult.dislikedAnswerBy.push(user.email); // Add username to the array of dislikedBy array
                                        // Save data
                                        ans.save((err) => {
                                            // Check if error was found
                                            if (err) {
                                                res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                                            } else {
                                                res.json({ success: true, message: 'Answer disliked!' }); // Return success message
                                            }
                                        });
                                    } else {
                                        ansresult.dislikesAnswer++; // Incriment likes
                                        ansresult.dislikedAnswerBy.push(user.email); // Add disliker's username into array of dislikedBy
                                        // Save post
                                        ans.save((err) => {
                                            if (err) {
                                                res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                                            } else {
                                                res.json({ success: true, message: 'Answer disliked!' }); // Return success message
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
    });

});

router.delete("/ans/:id/:answerId/answerscomments/:commentId", function (req, res) {

    Forum.findOneAndUpdate({ _id: req.params.id }, {
        $pull: { "answers.1.ans_comments": { "_id": req.params.commentId } }
    }, { safe: true, multi: true },
        function (err, result) {
            if (err) {
                console.log(err);
                res.json({ msg: "somethong went wrong" })
            }
            else {
                res.json({ msg: "success" });
                // res.redirect("/qus/" + foundAnimal._id + "/answers");
            }
        });

});


module.exports = router;
