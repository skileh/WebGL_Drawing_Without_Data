var config = {
  objetos: degToRad(20),
  barDirection: degToRad(0)
};

var button1 = { Pause_obj: function () { pauseObj = !pauseObj; } };
const loadGUI = () => {
  const gui = new dat.GUI();
  gui.add(config, "objetos", 0, 15500, 1).name('Pontos:');


  gui.add(button1, 'Pause_obj')
    .name('Pause objetos');

};