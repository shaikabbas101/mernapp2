const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

require('../db/conn');
const User = require('../model/userSchema');

// router.get('/',(req,res)=>{
//     res.send('Hello world from home server route')
// });

// asysc await

router.post('/register',async(req,res)=>{
    const {name,username,phone,password,Cpassword} = req.body
    if(!name || !username || !phone || !password || !Cpassword){
        return res.status(422).json({Error:"plz fill the fields"})
    }
    try{
        const userExist = await User.findOne({username:username})
        if(userExist){
            return res.status(422).json({Error:"Username already Exist"})
        }else if(password != Cpassword){
            return res.status(422).json({Error:"password are not matching"});
        }else{
            const user = new User({name,username,phone,password,Cpassword})
            await user.save();
            res.status(201).json({message:"Sucessful Registered"})
        }
       
    }catch(err){
        console.log(err);
    }
})


router.post('/signin',async(req,res)=>{
    try{
        let token;
        const {username,password}= req.body;
        if(!username || !password){
            return res.status(400).json({error:"**Plz fill the data**"})
        }
        const userLogin = await User.findOne({username:username});
        if(userLogin){
        const isPassMatch = await bcrypt.compare(password,userLogin.password)
        
        if(!isPassMatch){
            res.status(400).json({error:"**Invalid Credentials**"})
        }else{
            token = await userLogin.generateAuthToken();
            // console.log(token)
            res.json({message:"user signin succesful",jwt_token:token})
        }
    }else{
        res.status(400).json({error:"**Invalid Credentials**"})
    }
        
    }catch(err){
        console.log(err)
    }
})

module.exports = router;