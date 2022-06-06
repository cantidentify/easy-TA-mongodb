const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const fs = require('fs');
const path = require('path');

var userPath = path.join(__dirname, '..','..', 'data','users.json');

// @route   POST api/users
// @desc    Check credential user and password
// @access  Public
router.post('/', [
    check("id", "id is required").not().isEmpty(),
    check("id", "Id must be 10 characters").isLength({ min: 10 , max:10 }),
    check("password", "password is required").not().isEmpty()
],async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    let rawdata = fs.readFileSync(userPath);
    let userData = JSON.parse(rawdata);

    var foundItem = userData.data.find(d => d.id == req.body.id );
    if (!foundItem){
        return res.status(400).json({errors: [{msg : "Invalid credential"}]})
    }

    const isMatch = await bcrypt.compare(req.body.password, foundItem.password);
    if(!isMatch){
        return res.status(400).json({errors: [{msg : "Invalid credential"}]})
    }
    res.send(foundItem)
})

// @route   POST api/users/signUp
// @desc    Create new user by checking exist id, name and match two password
// @access  Public
router.post('/signUp',[
    check("id", "id is required").not().isEmpty(),
    check("id", "Id must be 10 characters").isLength({ min: 10 , max:10 }),
    check("password", "password is required").not().isEmpty(),
    check("password2", "password is required").not().isEmpty(),
    check("name", "name is required").not().isEmpty()
],async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    
    // Get user by id 
    let rawdata = fs.readFileSync(userPath);
    let userData = JSON.parse(rawdata);

    var foundItem = userData.data.find(d => d.id == req.body.id);
    if (foundItem){
        return res.status(400).json({errors: [{msg : "Already have this user ID"}]})
    }

    if(!req.body.password == req.body.password2){
        return res.status(400).json({errors: [{msg : "Password is not matching"}]})
    }

    const salt = await bcrypt.genSalt(10);
    const encryptPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = {
        id : req.body.id,
        password : encryptPassword,
        name: "Atip",
        company : "",
        position : ""
    }

    let newFile = {...userData}

    newFile.data.push(newUser)
    let data = JSON.stringify(newFile);
    fs.writeFileSync(userPath, data);

    res.send(newUser)
})

module.exports = router;