const fastify = require('fastify')()

fastify.register(require('fastify-cors'),{
})

const mongoose = require('mongoose');

require("dotenv").config();
const nodemailer = require("nodemailer");
var otpGenerator = require('otp-generator')

mongoose.set('useFindAndModify', false);

try {
    mongoose.connect('mongodb+srv://ProjectManagement:Varsha%402001@cluster0.lxtgk.mongodb.net/ProjectManagement?retryWrites=true&w=majority', { useNewUrlParser: true.valueOf, useUnifiedTopology: true });
    console.log("db connected");
} catch (e) {
    console.error(e);
}

const blog = require('./models/blog')
const blogschema = require('./models/BlogData'); //new schema

fastify.get('/', function (request, reply) {
  reply.send({ hello: 'welcome' })
})

//new schema
fastify.post('/postItems', async (request, reply) => {
    console.log(request.body);
    const {name,mail,blogimg,photo,type,like,dlike,title,des}=request.body;
    const obj = {
       Name:name,
       Email:mail,
       Blogimg:blogimg,
       Photo:photo,
       Type:type,
       Like:like,
       Dislike:dlike,
       Title:title,
       Description:des,
       privateUsers:[]
    }
    console.log(obj);

    try {
        const newBlog = await blogschema.create(obj);
        reply.code(201).send(newBlog);

    } catch (e) {
        reply.code(500).send(e);
    }

    reply.send(items);

})

//new schema
fastify.get('/getItems', async (request, reply) => {
    try {
        const blogdetails = await blogschema.find({});
        reply.code(200).send(blogdetails);
      } catch (e) {
        reply.code(500).send(e);
      }
})

//new schema
fastify.get('/getMyitems', async (request, reply) => {
    console.log(request.query.mail)
    //reply.send(request.body);
     try {
         const blogdetails = await blogschema.find({Email:request.query.mail});
         console.log(blogdetails);
         reply.code(200).send(blogdetails);
       } catch (e) {
         reply.code(500).send(e);
    }
})

fastify.get('/getSingleItems', async (request, reply) => {
  const id = request.query.id
   try {
       const blogdetails = await blogschema.findOne({_id:id});
       // console.log(blogdetails)
       reply.code(200).send(blogdetails);
     } catch (e) {
       reply.code(500).send(e);
  }
   
})

fastify.post('/updateItems', async (request, reply) => {
    try {
        console.log(request.body)
        const obj = {
            privateUsers:request.body.privateUsers,
            Name:request.body.Name,Email:request.body.Email,
            Blogimg:request.body.Blogimg,Photo:request.body.Photo,
            Type:request.body.Type,Like:request.body.Like,Dislike:request.body.Dislike,
            Title:request.body.Title,Description:request.body.Description
         }
         //console.log(obj);
        const blogdetails = await blogschema.findByIdAndUpdate(request.body._id, { $set: obj}, {new:true})
        console.log(blogdetails);
        reply.code(200).send(blogdetails);
      } catch (e) {
        reply.code(500).send(e);
      }
})

fastify.delete('/deleteItems', async (request, reply) => {
    try {
        const blogdetails = await blogschema.findByIdAndRemove(request.query.id, {new:true,useFindAndModify:false})
        reply.code(200).send(blogdetails);
      } catch (e) {
        reply.code(500).send(e);
      }
})

/*var transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "383168fd6956f3",
    pass: "c694954cd85282"
  }
});
*/

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'varsha2020cbe@gmail.com', 
      pass: 'Mouse100*'
    }
})
  
otp = ""
  
function generateOTP(){
    otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    return otp;
}
  
  
fastify.get("/sendmail",function(req,res){
    console.log("emailpart" , req.query.mail);
    let currOTP = generateOTP();
    let mailOptions = {
      from: 'varsha2020cbe@gmail.com',
      to: req.query.mail,
      subject: "OTP for Your requested Blog",
      html: `<h1>Your OTP for BLOGGING is</h1><p>`+currOTP+`</p>`
    };
    transporter.sendMail(mailOptions, function(err,data){
      if(err){
        res.send({success:false});
      }
      else{
        console.log("success");
        res.send({success:true});
      }
    })
})
  
fastify.post('/verify',async function(req,res){
    console.log(otp,req.body.otp);
    console.log(req.body);
    if(otp===req.body.otp){
        try {
            const blogdetails = await blogschema.findById(req.body.blogid);
            let userarray = blogdetails.privateUsers;
            userarray.push(req.body.user);

            try{
                await blogschema.findByIdAndUpdate(req.body.blogid, { $set: {"privateUsers":userarray}}, {new:true})
            }
            catch(e){
                res.send({success:false});
            }
            
          } catch (e) {
            res.send({success:false});
        }
        res.send({success:true});
    }
    else{
      res.send({success:false});
    }
    
})



fastify.listen(process.env.PORT, '0.0.0.0', err => {
    if (err) throw err
    console.log(`server listening on ${fastify.server.address().port}`)
})