import { MnistData} from './data'
import { NeuralNetwork } from './model'
import sketch from './sketch'
import * as ui from './ui'
import p5 from 'p5'

//const CREATE_NEW = false

var drawing
var model
var data
var interval_prediction

async function create_new_model(num_train_elements) {
  console.log('clear local storage')
  localStorage.clear()

  data = new MnistData()
  await data.load()

  model = new NeuralNetwork()
  await model.compile()

  await model.train(data, num_train_elements)
  await model.save()
}

async function load_old_model() {
  data = new MnistData()
  model = new NeuralNetwork()
  await model.load()
}

function predict() {
  let drawing_pixels = drawing.get_pixels()
  let drawing_tensor = data.transformToTensor(drawing_pixels);
  model.show_prediction(drawing_tensor);
}


async function on_startup() {

  let valueinfo_element = document.createTextNode("Set the ammount of images in the training data you want the model to train on: ");
  document.getElementById('value_container').appendChild(valueinfo_element);

  let slider_element = document.createElement('INPUT')
  slider_element.type = "range";
  slider_element.min = "5000";
  slider_element.max = "65000";
  slider_element.value = "40000";
  slider_element.className = "slider";
  slider_element.id = "myRange";

  let value_element = document.createTextNode("");

  document.getElementById('slide_container').appendChild(slider_element);
  document.getElementById('slide_container').appendChild(value_element);
  value_element.nodeValue = slider_element.value; // Display the default slider value
  // Update the current slider value (each time you drag the slider handle)
  slider_element.oninput = function() {
      value_element.nodeValue = this.value;
  }

  let button1 = document.createElement('BUTTON');
  button1.innerHTML = 'Start training'
  button1.className = "setup_button"
  let button2 = document.createElement('BUTTON');
  button2.innerHTML = 'Load model'
  button2.className = "setup_button"
  if (localStorage.getItem("final_acc") === null) {
    button2.disabled = true;
  }

  document.getElementById('setup_button_container').appendChild(button1);
  document.getElementById('setup_button_container').appendChild(button2);

  button1.addEventListener('click', (event) => {
    document.getElementById('initial_container').innerHTML = "";
    run(true, slider_element.value);
  });
  button2.addEventListener('click', (event) => {
    document.getElementById('initial_container').innerHTML = "";
    run(false);
  });
}

async function run(CREATE_NEW, num_train_elements) {


  if (CREATE_NEW) {
    await create_new_model(num_train_elements)
  } else {
    await load_old_model()
  }

  drawing = new p5(sketch)

  let canvas_element = document.getElementById('canvas_container')
  canvas_element.addEventListener('mousedown', (event) => {
    predict()
     interval_prediction = setInterval(() => { predict() }, 250)
  });

  canvas_element.addEventListener('click', (event) => {
    clearInterval(interval_prediction);
  });

  canvas_element.addEventListener('mouseleave', (event) => {
    clearInterval(interval_prediction);
  });

  let new_element = document.createElement('BUTTON');
  new_element.parent = 'canvas_container'
  new_element.innerHTML = 'Clear'
  new_element.id = 'clear_button'

  new_element.addEventListener('click', (event) => {
    drawing.clear_pixels();
    ui.log_guess('')
    ui.log_info('')
  });

  document.getElementById('button_container').appendChild(new_element);
}

on_startup();
