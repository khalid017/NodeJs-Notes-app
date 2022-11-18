const express = require("express")
const app = express()
const fs = require("fs")
const session = require("express-session")

app.use(express.json())
app.use(express.urlencoded({extended:true})) // form data get krne k liye
app.use(express.static("public"))

app.use(session({
  secret: 'keyboard cat', // key for encrypt decrypt
    resave: false,
    saveUninitialized: true,
    cookie: {}
}))
const uModel = require("./database/models/users")
app.route("/").get((req,res)=>{
  if (req.session.isLoggedIn)
  {
      res.render("home", {
      username: req.session.username,
      });
  }
  else
  {
      res.redirect("/login")
  }
})
app.route("/login").get(login).post(loginUser)
app.route("/signup").get(signup).post(signupUser)
app.get("/logout",(req,res)=>{
  req.session.destroy()
  res.redirect("/login")
})

  //for ejs
  app.set("view engine","ejs"); // for using ejs
  app.set("views","./views");
  
  function login(req,res)
  {
      if (req.session.isLoggedIn)
      {
          res.redirect("/")
      }
      else
      {
          res.render("login",{err:""})
      }
  }
  
  function loginUser(req,res)
{
    getUser((err,data)=>{
        const user = data.filter(function(user)
        {
            if( user.email === req.body.email && user.password === req.body.password )
            {
              req.session.username=user.name
              req.session.uId = user._id
              
                return true
            }
        })
        if(user.length)
        {
          // console.log(user[0].isVerified)
            req.session.userData = req.body
            req.session.isLoggedIn = true
          
              res.redirect("/") //redirect to home if login success
              return
            
        }
        else
        {
          res.render("login",{err:"invalid username or password"}); //redirect to login if login fails
        }
    })
}

function signup(req,res)
{
  res.render("signup",{err:""})
}
  
  function signupUser(req,res)
  {
      saveUser(req.body,(err)=>{
          if(err){
              res.render("signup",{err:"user already exists"})
          }
          else{
              res.redirect("/login")
          }
      })
  }
  function saveUser(user,callback)//write
  {
    let flag = true // for checking already exisiting user.
    getUser((err,data)=>{
      data.forEach((u)=>{
          if(u.name === user.name)
          {
              flag = false
              callback(true)
          }
      })
      if(flag)
      {
        uModel.create(user)
        .then(()=>{
          callback(null)
        })
        .catch((err)=>{
          callback(err)
        })
  
      }
     
    })
  }
  function getUser(callback)//read
  {
    uModel.find({}).then((users)=>{
      callback(null,users)
    })
    .catch((err)=>{
      callback(err,null)
    })
  }

app.route("/").get((req,res)=>{
  res.render("home"
  );
 
})
const db = require('./database/init')
db() //db connected
const notesModel = require('./database/models/notes')

app.route("/notes").post(postNotes).get(getNotes)//form me jo naam file ka vo name yha
app.delete("/note/:id",deleteNote) //todo/ke baad jo bhi likha hga uska id: krke object ban jayega. req.params se.
app.put("/note/:id",updateNote)

app.listen(3000,()=>{
    console.log("server")
})


function postNotes(req,res)
{

 if(req.body.note==="" )
  {
    res.redirect("/")
    return
  }
  else{
    const note = {
      uId:req.session.uId,
      note : req.body.note
    }
    fSaveNote(note,(err)=>{
      res.redirect("/")
    })
  }
}
async function getNotes(req,res)
{
  uid = req.session.uId
  items = await notesModel.find({uId:uid})
  res.json(items)
//   fGetNote((err,note)=>{
//     res.json(note)
// })  
}
//deleting todos
async function deleteNote(req,res)
{
  const id = req.params.id //returns obj with id:value
 const deletee = await notesModel.findOneAndRemove( {_id: id})

}
// marking todos
async function updateNote(req,res)
{
  const id = req.params.id
  const newNote = req.body
  const result = await notesModel.findByIdAndUpdate({_id:id},{"note":newNote.newNote})
  res.end()
}

//saving todos to db
function fSaveNote(note,callback)
{
  notesModel.create(note)
  .then(()=>{
    callback(null)
  })
  .catch(()=>{
    callback("error")
  })
   
}
// getting todo from db
function fGetNote(callback)
{
  notesModel.find({})
  .then((notes)=>{
    callback(null,notes)
  })
  .catch((err)=>{
    callback("error",null)
  })
}