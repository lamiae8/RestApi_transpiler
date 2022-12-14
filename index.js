const { nanoid } = require('nanoid');
const express = require('express');
var FormData = require('form-data');
const path = require('path');
var fs = require("fs");
const app = express();
const cors = require('cors');
var exec = require('child_process').exec;
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
const PORT = process.env.PORT;
//const PORT = 8080;

app.use(express.json())

app.listen(
    PORT,
    () => console.log(`restApi on http://localhost:${PORT}`)
)
app.use(express.static(path.join(__dirname + '/public')))

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'index.html'))
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
let upload = multer({ storage: storage })


app.post('/uploadFileAPI', upload.single('file'), (req, res, next) => {
    const file = req.file;
    file.filename = 'input_' + nanoid() + '.alfa';
    //console.log(file.filename.name);
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        return next(error)
    }

    // AlfaToSol command 

    const nameinput = file.originalname;
    const nameoutput = nameinput.slice(0, -5);
    exec(`export LD_LIBRARY_PATH=./lib && LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/libantlr4-runtime.so.4.7.1/ ./AlfaToSol ./uploads/${nameinput} ./outputs/OutputOf_${nameoutput}.sol`,
        function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
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


app.post('/transpileText', (req, res, next) => {

    const Text = req.body.text;
    console.log(Text);
    const i = nanoid();
    var writeStream = fs.createWriteStream(`uploads/inputText_${i}.alfa`);
    writeStream.write(Text);

    writeStream.end();


    // convert the file writeStream to solidity 
    exec(`export LD_LIBRARY_PATH=./lib && LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/libantlr4-runtime.so.4.7.1/ ./AlfaToSol ./uploads/inputText_${i}.alfa ./outputs/OutputOf_inputText_${i}.sol`,
        function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
            var options = {
                root: path.join('./outputs')
            };
            var fileGen = `OutputOf_inputText_${i}.sol`;
            res.sendFile(fileGen, options, function (err) {
                if (err) {
                    next(err);
                } else {
                    console.log('Sent:' + fileGen);
                    next();
                }
            });
        });


 }






    );
    
    
    
    /*************    deployement contracts    ************/
    app.post('/uploadContract', upload.single('file'), (req, res, next) => {
        const file = req.file;
        file.filename = 'Contract_' + nanoid() + '.sol';
        console.log(file);
        if (!file) {
            const error = new Error('No File')
            error.httpStatusCode = 400
            return next(error)
        }
         var options = {
            root: path.join('./DeployContracts/')
        }; 
        
    //put it in hardhat->contracts and compile it and return the abi + address
   /* fs.writeFile('./hardhat-project/contracts/HelloWorld.sol' ,  file, function(err,data){
        if (err){
          return console.log(err)
        }
          console.log(data)
      });   */
     // exec(`cd ./hardhat-project/ && (npm install --save-dev hardhat@2.12.0) && (npm install dotenv --save) && (npm install --save-dev @nomiclabs/hardhat-ethers "ethers@^5.0.0") && (npx hardhat compile) && (npx run ./scripts/interact.js) `,
      exec(`(cd ./hardhat-project/) && (npx hardhat compile)`,
        function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
       
    
   /*
        res.sendFile(file.originalname, options, function (err) {
            if (err) {
                next(err);
            } else {
                console.log('Sent:', file.originalname);
                next();
            }
        });
        
    */
   res.end("done!!!");
    })