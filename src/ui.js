function comms(data) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'http://168.91.197.90:2518?' + data, true);
    // xhr.open("POST", 'http://127.0.0.1:2517?' + data, true);
    xhr.send();
}
const lightKeys = {
    vran: 0,
    vrae: 1,
    vras: 2,
    bed: 3,
    desk: 4
};

var lightSel = document.getElementById('lights').value;

document.getElementById('lights').addEventListener('change', () => {
    lightSel = document.getElementById('lights').value;
});

document.getElementById('lcolor').addEventListener('change', () => {
    let color = document.getElementById('lcolor').value;
    comms(`mode=color&color=${encodeURIComponent(color)}&target=${lightSel}`);
    changeColor(lights[lightKeys[lightSel]], parseInt(color.replace('#', '0x')));
});

document.getElementById('lighton').addEventListener('click', () => {
    comms(`mode=power&power=true&target=${lightSel}`);
    changeColor(lights[lightKeys[lightSel]], 0xffffff);
});

document.getElementById('lightoff').addEventListener('click', () => {
    comms(`mode=power&power=false&target=${lightSel}`);
});