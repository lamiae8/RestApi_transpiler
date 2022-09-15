const {nanoid}= require('nanoid');
const express = require('express');
var FormData = require('form-data');
const path = require('path');
var fs = require("fs");
const app =express();
const cors =require('cors');
var exec = require('child_process').exec;
app.use(cors({
    origin: 'http://localhost:3000',
    credentials:true,
}));
const Port =8080;

app.use(express.json())

app.listen(
    Port,
    () =>console.log(`restApi on http://localhost:${Port}`)
)
app.use(express.static(path.join (__dirname + '/public')))

app.get('/*',(req,res) => {
    res.sendFile(path.join(__dirname,'/public', 'index.html'))
})


    const multer = require('multer');

    const storage = multer.diskStorage({
        destination: (req, file, callBack) => {
            callBack(null, 'uploads/')
        },
       
        filename: (req, file, callBack) => {
           callBack(null, `${file.originalname}`)
        }
      })
    let upload = multer({ storage : storage})
    
    
    app.post('/uploadFileAPI', upload.single('file'), (req, res, next) => {
        const file = req.file;
        file.filename='input_'+nanoid()+'.alfa';
        //console.log(file.filename.name);
        if (!file) {
            const error = new Error('No File')
            error.httpStatusCode = 400
            return next(error)
        }

            // AlfaToSol command 
       
        const nameinput =file.originalname;
        const nameoutput=nameinput.slice(0,-5);
        exec(`export LD_LIBRARY_PATH=./lib && LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/libantlr4-runtime.so.4.7.1/ ./AlfaToSol ./uploads/${nameinput} ./outputs/OutputOf_${nameoutput}.sol`,
            function (error, stdout, stderr) {
                console.log('stdout: ' + stdout );
                console.log('stderr: ' + stderr );
                if (error !== null) {
                     console.log('exec error: ' + error);
                }
            });
        var options = {
            root: path.join('./outputs')
        };
         
        var fileName = `OutputOf_${nameoutput}.sol`;
        res.sendFile(fileName, options, function (err) {
            if (err) {
                next(err);
            } else {
                console.log('Sent:', fileName);
                next();
            }
        });

    })
    
    
    app.post('/transpileText',(req,res,next) =>{

       const Text =req.body.text;
        console.log(Text);
const i= nanoid();
var writeStream = fs.createWriteStream(`uploads/inputText_${i}.alfa`);
writeStream.write(Text);

writeStream.end();


// convert the file writeStream to solidity 
exec(`export LD_LIBRARY_PATH=./lib && LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/libantlr4-runtime.so.4.7.1/ ./AlfaToSol ./uploads/inputText_${i}.alfa ./outputs/OutputOf_inputText_${i}.sol`,
function (error, stdout, stderr) {
    console.log('stdout: ' + stdout );
    console.log('stderr: ' + stderr );
    if (error !== null) {
         console.log('exec error: ' + error);
    } 
    var options = {
            root: path.join('./outputs')
        };
        var fileGen=`OutputOf_inputText_${i}.sol`;
        res.sendFile(fileGen, options,function (err) {
            if (err) {
                next(err);
            } else {
                console.log('Sent:'+ fileGen);
                next();
            }
        });
});
       
        
    });