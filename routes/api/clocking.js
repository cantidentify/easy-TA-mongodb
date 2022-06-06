const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const fs = require('fs');
const path = require('path');

var clockingPath = path.join(__dirname, '..','..', 'data','clockings.json');

// @route   POST api/clocking
// @desc    Clocking in / out
// @access  Public
router.post('/', [
    check("id", "id is required").not().isEmpty(),
    check("id", "Id must be 10 characters").isLength({ min: 10 , max:10 }),
    check("date", "date is required").not().isEmpty(),
    check("time", "time is required").not().isEmpty(),
    check("type", "type is required").not().isEmpty(),
    check("status", "status is required").not().isEmpty()
],(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    let rawdata = fs.readFileSync(clockingPath);
    let clockData = JSON.parse(rawdata);

    let dateYMD = getDateYMD()
    var foundItem = clockData.data.find(d => d.id == req.body.id && d.date == dateYMD && d.type ==  req.body.type);
    if(foundItem){
        return res.status(400).json({ "msg" : 'Already clocked-out. Thank you for today work.' })
    }

    let clockingData = {
        "id" : req.body.id,
        "date" : req.body.date,
        "time" : req.body.time,
        "type" : req.body.type,
        "status" : req.body.status
    }
    let newFile = {...clockData}
    newFile.data.unshift(clockingData)

    let data = JSON.stringify(newFile);
    fs.writeFileSync(clockingPath, data);

    res.send(clockingData)
})

// @route   GET api/clocking/clockList
// @desc    Get clocking list
// @access  Public
router.get('/clockList', (req,res) => {
    let rawdata = fs.readFileSync(clockingPath);
    let clockData = JSON.parse(rawdata);
    res.send(clockData)
})

// @route   POST api/clocking/userClocking
// @desc    Get user clocking by id and date
// @access  Public
router.post('/userClocking', [
    check("id", "id is required").not().isEmpty()
],(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    let rawdata = fs.readFileSync(clockingPath);
    let clockData = JSON.parse(rawdata);

    var foundItem = clockData.data.filter(d => d.id == req.body.id );
    if(foundItem.length > 0){
        if(req.body.date){
            foundItem = foundItem.filter(d => d.date == req.body.date)
        }
    }
    res.send(foundItem)
})

function getDateYMD(){
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let dateYMD = year + "-" + month + "-" + date
    return dateYMD;
}



module.exports = router;