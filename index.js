const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');


const app = express();
var MongoClient = require('mongodb'),MangoClient;
var url ="mongodb://localhost:27017/";


MongoClient.connect(url,function(err,db){
    if(err) throw err;
    var dbo = db.db("basic_crud");
    



//connect to database


// set view file

app.set('views',path.join(__dirname,'views'));

// set view engine

app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({extended:false}));
//set public folder as static folder for static file
app.use('/assets',express.static(__dirname+'/public'));

// route for homepage

app.get('/',(req,res)=>{
    dbo.collection("contacts").find({}).toArray((err,result)=>{
        if(err) throw err;
        res.render('contact_views',{
            results:result
        });
    });
});

app.get('/contactadd',(req,res)=>{
     res.render('contact_a');
});
app.post('/savecontact',(req,res)=>{
    let data={name:req.body.name,contact:req.body.contact};
    dbo.collection("contacts").insertOne(data,(err,res)=>{
        console.log("1 record inserted");
    });
    res.redirect('/');
});

app.get('/contactdelete/:name',function(req,res){
    const name = req.params.name;
    console.log(name);
    var myquery = {name:name};
    dbo.collection("contacts").deleteOne(myquery,(err,obj)=>{
        if(err) throw err;        
});
res.redirect('/');
});

app.get('/contactedit/:name',function(req,res){
    const name = req.params.name;
    console.log(name);

var obj={name:name};

dbo.collection("contacts").findOne(obj,function(err,result){
    if(err) throw err;
    console.log(result);
    res.render('contact_edit',{
        results:result
    });
   
});

});


app.post('/updatecontact',(req,res)=>{
   
    var myquery = {name:req.body.name};
    var newvalues ={ $set : {name:req.body.name, contact:req.body.contact}};
    dbo.collection("contacts").updateOne(myquery,newvalues,function(err,obj){
        if(err) throw err;
        console.log('1 record updated');
    });
        res.redirect('/');
    });
 
});
// server listening

app.listen(8000, ()=>{
    console.log('server is running at port 8000');
})