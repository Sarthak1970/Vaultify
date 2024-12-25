import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import env from "dotenv";

const app = express();
const port = 3000;
const saltrounds = 10;
env.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    maxage:1000*60*60*24,
  }
}));

app.use(passport.initialize());
app.use(passport.session());


const db=new pg.Client({
  user:process.env.USER,
  host:process.env.HOST,
  database:process.env.DATABASE,
  password:process.env.PASSWORD,
  port:process.env.PORT,
});
db.connect(err=>{
  if(err){
    console.log("Error connecting to database");
  }
  else{
    console.log("Connected to database");
  }
})

app.get("/auth/google",
  passport.authenticate("google",
    {scope:["profile","email"], 
  })
);

app.get("/auth/google/secrets",
  passport.authenticate("google",{
    failureRedirect:"/login?error=You Haven't Signed Up With Google Yet!",
  }),
  (req,res)=>{
    res.redirect("/secrets");
  }
)


app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  const error=req.query.error;
  res.render("login.ejs",{error});
});

app.get("/register", (req, res) => {
  res.render("register.ejs",{error:null});
});

app.get("/secrets",async (req,res)=>{
  console.log(req.user);
  if(req.isAuthenticated()){
    try{
      const result= await db.query("SELECT secret FROM users WHERE email=$1",
        [req.user.email]
      );

      const secret = result.rows.length > 0 ? result.rows[0].secret : null;
      if(secret){
        res.render("secrets.ejs",{secret:secret});
        console.log(secret);
      }
      else{
        res.render("secrets.ejs",{secret: "You haven't submitted a secret yet!"});
      }
    }
    catch(err){
      console.log(err);
    }
 }
  else{
    res.redirect("/login");
  }
})

app.get("/logout",(req,res)=>{
  req.logout((err)=>{
    if(err){
      console.log(err);
      return res.redirect("/secrets");
    }
    req.session.destroy((err)=>{
      if(err){
        console.log(err);
      }
      res.redirect("/");
    })
  })
})

app.get("/submit",(req,res)=>{
  if(req.isAuthenticated()){
    res.render("submit.ejs");
  }
  else{
    res.redirect("/login");
  }
})

app.post("/submit",async (req,res)=>{
  if(!req.isAuthenticated()){
    res.redirect("/login");
    return;
  }
  const submittedsecret=req.body.secret;
  console.log(req.user);
  try{
    const result=await db.query("UPDATE users SET secret=$1 WHERE email =$2",[
      submittedsecret,
      req.user.email,
    ]);
    console.log("Update Result",res);
    res.redirect("/secrets");
  }
  catch(err){
    console.log(err);
    res.redirect("/submit");
  }
 }
);

app.post("/register", async (req, res) => {
  const email=req.body.username;
  const password=req.body.password;

  const check=await db.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if(check.rows.length>0){
    res.render("register.ejs",{error:"User already exists"});
    return;
  }
  if(email.length==0 || password.length==0){
    res.render("register.ejs",{error:"Invalid credentials"});
    return;
  }
  bcrypt.hash(password,saltrounds,async (err,hash)=>{
    if(err){
      res.render("register.ejs",{error:"An error occured"});
      return;
    }
    const result=await db.query(
      "INSERT INTO users (email,password) VALUES ($1,$2) RETURNING *",
      [email,hash]
    );
    const user=result.rows[0];
    console.log(user);
    req.login(user,(err)=>{
      if(err){
        res.render("register.ejs",{error:"An error occured"});
        return;
      }
      res.redirect("/secrets");
    })
  });  
});


app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.render("login.ejs", { error: "An error occurred. Please try again." });
    }
    if (!user) {
      return res.render("login.ejs", { error: info.message || "Login failed." });
    }
    req.login(user, (err) => {
      if (err) {
        return res.render("login.ejs", { error: "An error occurred during login." });
      }
      return res.redirect("/secrets");
    });
  })(req, res, next);
});

passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
  try {
    const result = await db.query(
      "SELECT * FROM users WHERE email=$1",
      [username]
    );

    if (result.rows.length === 0) {
      return cb(null, false, { message: "User not found" });
    }

    const user = result.rows[0];
    const storedhashpassword = user.password;

    bcrypt.compare(password, storedhashpassword, (err, isMatch) => {
      if (err) {
        return cb(err);
      } else {
        if (isMatch) {
          return cb(null, user); // Successful authentication
        } else {
          return cb(null, false, { message: "Invalid password" });
        }
      }
    });
  } catch (err) {
    return cb(err);
  }
}));

passport.use(
  "google",
   new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
  },
  async function (accessToken, refreshToken, profile, cb){
    console.log(profile);

    try{
      if (!profile.emails || profile.emails.length === 0) {
        return cb(null, false, { message: "No email associated with Google account." });
      }

      const result=await db.query("SELECT * FROM users WHERE email=$1",[profile.emails[0].value]);
      if(result.rowCount===0){
        const newUser=await db.query("INSERT INTO users (email,password) VALUES ($1,$2) RETURNING *",[profile.emails[0].value,"google"]);
        cb(null,newUser.rows[0]);
      }
      else{
        cb(null,result.rows[0]);
      }
    }
    catch(err){
      cb(err);
    }
  }
)
);

passport.serializeUser((user,cb)=>{
  cb(null,user.email);
});

passport.deserializeUser((email, cb) => {
  db.query("SELECT * FROM users WHERE email = $1", [email], (err, result) => {
    if (err) {
      return cb(err);
    }
    return cb(null, result.rows[0]); 
  });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
