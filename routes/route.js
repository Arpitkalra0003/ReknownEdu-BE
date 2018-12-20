const express = require('express');//value of variable not gone change
const router = express.Router();
const Country = require('../models/countryMaster');
const countryApi = require('../models/countryApi');
const University = require('../models/university');


//countryApi post
router.post('/countrylist', function (req, res, next) {
  let newCountryApi = new countryApi({
    northamerica: {
      na_continentname: req.body.na_continentname,
      ca: req.body.ca,
      mx: req.body.mx,
      us: req.body.us
    },
    southamerica: {
      sa_continentname: req.body.sa_continentname,
      ar: req.body.ar,
      aw: req.body.aw,
      bb: req.body.bb,
      bz: req.body.bz,
      cl: req.body.cl,
      co: req.body.co,
      cu: req.body.cu,
      do: req.body.do,
      jm: req.body.jm,
      sr: req.body.sr,
      tt: req.body.tt,
      uy: req.body.uy,
      vi: req.body.vi
    },
    europe: {
      eu_continentname: req.body.eu_continentname,
      at: req.body.at,
      by: req.body.by,
      cy: req.body.cy,
      dk: req.body.dk,
      fi: req.body.fi,
      fr: req.body.fr,
      de: req.body.de,
      is: req.body.is,
      ie: req.body.ie,
      it: req.body.it,
      lv: req.body.lv,
      lt: req.body.lt,
      lu: req.body.lu,
      nl: req.body.nl,
      no: req.body.no,
      pl: req.body.pl,
      pt: req.body.pt,
      ro: req.body.ro,
      es: req.body.es,
      se: req.body.se,
      ch: req.body.ch,
      gb: req.body.gb
    },
    asia: {
      as_continentname: req.body.as_continentname,
      bd: req.body.bd,
      in: req.body.in,
      jo: req.body.jo,
      lb: req.body.lb,
      mo: req.body.mo,
      my: req.body.my,
      mn: req.body.mn,
      mm: req.body.mm,
      np: req.body.np,
      om: req.body.om,
      pk: req.body.pk,
      ph: req.body.ph,
      ps: req.body.ps,
      sa: req.body.sa,
      sg: req.body.sg,
      lk: req.body.lk,
      th: req.body.th,
      tw: req.body.tw,
      vn: req.body.vn,
      ye: req.body.ye
    },
    africa: {
      af_continentname: req.body.af_continentname,
      bw: req.body.bw,
      ke: req.body.ke,
      ly: req.body.ly,
      ma: req.body.ma,
      so: req.body.so,
      za: req.body.za,
      sd: req.body.sd,
      zm: req.body.zm,
      zw: req.body.zw
    },
    Oceania: {
      oc_continentname: req.body.oc_continentname,
      au: req.body.au,
      nz: req.body.nz
    }
  });
  newCountryApi.save((err, countryApi) => {
    if (err) {
      res.json({ msg: 'Failded to add Countrylist' });
    } else {
      res.json({ msg: 'successfully add Countrylist' });
    }
  });
});

//get countrylist api
router.get('/countrylistApi',function(req,res,next){
  countryApi.find(function(err,result){
   if(err)
   return (err);
   else
   res.json(result);
  });
});
//visainfo,averagesalary,scholarship countryinfo
router.get('/countryinfo/:id', function (req, res) {
  Country.find({ id: req.params.id }, function (err, countries) {
    if (countries) {
      if (countries < 70) {
        res.json({ success: false, message: 'country not found' });
      }
      else {
        res.json(countries);
      }
    } else {
      res.json(err);
    }
  });
});


//niversity sampl post for query
router.post('/uni', function (req, res, next) {
  let newUniversity = new University({
    id: req.body.id,
    countryname: req.body.countryname,
    locationname: req.body.locationname,
    universityname: req.body.universityname
  });
  newUniversity.save((err, University) => {
    if (err) {
      res.json({ msg: 'Failded to add University' });
    } else {
      res.json({ msg: 'successfully add University details' });
    }
  });
});

router.get('/universityde', function (req, res, next) {
  University.find(function (err, Universities) {
    if (err) {
      return (err);
    }
    else {
      res.json(Universities);
    }
  });
});

router.put('/finduni', (req, res, next) => {
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("schoolingcouncil_developeronrent");
    var query = { countryname: req.body.countryname, locationname: req.body.locationname };
    dbo.collection("universities").find(query).toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      res.json(result);
      db.close();
    });
  });
});

module.exports = router;
