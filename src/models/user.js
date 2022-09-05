
const async = require('hbs/lib/async')
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const userSchema=new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    confirmpassword:String,
    token:String
})

userSchema.pre('save',async function(){
    const hash=await bcrypt.hash(this.password,10)
    this.password=hash
    console.log(hash)
})

userSchema.methods.getToken=async function(){
    const tokendata=await jwt.sign({_id:this._id},'secret')
    this.token=tokendata
    await this.save()
    return tokendata
}

const userData=mongoose.model('userData',userSchema)

module.exports=userData