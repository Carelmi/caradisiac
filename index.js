const {getBrands} = require('node-car-api');
const {getModels} = require('node-car-api');
var elasticsearch= require('elasticsearch');
var body= []
var client = new elasticsearch.Client({
     host: 'localhost:9200',
     log: 'trace'
 });




async function GetAll(){
  let j=0;
  var brands = await getBrands();
  for(let i=0; i < brands.length; i++){
     var models= await getModels(brands[i]);
     models.forEach(function(model){
        var config = { index:  { _index: 'caradisia', _type: 'model', _id: j } };
        body.push(config)
        body.push(model)
        j++
     })
  }
}

function SaveDB(){
  client.bulk({
        body: body
    }, function (error, response) {
        if (error) {
            console.error(error);
            return;
        }
        else {
            console.log(response);  
        }
    });
}
