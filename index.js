const {nanoid}= require('nanoid');
const express = require('express');
var FormData = require('form-data');
const path = require('path');
const app =express();
const cors =require('cors');
app.use(cors({
    origin: 'http://localhost:3000',
    credentials:true,
}));
const Port =8080;

app.use(express.json())
app.listen(
    Port,
    () =>console.log(`hey http://localhost:${Port}`)
)
app.get('/get',(req,res)=>{
    res.status(200).send({
        msg:'hey limy'
    })
    });

app.post('/post',(req,res)=>{
    const {id} =req.body;
    console.log(id);
    res.send({
       msg: `${id}`
    });
    });


    const multer = require('multer');

    const storage = multer.diskStorage({
        destination: (req, file, callBack) => {
            callBack(null, 'uploads')
        },
       
        filename: (req, file, callBack) => {
           callBack(null, `${file.originalname}`+'_'+nanoid()+'.alfa')
        }
      })
    let upload = multer({ dest: 'uploads/' })
    
    
    app.post('/uploadFileAPI', upload.single('file'), (req, res, next) => {
        const file = req.file;
        file.filename='input_'+nanoid()+'.alfa';
        console.log(file.filename);
        if (!file) {
            const error = new Error('No File')
            error.httpStatusCode = 400
            return next(error)
        }

        /*
        :
        :
        :
        :
        :
        HNA CODE DYAL CONVERTION ALFATOSOL
        :
        :
        libray......   ./AlfaToSol input.alfa ouput.sol
        :
        :
        :

        */
        var options = {
            root: path.join('./outputs')
        };
         
        var fileName = 'output.sol';
        res.sendFile(fileName, options, function (err) {
            if (err) {
                next(err);
            } else {
                console.log('Sent:', fileName);
                next();
            }
        });

    })
    