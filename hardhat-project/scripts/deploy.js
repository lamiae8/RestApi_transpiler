async function main() {
    const HelloWorld = await ethers.getContractFactory("test");
 
    // Start deployment, returning a promise that resolves to a contract object
    const hello_world = await HelloWorld.deploy("Hello test !! ");
    console.log("Contract deployed to address:", hello_world.address);
    
    fs.writeFile('../../Abi_Address.json' ,  hello_world.address , function(err,data){
      if (err){
        return console.log(err)
      }
        console.log(data)
    });
    /*
    var data = fs.readFileSync('../../Abi_Address.json').toString().split("\n");
    data.splice(0, 0, "Contract address : "+ hello_world.address );
    var text = data.join("\n");

    fs.writeFile('../../Abi_Address.json', text, function (err) {
    if (err) return err;
    });
*/
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });