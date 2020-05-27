var lat, lon, fecha, hora, mensaj, poli,f1,f2,h1,h2,btnm,marker1,marker2,rect,i,consulta,polyline,cambio,datos;
var road = []
var tama=0;
var lati=[];
var long=[];
var fechaa=[];
var horaa=[];
var n=1;
var vacio ;
cambio = document.getElementById("aparecer")
let map = L.map('map').setView([10.976816, -74.799264], 15);
const tileurl2 = 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png';
L.tileLayer(tileurl2).addTo(map);
//var marcador = L.marker([10.99304, -74.82814],{draggable:'true'});
//marcador.addTo(map);
var marker3 = L.marker([0,0]).addTo(map);

let rec = [];
i=0;
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
map.on("click",(e)=>{
   
    if(i==0){
         marker1 = L.marker(e.latlng,{draggable:'true',icon:customIcon}).addTo(map);
        rec.push(e.latlng)
        marker1.on("drag",cambiar)
       
    } else if (i==1){
        marker2 = L.marker(e.latlng,{draggable:'true',icon:customIcon2}).addTo(map);
        rec.push(e.latlng)
        rect=L.rectangle(rec,{color:'#00D21D'}).addTo(map)
        consultar();
        marker1.on("drag", cambiar)
        marker2.on("drag",cambiar2)

        marker1.on("dragend",consultar)
        marker2.on("dragend", consultar)
        
    }else{
        // marker1.on("drag", cambiar)
        // marker2.on("drag",cambiar2)
    }
    
    i++
})

//Funtions

function cambiar(event){
    //console.log("marcador1")
    var marker = event.target;
            var position = marker.getLatLng();
            
            marker.setLatLng(new L.LatLng(position.lat, position.lng),{draggable:'true',icon:customIcon});
            rec[0]=position;
            //console.log(rec)
            rect.setBounds(rec)
            //console.log(rect.getBounds().getEast())
}
function cambiar2(event) {
    var marker2 = event.target;
            var position = marker2.getLatLng();
            
            marker2.setLatLng(new L.LatLng(position.lat, position.lng),{draggable:'true',icon:customIcon2});
            rec[1]=position;
            console.log(rec)
            rect.setBounds(rec)
            //console.log(rect.getBounds().getEast())
}
var p= 0;
function consultar(){
            var truck = document.querySelector('input[name="id"]:checked').value;
            
            if (truck == "CAE"){

                consulta2()
            }
            consulta={
                id_t:"ID="+truck,
                lat1:rect.getBounds().getSouth(),
                lat2:rect.getBounds().getNorth(),
                lon1:rect.getBounds().getWest(),
                lon2:rect.getBounds().getEast()
            }
            fetch("/historicos2",{
                method: 'POST',
                body: JSON.stringify(consulta),
                headers:{
                    'Content-Type': 'application/json'
                }
            }).then(res =>{
                return res.json()
            }).then(data =>{
                datos=data
                console.log(truck);
                if (truck == "CAE"){
                    console.log(vacio);
                    data = vacio.concat(data)
                    datos= data;
                }
                console.log(data)
                road=[];
                marker3.setLatLng([0,0])
                if (data.length == 0){
                    cambio.innerHTML="No hay datos, busque en otra zona"
                    
                }else{
                    fechaa=[]
                    //console.log(p)
                    if (p!=0){
                        remove("select")
                    }
                    //console.log("no es 0")
                    cambio.innerHTML=" "
                    var select=document.createElement("SELECT",{id:"select"});
                    select.id = "select"
                    select.onchange = cambiof;
                    var comienzo = document.createElement("option")
                    comienzo.text = "Por favor escoja la fecha..."
                    select.options.add(comienzo)
                    fechaa[0]=data[0].fecha.slice(0,10)
                    var q =fechaa[0]
                    for (var i=0;i<data.length;i++){
                        //console.log("hola")
                        //console.log(data[i].fecha.slice(0,10))
                        if (q!=data[i].fecha.slice(0,10)){
                            //console.log(i)
                            q=data[i].fecha.slice(0,10);
                            fechaa.push(data[i].fecha.slice(0,10))
                        }
                    }
                    
                    for (var i=0;i<fechaa.length;i++){
                        var c = document.createElement("option")
                        c.id = "opciones"
                        c.text=fechaa[i];
                        select.options.add(c)
                    }
                    cambio.appendChild(select);
                    p=1
                    
                    
                }
                
            });
}
var n=0;
function cambiof(){
    if (n==1){
        remove("select2")
        n=0
    }
    horaa=[];
    var x = document.getElementById("select");
    var o = x.selectedIndex;
    //console.log(x.options[o].text)
    var select2 = document.createElement("SELECT");
    select2.id="select2"
    select2.onchange = cambioh;
    var comienzo = document.createElement("option")
    comienzo.text = "Por favor escoja la hora..."
    select2.options.add(comienzo)
    //console.log(x.options[o].text)
    
    for (var i=0;i<datos.length;i++){
        //console.log(datos[i].fecha.slice(0,10))
        if (datos[i].fecha.slice(0,10)==x.options[o].text){
            horaa.push(datos[i].hora)
        }
    }
   
    for (var i=0;i<horaa.length;i++){
        //console.log("hola")
        var c = document.createElement("option")
        c.text=horaa[i];
        select2.options.add(c)
    }
    cambio.appendChild(select2)
    n=1;
}

function cambioh(){
    var x = document.getElementById("select");
    var o = x.selectedIndex;
    var x2 = document.getElementById("select2");
    var o2 = x2.selectedIndex;
    for (var i=0;i<datos.length;i++){
        if (datos[i].fecha.slice(0,10)==x.options[o].text && datos[i].hora==x2.options[o2].text){
            console.log("hola")
            var latitudd = datos[i].latitud;
            var longitudd = datos[i].longitud;
            var rpm = datos[i].rpm;
        }
    }
    marker3.setLatLng([latitudd,longitudd])
   
    let variable = ["fecha: "+x.options[o].text,"hora: "+x2.options[o2].text,"latitud: "+latitudd,"longitud: "+longitudd, "rpm: "+rpm];
    marker3.bindPopup(`${variable}`)
}
function remove(id) {
   var imagen = document.getElementById(id);	
	if (!imagen){
		//alert("El elemento selecionado no existe");
	} else {
		var padre = imagen.parentNode;
		padre.removeChild(imagen);
	}
}

$('input[type="radio"]').on('click change', function(e) {
    cambio.innerHTML = "Al hacer click sobre el mapa se creará un marcador, si presiona nuevamente se formará un rectangulo de busqueda. Escogerá la fecha que desee y despues la hora."
    // if (rect){
    //     map.removeLayer(rect);
    //     rect = null 
    // }
    // i=0;

});
function consulta2(){
    consulta={
        id_t:"",
        lat1:rect.getBounds().getSouth(),
        lat2:rect.getBounds().getNorth(),
        lon1:rect.getBounds().getWest(),
        lon2:rect.getBounds().getEast()
    }
    
    fetch("/historicos2",{
        method: 'POST',
        body: JSON.stringify(consulta),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(res =>{
        return res.json()
    }).then(datas =>{ 
        vacio = null 
        vacio=datas;
        console.log(vacio);
    });
}