const mongoose=require('mongoose')

mongoose.connect('mongodb://localhost:27017/portfoliouser')
.then(()=>{
    console.log('connection established')
}).catch((err)=>{
    console.log(`not connect error:${err}`)
})