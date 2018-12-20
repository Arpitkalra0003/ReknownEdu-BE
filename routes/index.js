var express = require('express');
var router = express.Router();
const University = require('../models/universityMaster.js');
const Country = require ('../models/countryMaster.js');
const Course = require ('../models/courseMaster.js');
const Location = require ('../models/locationMaster.js');
const Link = require ('../models/linkMaster.js');
const Company = require ('../models/company.js');
const pageSize1 = 3;
const pageSize2 = 3;
const pageSize = 3

router.get('/company', (req, res, next) => {
    var query = Company.find();

    if (Number(req.query.page) > 0) {
        query.skip(pageSize1 * (Number(req.query.page) - 1));
    }
    // query.select('name age');
    query.limit(pageSize1);

    query.exec(function (err, Companies) {
        res.json(Companies);
    })

});
router.post('/companyAdd', (req, res, next) => {
    let newCompany = new Company({
        id: req.body.id,
        name: req.body.name,
        sector: req.body.sector,
        country: req.body.country,
        location: req.body.location,
        address: req.body.address,
        comp_link: req.body.comp_link,
        phone_number: req.body.phone_number
    });
  //console.log(newUniversity);
     newCompany.save((err, company) => {
        if (err) {
            res.json({ msg: 'failed to add university' });
        }
        else {
            res.json({ msg: 'Company added successfully' });
        }
    });
  });
 
  router.get("/companyLocation/:id", (req,res,next) => {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function (err, db){
        if (err) throw err;
        var dbo = db.db("SchoolingDatabase");
        /*Return only the documents with the address "Park Lane 38":*/
        var query = { location: { $in: [req.params.id] } };
        dbo.collection("companies").find(query).toArray(function (err, companies) {
            var out = [];
            companies.forEach((comp) => {
                out.push({ sector:comp.sector,name: comp.name, country: comp.country,address: comp.address });
            });
            res.json(out);
            db.close();
        });

    });

  });
 
router.get('/university', (req, res, next) => {
    var query = University.find();

    if (Number(req.query.page) > 0) {
        query.skip(pageSize1 * (Number(req.query.page) - 1));
    }
    // query.select('name age');
    query.limit(pageSize1);

    query.exec(function (err, universities) {
        res.json(universities);
    })

});

//add university
router.post('/university', (req, res, next) => {
  let newUniversity = new University({
      id: req.body.id,
      name: req.body.name,
      link: req.body.link,
      world_rank: req.body.world_rank,
      country_rank: req.body.country_rank,
      logo: req.body.logo,
      overview: req.body.overview,
      alumni: req.body.alumni,
      professor_faculty: req.body.professor_faculty,
      ug_howtoapply: req.body.ug_howtoapply,
      pg_howtoapply: req.body.pg_howtoapply,
      tutionfees_link: req.body.tutionfees_link,
      ug_program_link: req.body.ug_program_link,
      pg_program_link: req.body.pg_program_link,
      phd_program_link: req.body.phd_program_link,
      acceptance_ratio: req.body.acceptance_ratio,
      student_faculty_ratio: req.body.student_faculty_ratio,
      ug_fees_min: req.body.ug_fees_min,
      ug_fees_max: req.body.ug_fees_max,
      pg_fees_min: req.body.pg_fees_min,
      pg_fees_max: req.body.pg_fees_max,
      phd_fees_min: req.body.phd_fees_min,
      phd_fees_max: req.body.phd_fees_max
     
  });
//console.log(newUniversity);
  newUniversity.save((err, university) => {
      if (err) {
          res.json({ msg: 'failed to add university' });
      }
      else {
          res.json({ msg: 'university added successfully' });
      }
  });
});

