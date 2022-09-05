
const express=require('express')
const path=require('path')
const hbs=require('hbs')
const app=express()
require('../src/db/connect')
const jwt=require('jsonwebtoken')
const userData=require('../src/models/user')
const bcrypt=require('bcrypt')
const auth=require('../src/middlewares/auth')
const cookieparser=require('cookie-parser')
const staticPath=path.join(__dirname,'../public')
const partialpath=path.join(__dirname,'../templates/partials')
app.use(express.static(staticPath))
app.set('views','../templates/views')
app.set('view engine','hbs')

hbs.registerPartials(partialpath)

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieparser())

app.get('/',(req,res)=>{
    res.render('index')
})
app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/signup',(req,res)=>{
    res.render('signup')
})
app.get('/logout',auth,async (req,res)=>{
    res.clearCookie('jwt')
    await req.user.save()
    res.redirect('/login')
})
app.get('/resume',auth,(req,res)=>{
    res.render('resume')
})

app.post('/signup',async(req,res)=>{
    if(req.body.password===req.body.confirmpassword){
        const newUserData=new userData({
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            confirmpassword:req.body.confirmpassword
        })
        const token= await newUserData.getToken()
        res.cookie('jwt',token),{
            expires:new Date(Date.now()+5000),
            httpOnly:true
        }
        const result=await newUserData.save()
        res.send(result)
    }else{
        res.status(400).send('invalid credintials')
    }

})
app.post('/login',async(req,res)=>{
    try{
        const email=req.body.email
        const password=req.body.password
        const loginuser=new userData(req.body)
        const user=await userData.findOne({email:email})
        const isMatch=await bcrypt.compare(password,user.password)
        const token=await loginuser.getToken()
        res.cookie('jwt',token),{
            expires:new Date(Date.now()+5000),
            httpOnly:true
        }
        if(isMatch){
            return res.status(200).redirect('/')
        }
        else{
            res.send(isMatch)
        }   
    }
    catch(err){
        res.send(`error:${err}`)
    }

})


app.listen(8000,'127.0.0.1',()=>{
    console.log('hey server is running')
})