// jshint esversion: 6
//data base conection 
var mysql = require('mysql');
var latitud, longitud, fecha, hora, mensaje, mensaje1,rpmh,rpm,crpm,id ;
var con = mysql.createConnection({
  
});

//Udp conection (sniffer)
const dgram = require('dgram');
const UDP_PORT = '53000';
const IP_ADRESS = '192.168.0.9';
const server = dgram.createSocket('udp4');
server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

server.on('message', (msg, rinfo) => {
    //console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    mensaje = msg.toString('utf8')
    mensaje1 = mensaje.split(',');// mensaje = "qw,er,ty"      mensaje1 = mensaje.split(',')  => mensaje1 = ["qw","er","ty"]
    fecha = mensaje1[1]
    longitud = mensaje1[2]
    latitud = mensaje1[3]
    let rpm_cd = mensaje1[4] // <10c03 41 0c 12 32 wqr230
    var index = rpm_cd.indexOf('4'); 
    var h_rpm = rpm_cd.slice(index, index+12);
    h_rpm = h_rpm.split(' ').join(''); //h_rpm= ["41","0c","12","32"] =join> 410c1232
    crpm=h_rpm.slice(0,4);
    if (crpm == "410C"){
        var variable = h_rpm.slice(4,8)
        rpm = parseInt(variable,16)/4;     
      }  else {
        rpm = 0
      }
    id = mensaje1[5];
    fech = new Date(parseFloat(fecha)-18000000);
    fecha = `${fech.getFullYear()}-${fech.getMonth() + 1}-${fech.getDate()}`;
    hora = `${fech.getHours()}:${fech.getMinutes()}:${fech.getSeconds()}`;
    
    // console.log(mensaje);
    // console.log("Fecha: ",fecha);
    // console.log("Hora: ",hora);
    // console.log("Latitud: ",latitud);
    // console.log("Longitud: ",longitud);
    // console.log("Los rpm son: ",rpm);
    // console.log("EL id es: ", id);
   

    if (con) {
        console.log("Connected!");
        var sql = "INSERT INTO Syrus (latitud,longitud,fecha,hora,rpm,id_t) VALUES ?";
        var values = [
            [latitud, longitud, fecha, hora,rpm,id]
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
    response.sendFile(path.join(__dirname, '../Mau/public/index.html'))
});



app.get('/tr', (req, res) => {
    if (con) {
        var sql = "SELECT * FROM Syrus ORDER BY id DESC limit 1 ";
        con.query(sql, function(err, result) {
            if (err) throw err;
            console.log("correct");
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
          "SELECT * FROM Syrus where id_t = ? AND TIMESTAMP(fecha,hora) BETWEEN TIMESTAMP(?,?) AND TIMESTAMP(?,?)";
        var value = [
          req.body.id_t,
          req.body.fecha1,         
          req.body.hora1,
          req.body.fecha2,
          req.body.hora2
        ];
        console.log(value)
        con.query(sql, value, function(err, result) {
          if (err) throw err;
          res.json(result)
          //con.end();
        });
      } else {
        console.log("Error conection with db");
      }
});
app.post("/historicos2", (req,res)=>{
        
    if (con) {
        console.log("Connected!");
        var sql =
        "SELECT * FROM Syrus WHERE id_t = ? AND (latitud  BETWEEN ? AND ? )AND (longitud  BETWEEN ? AND ?)";
        var value = [
          req.body.id_t,
          req.body.lat1,
          req.body.lat2,
          req.body.lon1,
          req.body.lon2
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
