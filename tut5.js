// Week 7 Lab
let express = require('express');
let app = express();
//let mongodb=require('mongodb')
//const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017/week7';
//let db=null;
//let col=null

let mongoose=require('mongoose')
// Import the models here since we exported them in the schema file.
let Developer=require('./models/Developer')
let Task =require('./models/Task')

// open db connection
mongoose.connect("mongodb://localhost:27017/Week7Lab", function(err){
    if(err){
        console.log(err);
        throw err;
    }else{
        console.log("Connected successfully!");
    };
});


//let bodyParser = require('body-parser');

// Get the static image and css files.
let viewsPath = __dirname + "/views/";
app.use(express.static('views/image'))
app.use(express.static('views/css'));

app.engine("html", require('ejs').renderFile);
app.set("view engine", "html");

app.use(express.urlencoded({extended: false}));


// Main page
app.get('/', function(req,res){
    res.sendFile(viewsPath + "index.html");
});

// Add developer page
app.get('/adddeveloper',function(req,res){
    res.sendFile(viewsPath+"adddeveloper.html")
})

// Add developer to DB
app.post('/appendDeveloper',function(req,res){
    let developer = new Developer({
        name: {
            firstName: req.body.firstname,
            lastName: req.body.lastname
        },
        Level: req.body.level,
        Address:{
            State: req.body.state,
            Suburb: req.body.suburb,
            Street: req.body.street,
            Unit: req.body.unit
        }
})
    developer.save(function (err) {
        if (err) throw err;
        console.log('developer1 successfully Added to DB');
    });

    res.redirect('/showDeveloper')
})

// Add task page
app.get('/addtask', function(req,res){
    res.sendFile(__dirname+"/views/addtask.html");
});

// Add task to DB
app.post('/appendTask', function(req,res){

    let task = new Task({
        taskName: req.body.taskname,
        assignto: mongoose.Types.ObjectId(req.body.assignto),
        dueDate: req.body.duedate,
        status: req.body.status,
        description: req.body.description
    })
    
    task.save(function (err) {
        if (err) throw err;
        console.log('developer1 successfully Added to DB');
    });

    res.redirect('/listAll')
    
});

// Display all developers
app.get('/showDeveloper',function(req,res){
    Developer.find().exec(function(err,data){
        res.render(__dirname+"/views/showDeveloper.html",{task:data})
    })
    //res.render(__dirname+"/views/showDeveloper.html",{task:Developer})

//  Display all tasks
})
app.get('/listAll', function(req,res){

    Task.find().exec(function(err,data){
        res.render(__dirname+"/views/listtask.html",{task:data})
    })
})

// Delete task by ID
app.get('/deletetaskid',function(req,res){
    res.sendFile(viewsPath+'deletetask.html')
})

app.post('/deletetask',function(req,res){
    let id = req.body.id;
    let filter ={_id: mongoose.Types.ObjectId(id)};
    Task.deleteOne(filter,function(err,obj){
        console.log(obj.result)
    })
    res.redirect('/listAll')
})

// Delete all completed tasks
app.get('/deleteCompleted',function(req,res){
    let filter = {status:'Completed'}
    Task.deleteMany(filter,function(err,obj){
        console.log(obj.result)
    })
    res.redirect('/listAll')
})

// Update task by ID
app.get('/updatetask',function(req,res){
    res.sendFile(viewsPath+'updatetask.html')  
})

app.post('/updatestatus',function(req,res){
    let id = req.body.id;
    let filter ={_id: mongoose.Types.ObjectId(id)};
    let set={$set: { status : req.body.status}};
    Task.updateOne(filter,set,function(err,obj){
        console.log(obj.result)
    })
    res.redirect('/listAll')
})

// Extra lab task
app.get('/labTask',function(req,res){
    let filter = {status:'Completed'}
    Task.find(filter).sort({taskName:-1}).limit(3).exec(function(err,data){
        res.render(__dirname+"/views/listtask.html",{task:data})
    })
})


app.listen(8080);