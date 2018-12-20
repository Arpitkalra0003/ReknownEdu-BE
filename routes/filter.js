var express = require('express');
var router = express.Router();
const University = require('../models/universityMaster.js');
const Country = require ('../models/countryMaster.js');
const Course = require ('../models/courseMaster.js');
const Location = require ('../models/locationMaster.js');
const Link = require ('../models/linkMaster.js');
const Company = require ('../models/company.js');
const pageSize1 = 19;
const pageSize2 = 3;
const pageSize = 3




router.get('/listofcourse', (req, res, next) => {
    var query = Course.find();

    if (Number(req.query.page) > 0) {
        query.skip(pageSize1 * (Number(req.query.page) - 1));
    }
    // query.select('name age');
    query.limit(pageSize1);

    query.exec(function (err, Courses) {
        res.json(Courses);
    })

});
router.get('/listofcoursewitLevel', (req, res, next) => {

    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("SchoolingDatabase");
        /*Return only the documents with the address "Park Lane 38":*/
        // console.log('con_id',req.query.con);
        // console.log('uni_id',req.query.id);
        dbo.collection("courses").find({level: req.query.level}).toArray(function (err, eResult1) {//passing the id through url (get)
            var out = {};//creating the empty object
            out['cou'] = eResult1;//
            
                    res.json(out);
                    db.close();
            
            
        });
    });

    
});
router.get('/universityByCountry', (req, res, next) => {

    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("SchoolingDatabase");
        /*Return only the documents with the address "Park Lane 38":*/
        // console.log('con_id',req.query.con);
        // console.log('uni_id',req.query.id);
        dbo.collection("universities").find({ id: req.query.id }).toArray(function (err, eResult1) {//passing the id through url (get)
            var out = {};//creating the empty object
            var fee = {};
           

            out['uni'] = eResult1[0];//
            var query = [
                {
                    $match:
                    {
                        country_id: req.query.con,
                        university_id: req.query.id
                    }
                },
                {
                    $lookup:
                    {
                        from: "courses",
                        localField: "course_id",
                        foreignField: "id",
                        as: "course_link"
                    }
                }
            ];
            dbo.collection("links").aggregate(query).toArray(function (err, eResult) {
                var courseList = {};
                eResult.forEach((e) => {
                    if (e.course_link[0] && e.course_link[0].level) {
                        if (!fee[e.course_link[0].level]) {
                            fee[e.course_link[0].level] = e.fees_min;
                        }
                        if(!courseList[e.course_link[0].level]){
                            courseList[e.course_link[0].level] =[];
                        }
                        courseList[e.course_link[0].level].push(e.course_link[0].name);
                                                
                    }
                 });
                var locId = eResult[0].location_id;
                query = { id: locId };
                dbo.collection("locations").find(query).toArray(function (err, resultLoc) {
                    out['loc'] = resultLoc[0];
                    out['requirement'] = eResult[0];
                    out['fee'] = fee;
                    out['courses'] = courseList;
                   
                    res.json(out);
                    db.close();
                });
            });
        });
    });
});
router.get('/universityByCountryloc', (req, res, next) => {

    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("SchoolingDatabase");
        /*Return only the documents with the address "Park Lane 38":*/
        // console.log('con_id',req.query.con);
        // console.log('uni_id',req.query.id);
        dbo.collection("universities").find({ id: req.query.id }).toArray(function (err, eResult1) {//passing the id through url (get)
            var out = {};//creating the empty object
            var fee = {};
           

            out['uni'] = eResult1[0];//
            var query = [
                {
                    $match:
                    {
                        country_id: req.query.con,
                        university_id: req.query.id,
                        location_id: req.query.loc
                    }
                },
                {
                    $lookup:
                    {
                        from: "courses",
                        localField: "course_id",
                        foreignField: "id",
                        as: "course_link"
                    }
                }
            ];
            dbo.collection("links").aggregate(query).toArray(function (err, eResult) {
                var courseList = {};
                eResult.forEach((e) => {
                    if (e.course_link[0] && e.course_link[0].level) {
                        if (!fee[e.course_link[0].level]) {
                            fee[e.course_link[0].level] = e.fees_min;
                        }
                        if(!courseList[e.course_link[0].level]){
                            courseList[e.course_link[0].level] =[];
                        }
                        courseList[e.course_link[0].level].push(e.course_link[0].name);
                                                
                    }
                 });
                
                    out['requirement'] = eResult[0];
                    out['fee'] = fee;
                    out['courses'] = courseList;
                   
                    res.json(out);
                    db.close();
            
            });
        });
    });
});

router.get('/university', (req, res, next) => {

    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("SchoolingDatabase");
        /*Return only the documents with the address "Park Lane 38":*/
        // console.log('con_id',req.query.con);
        // console.log('uni_id',req.query.id);
        dbo.collection("universities").find({ id: req.query.id }).toArray(function (err, eResult1) {//passing the id through url (get)
            var out = {};//creating the empty object
            var fee = {};
            out['uni'] = eResult1[0];//
            var query = [
                {
                    $match:
                    {
                        
                        university_id: req.query.id,
                        
                    }
                },
                {
                    $lookup:
                    {
                        from: "courses",
                        localField: "course_id",
                        foreignField: "id",
                        as: "course_link"
                    }
                }
            ];
            dbo.collection("links").aggregate(query).toArray(function (err, eResult) {
                var courseList = {};
                eResult.forEach((e) => {
                    if (e.course_link[0] && e.course_link[0].level) {
                        
                        if(!courseList[e.course_link[0].level]){
                            courseList[e.course_link[0].level] =[];
                        }
                        courseList[e.course_link[0].level].push(e.course_link[0].name);
                                                
                    }
                 });
                    out['fee'] = fee;
                    out['courses'] = courseList;
                    res.json(out);
                    db.close();
            
            });
        });
    });
});


module.exports = router;