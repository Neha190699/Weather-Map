const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const router = express.Router();
require('dotenv').config();

const app=express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use('/*', router);


router.get('/' , function(req, res)
{
    res.render('index',{temp:null,name:null,imgURL:null,date:null,weather:null,wind:null,humidity:null,clouds:null,max:null,min:null});
});

/*POST request by user */
router.post("/",async(req ,res)=>
{
   const city=req.body.cityName;
   const appKey=process.env.APP_KEY;
   const unit="metric";
   const url="https://api.openweathermap.org/data/2.5/weather?q="+ city + "&appid="+ appKey + "&units="+unit;
   
   try{

       await fetch(url)
       .then(res => res.json())
       .then(data => {
           if(data.message === 'city not found' )
           {
               res.render('index',{temp:null,name:'city not found',wind:null,clouds:null,humidity:null,imgURL:null,date:null,weather:null,max:null,min:null});
           }
    else{
           const name = data.name;
           const temp = data.main.temp+"°";
           const weather = data.weather[0].description;
           const icon = data.weather[0].icon;
           const imgURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
           const wind = data.wind.speed+" km/hr";
           const humidity = data.main.humidity+"%";
           const clouds = data.clouds.all+"%";
           const max = data.main.temp_max+"°" ;
           const min = data.main.temp_min+"°";
           var today = new Date();
           var month = today.getMonth();
           var currmon="";
           switch(month)
           {
            case 0:currmon="Jan";
                        break;
            case 1:currmon="Feb";
                        break;
            case 2:currmon="Mar";
                        break;
            case 3:currmon="Apr";
                        break;
            case 4:currmon="May";
                        break;
            case 5:currmon="Jun";
                        break;
            case 6:currmon="Jul";
                        break;
            case 7:currmon="Aug";
                        break;
            case 8:currmon="Sep";
                        break;
            case 9:currmon="Oct";
                        break;
            case 10:currmon="Nov";
                        break;
            case 11:currmon="Dec";
                        break;
           }
           var time = today.getHours()+":"+today.getMinutes()+", ";
           var date = time + today.getDate()+"."+currmon+"."+today.getFullYear();
           res.render('index',{temp,name,imgURL,date,weather,wind,humidity,clouds,max,min});
       }
       
     })
   }
    catch(err)
    {
        res.render('index',{temp:"Something went wrong"});
    }
});
 /* Post request ends */


app.listen(process.env.PORT||3000,function(){
    console.log("Server has started.");//sends response on server
  }) ;
