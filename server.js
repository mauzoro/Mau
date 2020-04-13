// jshint esversion: 6
//data base conection 
var mysql = require('mysql');
var latitud, longitud, fecha, hora, mensaje;
var con = mysql.createConnection({
    host: "caesolucionesiee.c7reutyzgzlp.us-east-1.rds.amazonaws.com",
    user: "mauzoro",
    password: "ronoroazoro123",
    database: 'SyrusDataBase',
    port : 3305
});

//Udp conection
const dgram = require('dgram');
const UDP_PORT = '53000';
const IP_ADRESS = '54.90.135.135';
const server = dgram.createSocket('udp4');
server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

server.on('message', (msg, rinfo) => {
    //console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    mensaje = msg.toString('utf8')
    fecha = mensaje.slice(4, 17)
    id = mensaje.slice(38, 42);
    latitud = mensaje.slice(17, 25);
    longitud = mensaje.slice(25, 34);

    fech = new Date(parseFloat(fecha)-18000000);
    fecha = `${fech.getFullYear()}-${fech.getMonth() + 1}-${fech.getDate()}`;
    hora = `${fech.getHours()}:${fech.getMinutes()}:${fech.getSeconds()}`;
    if (con) {
        console.log("Connected!");
        var sql = "INSERT INTO Syrus (latitud,longitud,fecha,hora) VALUES ?";
        var values = [
            [latitud, longitud, fecha, hora]
        ];
        con.query(sql, [values], function(err, result) {
            if (err) throw err;
            console.log("insert");
        });
    } else {
        console.log("Problem with db");
    }



});

server.bind(UDP_PORT, IP_ADRESS);

//server conection
const express = require('express');
const TCP_PORT = 8080;
const app = express();
const path = require("path");
const bodyParser = require('body-parser')
app.use(express.static('Public'));
app.use("/static",express.static('./static/'));
app.set("public", __dirname + "/public");
app.use("/public",express.static('./public/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '../public/index.html'))
});

app.get('/tr', (req, res) => {
    if (con) {
        var sql = "SELECT * FROM Syrus ORDER BY id DESC limit 1 ";
        con.query(sql, function(err, result) {
            if (err) throw err;
            res.json(result[0]);
        });
    } else {
        console.log("error conection with db");
    }
});

app.post("/historicos", (req,res)=>{
        
    if (con) {
        console.log("Connected!");
        var sql =
          "SELECT * FROM Syrus where fecha between ? and ? and hora between ? and ? ";
        var value = [
          req.body.fecha1,
          req.body.fecha2,
          req.body.hora1,
          req.body.hora2
        ];
        con.query(sql, value, function(err, result) {
          if (err) throw err;
          res.json(result);
          //con.end();
        });
      } else {
        console.log("Error conection with db");
      }
});

app.listen(TCP_PORT, function() {
    console.log('Server started at port ' + TCP_PORT.toString());
});