//COURSEINFO
//*------------------Course crud operation--------------*//
//get list of Course
router.get('/course', (req, res, next) => {
    Course.find(function (err, courses) {
        res.json(courses);
    })
});
//create the new Course
router.post('/course', (req, res, next) => {
    let newCourse = new Course({
        id: req.body.id,
        name: req.body.name,
        level: req.body.level
    });
    newCourse.save((err, course) => {
        if (err) {
            res.json({ msg: 'failed to add course' });
        }
        else {
            res.json({ msg: 'course added successfully' });
        }
    });
});
//update the Course info
router.put('/course/:id', (req, res, next) => {
    Course.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            id: req.body.id,
            name: req.body.name,
            level: req.body.level
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
//Delete the Course info 
router.delete('/course/:id', (req, res, next) => {
    Course.findByIdAndDelete({ _id: req.params.id }, function (err, result) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(result);
        }
    });
});
//COUNTRYINFO
//*------------------Country crud operation--------------*//
//create the new country
router.post('/country', (req, res, next) => {
    let newCountry = new Country({
        id: req.body.id,
        name: req.body.name,
        visaDescription: req.body.visaDescription,
        scholershipLink: req.body.scholershipLink,
        currency: req.body.currency,
        visaLink: req.body.visaLink,
        ugmin_salary: req.body.ugmin_salary,
        ugmax_salary: req.body.ugmax_salary,
        pgmin_salary: req.body.pgmin_salary,
        pgmax_salary: req.body.pgmax_salary,
        phdmin_salary: req.body.phdmin_salary,
        phdmax_salary: req.body.phdmax_salary
    });
    newCountry.save((err, county) => {
        if (err) {
            res.json({ msg: 'failed to add country details' });
        }
        else {
            res.json({ msg: 'country details added successful' });
        }
    });


});
//update the country info
router.put('/country/:id', (req, res, next) => {
    Country.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            id: req.body.id,
            name: req.body.name,
            visaDescription: req.body.visaDescription,
            scholershipLink: req.body.scholershipLink,
            currency: req.body.currency,
            visaLink: req.body.visaLink,
            ugmin_salary: req.body.ugmin_salary,
            ugmax_salary: req.body.ugmax_salary,
            pgmin_salary: req.body.pgmin_salary,
            pgmax_salary: req.body.pgmax_salary,
            phdmin_salary: req.body.phdmin_salary,
            phdmax_salary: req.body.phdmax_salary
        }
    }, function (err, result) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(result);
        }
    });

});
//Delete the country info 
router.delete('/country/:id', (req, res, next) => {
    Country.findByIdAndDelete({ _id: req.body.id }, function (err, result) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(result);
        }
    });
});


//LOCATIONINFO
//*------------------location crud operation--------------*//
//create a location
router.post('/location', (req, res, next) => {
    let newLocation = new Location({
        id: req.body.id,
        name: req.body.name,
        country_id: req.body.country_id
    });
    newLocation.save((err, location) => {
        if (err) {
            res.json({ msg: 'failed to add location' });
        }
        else {
            res.json({ msg: 'location added successfully' });
        }
    });
});
//update the location info
router.put('/location/:id', (req, res, next) => {
    Location.findByIdAndUpdate({ _id: req.params.id }, { $set: { id: req.body.id, name: req.body.name, country_id: req.body.country_id } },
        function (err, result) {
            if (err) {
                res.json(err);
            }
            else {
                res.json(result);
            }
        });
});
//Delete the location info 
router.delete('/location/:id', (req, res, next) => {
    Location.findByIdAndDelete({ _id: req.params.id }, function (err, result) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(result);
        }
    });
});

//LINKMASTER INFO
//create
router.post('/link', (req, res, next) => {
    let newLink = new Link({
        country_id: req.body.country_id,
        location_id: req.body.location_id,
        university_id: req.body.university_id,
        course_id: req.body.course_id,
        course_link: req.body.course_link,
        tutionfees_link: req.body.tutionfees_link,
        howtoapply_link: req.body.howtoapply_link,
        fees_min: req.body.fees_min,
        fees_max: req.body.fees_max,
        toefl: req.body.toefl
    });
    newLink.save((err, link) => {
        if (err) {
            res.json({ msg: 'failed to add linking' });
        }
        else {
            res.json({ msg: 'linking added successfully' });
        }
    });
});

router.get('/viewAllUni/:id', (req, res, next) => {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("university");
        /*Return only the documents with the address "Park Lane 38":*/
        var query = { country_id: { $in: [req.params.id] } };
        dbo.collection("linkings").find(query).toArray(function (err, eResult) {
            var uIds = {};
            var ids = {};
            eResult.forEach((link, index) => {
                if (!uIds[link.university_id]) {
                    uIds[link.university_id] = {};
                }
                if (!ids[link.location_id]) {
                    ids[link.location_id] = {};
                }
            });
            var out = [];
            query = { id: { $in: Object.keys(uIds) } };
            dbo.collection("universities").find(query).toArray(function (err, universities) {
                universities.forEach((uni) => {
                    uIds[uni.id] = ({name:uni.name,con_rank:uni.country_rank});
                });
                query = { id: { $in: Object.keys(ids) } };
                dbo.collection("locations").find(query).toArray(function (err, locations) {
    
                    locations.forEach((loc) => {
                        ids[loc.id] = loc.name;
                    });
                    var list= {};
                    eResult.forEach((link, index) => {
                        if (!uIds[link.university_id]) {
                            uIds[link.university_id] = {};
                        }
                        if (!ids[link.location_id]) {
                            ids[link.location_id] = {};
                        }
                        list[link.university_id + "_" + link.location_id] = {name: uIds[link.university_id], location: ids[link.location_id]};
                    });
                    var keys =  Object.keys(list);
                    keys.forEach((link, index) => {
                        out.push(list[link]);
                    });
                     res.json(out);
                    db.close();
                });
            });
            
        });
    });
});


//Retriveing the single university details and comparision module
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

