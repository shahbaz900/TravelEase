const express=require('express')
const app =express();
const path=require("path");
const hbs = require('hbs')
const port=process.env.PORT || 4000;
const nodemailer=require("nodemailer");
const dotenv=require("dotenv")
const expressAsyncHandler = require('express-async-handler');
dotenv.config();
const Booking = require('./models/booking'); 

require("./db/conn");
const Register=require("./models/registers");

//const otpverify =require("./models/otpverify");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
// //public static path
//const staticpath=path.join(__dirname,"../public");
const publicPath = path.resolve(__dirname, "../public");
app.use(express.static(publicPath))
console.log(path.join(__dirname,"../public"));
// app.use(express.static(__dirname + '../public'));
const dynamicpath=path.join(__dirname,"dynamic/views");
// to to down approach used so that it is displayed
app.set("view engine","hbs");
//app.set('view engine','hbs');
app.set("views",dynamicpath);
//partials
const partialsPath = path.join(__dirname, 'dynamic/partials');
hbs.registerPartials(partialsPath);


//routing
app.get("/",(req,res)=>{
    res.render("index")
})
app.get("/about",(req,res)=>{
    res.render("sign-up")
})

app.get("/booking",(req,res)=>{
    res.render("booking")
})
app.get("/info",(req,res)=>{
    res.render("info")
})
app.get("/sign-up",(req,res)=>{
    res.render("sign-up")
})
//create a new user in db (signup)
app.post("/sign-up", async(req,res)=>{
    try{
        const password=req.body.password;
        const cpassword=req.body.confirmpass;
        if(password===cpassword)
        {
            const registeruser=Register({
                fullname:req.body.fullname,
                email:req.body.email,
                password:req.body.password,
                confirmpassword:req.body.confirmpass
            })
            const registered=await registeruser.save();
            // Show success dialogue box and redirect to next page
            res.send("<script>alert('Now verify your email address!'); window.location='/email_verif';</script>");
        }
        else{
            // Show error dialogue box
            res.send("<script>alert('Passwords does not match'); window.location='/sign-up';</script>");
        }
    }catch(error)
    {
        // Show error dialogue box
        res.send("<script>alert('Error occurred during registration'); window.location='/sign-up';</script>");
    }
})


app.post('/book', async (req, res) => {
    try {
        // Extract data from the request body
        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            checkInDate,
            checkOutDate,
            accommodation,
            numberOfRooms,
            roomType,
            additionalRequests
        } = req.body;

        // Create a new booking document
        const newBooking = new Booking({
            firstName,
            lastName,
            email,
            phoneNumber,
            checkInDate,
            checkOutDate,
            accommodation,
            numberOfRooms,
            roomType,
            additionalRequests
        });

        // Save the booking to the database
        await newBooking.save();

        // Log success message
        // console.log('Booking saved successfully:', newBooking);

        // Show success dialogue box and redirect to next page
        res.send("<script>alert('Booking successful!'); window.location='/';</script>");
    } catch (error) {
        // Log the error
        console.error('Error occurred during booking:', error);

        // Show error dialogue box
        res.send("<script>alert('Error occurred during booking'); window.location='/booking';</script>");
    }
});





// const sendotp=async()=>{
//     try{
//         const otp=`${Math.floor(1000 + Math.random()*9000)}`;

//     }catch(error)
//     {

//     }
// }

let transporter=nodemailer.createTransport({
    // host:process.env.SMTP_HOST,
    // port:process.env.SMTP_PORT,
    // secure:false,
    // auth:{
    //     user:process.env.SMTP_MAIL,
    //     pass:process.env.SMTP_PASSWORD
    // },
    service:"gmail",
    port:465,
    secure:true,
    logger:true,
    debug:true,
    secureConnection:false,
    auth:{
    user:"fsstudio90@gmail.com",
    pass:"sfwi wsvx wclz ovqs"
},
tls:{
rejectUnAuthorized:true
}
});
//const sendwmail
const sendEmail = expressAsyncHandler(async (otpEmail, otp) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: otpEmail,
            subject: "OTP from fsstudio",
            text: `Your OTP is ${otp}`,
        };
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
});

//sig-in checking
app.post("/Sign-in", async(req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
        console.log(`${email} and pass is ${password}` );
        console.log(process.env.SMTP_MAIL);
        console.log(process.env.SMTP_PASSWORD);
        //checking email here
        const useremail=await Register.findOne({email:email});
        if(useremail && useremail.password===password){
            // Show success dialogue box and redirect to next page
            res.send("<script>alert('Login successful!'); window.location='/';</script>");
        }
        else{
            // Show error dialogue box
            res.send("<script>alert('Invalid login details'); window.location='/sign-in';</script>");
        }
    }catch(error)
    {
        // Show error dialogue box
        res.send("<script>alert('Invalid login details'); window.location='/sign-in';</script>");
    }
})

app.get("/locations",(req,res)=>{
    res.render("locations")
})
app.get("/email_verif",(req,res)=>{
    res.render("email_verif")
})
let OTP;
let Email;
app.post("/email_verif", async (req, res) => {
    try {
         Email = req.body.verificationcode;
        OTP = `${Math.floor(1000 + Math.random() * 9000)}`;
        console.log(OTP);
        console.log(Email);
        await sendEmail(Email, OTP);
        res.render("verify_otp")
       // res.status(200).send("Email sent successfully!");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Failed to send email");
    }
});


app.get("/forget_pass",(req,res)=>{
    res.render("forget_pass")
})


app.get("/verify_otp",(req,res)=>{
    res.render("verify_otp")
})
app.post("/verify_otp", async(req,res)=>{
    try
    {
        const enteredotp=req.body.otp;
        if(OTP===enteredotp)
            {
                res.send("<script>alert('Verified Registeration is completed!'); window.location='/Sign-in';</script>");
        
            }
            else{
                res.send("<script>alert('INVALID OTP'); window.location='/verify_otp';</script>");
       
            }
    }catch{
        console.error("Error:", error);
    }
    
    res.render("verify_otp");
})
app.post("/resend_otp", async(req, res) => {
    try {
        // Logic to resend OTP to the email
        // Assuming OTP is resent successfully
       
          
            OTP = `${Math.floor(1000 + Math.random() * 9000)}`;
            // console.log(OTP);
            // console.log(otpEmail);
            await sendEmail(Email, OTP);
            // res.render("verify_otp")
           // res.status(200).send("Email sent successfully!");
        res.send("<script>alert('OTP resent to your email!'); window.location='/verify_otp'</script>");
    } catch(error) {
        console.error("Error:", error);
        res.status(500).send("Failed to resend OTP");
    }
});


app.get("/Sign-in",(req,res)=>{
    res.render("Sign-in")
})
app.get("/package",(req,res)=>{
    res.render("package")
})
app.get("*",(req,res)=>{
    res.send("404  is  Error Page :(  Something went wrong")
})



app.listen(port,()=>{
    console.log(`listening to port at ${port}`)
})
