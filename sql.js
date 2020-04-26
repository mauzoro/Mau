var mysql = require('mysql');
var latitud, longitud, fecha, hora, mensaje;
var con = mysql.createConnection({
    host: "caesolucionesiee.c7reutyzgzlp.us-east-1.rds.amazonaws.com",
    user: "mauzoro",
    password: "ronoroazoro123",
    database: 'SyrusDataBase',
    port : 3305
});
if (con){
    console.log("conected")
    sql="SELECT * FROM Syrus WHERE(latitud  BETWEEN ? AND ? )AND (longitud  BETWEEN ? AND ?)";
    value=[  
        "10.93209",
        "10.98602",
        "-74.81466",
        "-74.77054"
    ]
    con.query(sql,value,(err, result)=>{
        if (err) throw err;
        console.log(result.length)
    })
}else{
    console.log("Error")
}