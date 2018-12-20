var mongoose = require('mongoose');

const CountryApiSchema = mongoose.Schema({
    northamerica: [{
        na_continentname: { type: String },
        ca: { type: String },
        mx: { type: String },
        us: { type: String }
    }],
    southamerica: [{
        sa_continentname: { type: String },
        ar: { type: String },
        aw: { type: String },
        bb: { type: String },
        bz: { type: String },
        cl: { type: String },
        co: { type: String },
        cu: { type: String },
        do: { type: String },
        jm: { type: String },
        sr: { type: String },
        tt: { type: String },
        uy: { type: String },
        vi: { type: String }
    }],
    europe: [{
        eu_continentname: { type: String },
        at: { type: String },
        by: { type: String },
        cy: { type: String },
        dk: { type: String },
        fi: { type: String },
        fr: { type: String },
        de: { type: String },
        is: { type: String },
        ie: { type: String },
        it: { type: String },
        lv: { type: String },
        lt: { type: String },
        lu: { type: String },
        nl: { type: String },
        no: { type: String },
        pl: { type: String },
        pt: { type: String },
        ro: { type: String },
        es: { type: String },
        se: { type: String },
        ch: { type: String },
        gb: { type: String }
    }],
    asia: [{
        as_continentname: { type: String },
        bd: { type: String },
        in: { type: String },
        jo: { type: String },
        lb: { type: String },
        mo: { type: String },
        my: { type: String },
        mn: { type: String },
        mm: { type: String },
        np: { type: String },
        om: { type: String },
        pk: { type: String },
        ph: { type: String },
        ps: { type: String },
        sa: { type: String },
        sg: { type: String },
        lk: { type: String },
        th: { type: String },
        tw: { type: String },
        vn: { type: String },
        ye: { type: String }
    }],
    africa: [{
        af_continentname: { type: String },
        bw: { type: String },
        ke: { type: String },
        ly: { type: String },
        ma: { type: String },
        so: { type: String },
        za: { type: String },
        sd: { type: String },
        zm: { type: String },
        zw: { type: String }
    }],
    Oceania: [{
        oc_continentname: { type: String },
        au: { type: String },
        nz: { type: String }
    }]
});

const CountryApi = module.exports = mongoose.model('CountryApi', CountryApiSchema);