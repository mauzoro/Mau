var lat, lon, fecha, hora, mensaj, poli;
let map = L.map('main').setView([10.99304, -74.82814], 13);
const tileurl2 = 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png';
L.tileLayer(tileurl2).addTo(map);
marcador = L.marker([0, 0]);
marcador.addTo(map);

function actual() {
    fetch("/tr").then(res => {
        return res.json()
    }).then(data => {
        mensaje = data;
        console.log(mensaje);
        lon = mensaje.longitud;
        lat = mensaje.latitud;
        hora = mensaje.hora;
        fecha = mensaje.fecha;
        let newLatLng = new L.LatLng(lat, lon);
        marcador.setLatLng(newLatLng);
        map.setView(newLatLng)
        if (!poli) {
            poli = L.polyline([{ lat: lat, lon: lon }]).addTo(map);
        }
        poli.addLatLng(newLatLng);
    });
}

let actualizar_datos = setInterval(actual, 1000);