const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const crypto = require('crypto');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("ok dear");
});




url='https://api-demo.bybit.com';

var apiKey = "OzTeR5Uk042LU1eq7k";
var secret = "ew4x3OfmLYYtafPYQyuuRGCVLjB5Pfv4DMu0";
var recvWindow = 5000;
var timestamp = Date.now().toString();

function getSignature(parameters, secret) {
    return crypto.createHmac('sha256', secret).update(timestamp + apiKey + recvWindow + parameters).digest('hex');
}
async function http_request(endpoint,method,data,Info) {
    var sign=getSignature(data,secret);
    var fullendpoint;

    // Build the request URL based on the method
    if (method === "POST") {
        fullendpoint = url + endpoint;
    } else {
        fullendpoint = url + endpoint + "?" + data;
        data = "";
    }

    var headers = {
        'X-BAPI-SIGN-TYPE': '2',
        'X-BAPI-SIGN': sign,
        'X-BAPI-API-KEY': apiKey,
        'X-BAPI-TIMESTAMP': timestamp,
        'X-BAPI-RECV-WINDOW': recvWindow.toString()  
    };

    if (method === "POST") {
        headers['Content-Type'] = 'application/json; charset=utf-8';
    }

    var config = {
        method: method,
        url: fullendpoint,
        headers: headers,
        data: data
    };

    console.log(Info + " Calling....");
    await axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error.response.data);
      });
}

async function TestCase()
{
endpoint="/v5/order/create"
const orderLinkId = crypto.randomBytes(16).toString("hex");
var data = '{"category":"spot","symbol": "DOGEUSDT","side": "Buy","positionIdx": 0,"orderType": "Limit","qty": "1000","price": "0.14490","timeInForce": "GTC","orderLinkId": "' + orderLinkId + '"}';
await http_request(endpoint,"POST",data,"Create");
}



app.get('/ping', async (req, res) => {
    
   await TestCase();
    res.send('pong');
});

app.post('/ping', async (req, res) => {
    
    await TestCase();
    res.send('pong');
});


const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
