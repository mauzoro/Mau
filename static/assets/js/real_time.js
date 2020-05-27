var lat, lon, fecha, hora, mensaj, poli1,poli2,rpm;
let nombre_c, id_t, newLatLng1,newLatLng2;
let map = L.map('map').setView([10.99304, -74.82814], 13);
const tileurl2 = 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png';
L.tileLayer(tileurl2).addTo(map);
var customIcon = new L.Icon({
    iconUrl: '../static/images/transporte.svg',
    iconSize: [50, 50],
    iconAnchor: [25, 50]
  });
var customIcon2 = new L.Icon({
    iconUrl: '../static/images/camion-de-reparto.svg',
    iconSize: [50,50],
    iconAnchor: [25,25]
});
marcador = L.marker([0, 0],{icon:customIcon});
marcador.addTo(map);
let marcador2 = L.marker([0,0],{icon:customIcon2});
marcador2.addTo(map);
p1 = [];
p2 = [];
function actual() {
    var truck = document.querySelector('input[name="id"]:checked').value;
    nombre_c = truck
    
      
    fetch("/tr").then(res => {
        return res.json()
    }).then(data => {
       
        mensaje = data;
        
        let qwe = mensaje.id_t;
        
        
            
                if (qwe == "ID=CAE"){
                    
                    
                   
                    lon = mensaje.longitud;
                    lat = mensaje.latitud;
                    hora = mensaje.hora;
                    fecha = mensaje.fecha;
                    
                    newLatLng1 = new L.LatLng(lat, lon);
                    p1.push(newLatLng1)
                    
                }
                if (qwe == "ID=JAM"){
                            
                            
                            lon = mensaje.longitud;
                            lat = mensaje.latitud;
                            hora = mensaje.hora;
                            fecha = mensaje.fecha;
                           
                            newLatLng2 = new L.LatLng(lat, lon);
                            p2.push(newLatLng2)
                            
                        }
        if (truck == "CAE"){
            if (poli2){
                //console.log("existe poli 2 y borro");
                map.removeLayer(poli2)
                poli2 = null
            }
            marcador2.setLatLng([100000,1000000])
            marcador.setLatLng(newLatLng1);
            map.setView(newLatLng1)
            
            if (!poli1) {
                console.log("Creo poli1");
                poli1 = L.polyline(p1).addTo(map);
                
            }
            
            poli1.addLatLng(newLatLng1);
            rpm = mensaje.rpm;
        }else {
            if (poli1){
                console.log("existe poli 1 y borro");
                map.removeLayer(poli1)
                poli1 = null
            }
            marcador.setLatLng([100000,1000000])
            marcador2.setLatLng(newLatLng2);
            map.setView(newLatLng2)
            
            if (!poli2) {
                console.log("Creo poli 2");
                poli2 = L.polyline(p2,{color:'red'}).addTo(map);
            }
            poli2.addLatLng(newLatLng2);
            rpm = mensaje.rpm;
        }                    


        
        
        
    });

}

let actualizar_datos = setInterval(actual, 500);
//Chart 
window.onload = function () {

    var dps = []; // dataPoints
    
    var chart = new CanvasJS.Chart("chartContainer", {
        
        title :{
            text: "Diseño"
        },
        axisY: {
            includeZero: false
        },      
        data: [{
            type: "line",
            dataPoints: dps
        }]
    });
    
    var xVal = 0;
    var yVal = 100; 
    var updateInterval = 1000;
    var dataLength = 20; // number of dataPoints visible at any point
    
    var updateChart = function (count) {
        chart.options.title.text = nombre_c
        count = count || 1;
      
        for (var j = 0; j < count; j++) {
            yVal = parseInt(rpm) ;
            dps.push({
                x: xVal,
                y: yVal
            });
            xVal++;
        }
    
        if (dps.length > dataLength) {
            dps.shift();
        }
    
        chart.render();
    };
    
    updateChart(dataLength);
    setInterval(function(){updateChart()}, updateInterval);
}