const express = require('express');
const port = 3001;
const app = express();
app.use(express.json());
var xlsx = require('node-xlsx');    
const axios = require('axios');
var rate;

// start time
var hrTime = process.hrtime();

// Get BTC USD exchange rate 
axios.get('https://api.binance.com/api/v3/avgPrice?symbol=BTCEUR').then(response => {
        const body = response.data;

        // get BTC to EUR then transfer from EUR to USD
        rate =body.price*1.02;
    
    
    var time1=hrTime[0] + hrTime[1] / 1000000000;

    var obj = xlsx.parse(__dirname + '/BAVERAGE-USD-FSWO4.xlsx'); // parses a file
    var rows = [];
    var sheet;
    console.log("rate",rate)

    //looping through all sheets
        for(var i = 0; i < obj.length; i++)
        {
            sheet = obj[i];
            //loop through all rows in the sheet
            for(var j = 0; j < sheet['data'].length; j++)
            {
                    //add the row to the rows array
                    rows.push(sheet['data'][j]);
            }
        }


    var max=sheet['data'][1][1];
    var min=sheet['data'][1][1];
    var av=0;
    var av1=0,av2=0,av3=0;

    for (var j = 1; j < sheet['data'].length; j++){

        // Getting Average per Month
        av+=sheet['data'][j][1];

        //Max
        if(max<sheet['data'][j][1])
            max=sheet['data'][j][1];

        // Average Feb   2016
        if(j<30)
                av1+=sheet['data'][j][1];

        // Average of Jan 2016       
        if(j<61 && j>=30)
                av2+=sheet['data'][j][1];

        // Average of Dec 2015
        if(j<=92 && j>=61)
                av3+=sheet['data'][j][1];
                
        // Getting Min        
        if(min>sheet['data'][j][1])
            min=sheet['data'][j][1];
    }
    console.log("in BTC");
    console.log("Max in all days", max/rate) ;

    console.log("Average of all days", (av/(sheet['data'].length-1)/rate)) ;

    console.log("Average of Febuary", (av1/29)/rate) ; 

    console.log("Average of January", (av2/31)/rate) ;   

    console.log("Average of December", (av3/31)/rate) ;   

    console.log("Min in all days", min/rate) ;

    console.log("");


    
    console.log("in USD");

    console.log("");

    console.log("Max in all days", max) ;

    console.log("Average of all days", (av/(sheet['data'].length-1))) ;

    console.log("Average of Febuary", (av1/29)) ; 

    console.log("Average of January", (av2/31)) ;   

    console.log("Average of December", (av3/31)) ;   

    console.log("Min in all days", min) ;


    hrTime = process.hrtime() ;
    console.log("Time consumed : ",((hrTime[0] + hrTime[1] / 1000000000)-time1));
}
);

app.listen(
    port,
    () => console.log(`Listening on port ${port}`)
  );