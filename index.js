const {getBrands} = require('node-car-api');
const {getModels} = require('node-car-api');
var elasticsearch= require('elasticsearch');
var express = require('express');
const app = express();
var body= [];
var client = new elasticsearch.Client({
     host: 'localhost:9200',
     log: 'trace'
 });

 const port = 9292;
 app.listen(port, () => {
   console.log('We are live on ' + port);
 });



async function GetAll(){
  let j=0;
  var brands = await getBrands();
  for(let i=0; i < brands.length; i++){
     var models= await getModels(brands[i]);
     models.forEach(function(model){
        var config = { index:  { _index: 'caradisiac', _type: 'model', _id: j } };
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


  app.get('/populate', function (req, res) {
      SaveDB();
      res.send('SUCCESS!')
  })

  app.get('/cars', function(req,res){

      client.search({
          index: 'caradisiac',
          type: 'model',
          body:{
              "size":10,
              "sort":[
                  {"volume.keyword" :{"order":"desc"}}
              ]
          }
      },function (error, response,status) {
          if (error){
              console.log("ERROR : "+error)
          }
          else {
              res.send(response.hits.hits);
          }
      });

  })
