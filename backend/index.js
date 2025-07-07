
const User = require('./db/user')
const express=require("express")
//import express

const connectDB = require('./db/db.js'); // or the correct path to your db file
connectDB(); // This line actually starts the MongoDB connection



const cors = require('cors');
const app=express()
app.use(cors({ origin: '*' }));
app.use(express.json())



app.get('/user',async(req,res)=>{
    
    const user= await User.find()
    console.log(user ,"this is user data")
    res.send(user)
}
)

app.post('/signup',async(req,res)=>{
    
   let {name,email,password}=req.body
   const newUser= await new User({
    name,
    email,
    password 
   })
   newUser.save()

   res.send(newUser)
}
)

app.post('/login',async(req,res)=>{
    
    let {email,password}=req.body
  
    const user= await User.findOne({email:email})
    if(!user){
     res.status(400).json({message:"nO USERWITH SUCH EMAIL", success:false})
     return
    }
    if(user.password!==password){
        res.status(400).json({message:"INVALID PASSWORD", success:false})
        return
    }
    res.json({message:"lOGIN SUCCESSFUL", success:true, user})
   
 }
 )





app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log('Server running on port ',process.env.PORT);
  });