//To get the list of university in countrywise for comparision module
router.get('/countryUniversity/:id', (req, res, next) => {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("SchoolingDatabase");
        /*Return only the documents with the address "Park Lane 38":*/
        var query = { country_id: { $in: [req.params.id] } };
        dbo.collection("links").find(query).toArray(function (err, eResult) {
            var ids = {};
            eResult.forEach((link, index) => {
                if (!ids[link.university_id]) {
                    ids[link.university_id] = {};
                }
            });
            query = { id: { $in: Object.keys(ids) } };
            dbo.collection("universities").find(query).toArray(function (err, universities) {
                var out = [];
                universities.forEach((uni) => {
                    out.push({ id: uni.id, name: uni.name, logo: uni.logo });
                });
                res.json(out);
                db.close();
            });
        });
    });
});



//Single University Info
router.get('/con/:id', (req, res, next) => {
    Country.find({id:req.params.id} ,function(err, result){
        if (err) return next(err);
        res.json(result);
        console.log(result);
});
});
router.get('/viewAllUniversity', (req, res, next) => {
    var query = University.find();

    if (Number(req.query.page) > 0) {
        query.skip(pageSize2 * (Number(req.query.page) - 1));
    }
    // query.select('name age');
    query.limit(pageSize2);

    query.exec(function (err, universities) {
        res.json(universities);
    })

});
//To get the list of university in countrywise for comparision module
/*router.get('/viewAllUni/:id', (req, res, next) => {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("SchoolingDatabase");
        /*Return only the documents with the address "Park Lane 38":*/
      /*  var query = { country_id: { $in: [req.params.id] } };
        dbo.collection("links").find(query).toArray(function (err, eResult) {
            var ids = {};
            eResult.forEach((link, index) => {
                if (!ids[link.university_id]) {
                    ids[link.university_id] = {};
                }
                if (!ids[link.location_id]) {
                    ids[link.location_id] = {};
                }
            });
            query = { id: { $in: Object.keys(ids) } };
            dbo.collection("universities").find(query).toArray(function (err, universities) {
                var out = [];
                universities.forEach((uni) => {
                    out.push({ id: uni.id, name: uni.name, logo: uni.logo });
                });
                res.json(out);
                db.close();
            });

        });
    });
});*/
/*
router.get('/linking', (req, res, next) => {
    var query = Link.find();

    if (Number(req.query.page) > 0) {
        query.skip(pageSize * (Number(req.query.page) - 1));
    }
    // query.select('name age');
    query.limit(pageSize);

    query.exec(function (err, result) {
        var CountryIds = {};
        var LocationIds = {};
        var UniversityIds = {};
        var CourseIds = {};
        result.forEach(link => {
            if (!CountryIds[link.country_id])
                CountryIds[link.country_id] = '';
            if (!LocationIds[link.location_id])
                LocationIds[link.location_id] = '';
            if (!UniversityIds[link.university_id])
                UniversityIds[link.university_id] = '';
            if (!CourseIds[link.course_id])
                CourseIds[link.course_id] = '';
        });
        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://localhost:27017/";

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("SchoolingDatabase");

            var query = { id: { $in: Object.keys(CountryIds) } };
            dbo.collection("countries").find(query).toArray(function (err, eResult) {
                console.log('Countrsfdsies', eResult);
                eResult.forEach(con => {
                    CountryIds[String(con.id)] = con.name;
                });
                query = { id: { $in: Object.keys(LocationIds) } };
                dbo.collection("locations").find(query).toArray(function (err, eResult) {
                    eResult.forEach(con => {
                        LocationIds[String(con.id)] = con.name;
                    });
                    query = { id: { $in: Object.keys(UniversityIds) } };
                    dbo.collection("universities").find(query).toArray(function (err, eResult) {
                        eResult.forEach(con => {
                            UniversityIds[String(con.id)] = con.name;
                        });
                        query = { id: { $in: Object.keys(CourseIds) } };
                        dbo.collection("courses").find(query).toArray(function (err, eResult) {
                            eResult.forEach(con => {
                                CourseIds[String(con.id)] = con.name;
                            });

                            let out = [];
                            result.forEach((link, index) => {


                                let obj = JSON.parse(JSON.stringify(link));
                                obj.country_name = CountryIds[link.country_id];
                                obj.location_name = LocationIds[link.location_id];
                                obj.university_name = UniversityIds[link.university_id];
                                obj.course_name = CourseIds[link.course_id];
                                out.push(obj);
                            });
                            res.json(out);
                            db.close();

                        });
                    });
                });
            });

        });
    });
});*/
//Costofliving
router.get('/locationByCountry', (req, res, next) => {

    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("SchoolingDatabase");
        /*Return only the documents with the address "Park Lane 38":*/
        // console.log('con_id',req.query.con);
        // console.log('uni_id',req.query.id);
        dbo.collection("locations").find({ id: req.query.locid,country_id: req.query.conid}).toArray(function (err, eResult1) {//passing the id through url (get)
            var out = {};//creating the empty object
            out['loc'] = eResult1[0];//
            
                    res.json(out);
                    db.close();
            
            
        });
    });

});

module.exports = router;