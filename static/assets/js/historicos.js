var lat, lon, fecha, hora, mensaj, poli,f1,f2,h1,h2,btn;
var road = []
var tama=0;
var n=1;
let map = L.map('map').setView([10.99304, -74.82814], 13);
const tileurl2 = 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png';
L.tileLayer(tileurl2).addTo(map);
var marcador = L.marker([0, 0]);
marcador.addTo(map);
//content



        
        f1 = document.getElementById("fecha1");
        f2 = document.getElementById("fecha2");
        h1 = document.getElementById("hora1"); 
        h2 = document.getElementById("hora2"); 
        btn = document.getElementById("bth");
        var date= new Date();
        var mes = (date.getMonth()+1)*0.01
        f1.value= date.getFullYear()+ "-" + mes.toString().slice(2,5) + "-" + date.getDate();
        f1.max=date.getFullYear()+ "-" + mes.toString().slice(2,5) + "-" + date.getDate();
        f2.value= date.getFullYear()+ "-" + mes.toString().slice(2,5) + "-" + date.getDate();
        f2.max=date.getFullYear()+ "-" + mes.toString().slice(2,5) + "-" + date.getDate();
        h1.value="00:00:05";
        h2.value="23:59:59";
        btn = document.getElementById("bth");
   ;  
  
        console.log(f1)
        var h ;
        
        let polyline;

        btn.addEventListener("click",()=>{
            let f11 = new Date(f1.value).getTime();
            let f22 = new Date(f2.value).getTime();
            let t11 = h1.value.split(":");
            let t22 = h2.value.split(":");
            let h11 = t11[0]*3600000+ t11[1]*60000+t11[2]*1000;
            let h22 = t22[0]*3600000+ t22[1]*60000+t22[2]*1000;
            let total1 = h11+f11;
            let total2 = h22+f22;
            console.log(f11)
            console.log(t11)
            console.log(`El total 1 es: ${total1}`)
            console.log(`EL total 2 es: ${total2} `)
            console.log(f22)
            console.log(t22)
            if (total2 >= total1){
                console.log("En orden")
                let data = {
                    fecha1:f1.value,fecha2:f2.value, hora1:h1.value,  hora2:h2.value
                }
               // console.log(data)
                fetch("/historicos",{
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers:{
                        'Content-Type': 'application/json'
                    }
                }).then(res =>{
                    return res.json()
                }).then(data =>{
                    console.log(data)
                    if (data.length==0){
                        alert("No hay datos para mostrar")
                    }
                    road=[];
                    if (polyline){
                        map.removeLayer(polyline)
                    }
                    
                    data.map((d, i) => { // for 
                        road[i] = {
                            lat: d.latitud,
                            lon: d.longitud,
                          // marquer: L.marker([d.latitud,d.longitud]).bindPopup(`${[d.fecha,d.hora]}`).addTo(group),
                          
                        }
                        
                    })
                    
                    polyline =L.polyline(road).addTo(map);
                });
            }else{
                alert("Fecha inicial mayor que fecha final")
            }
        })
     

//contents = contents.substr(0,5);





