import { MnistData} from './data'
import { NeuralNetwork } from './model'
import sketch from './sketch'
import * as ui from './ui'
import p5 from 'p5'

const CREATE_NEW = false

var drawing
var model
var data
var interval_prediction

async function create_new_model() {
  console.log('clear local storage')
  localStorage.clear()

  data = new MnistData()
  await data.load()

  model = new NeuralNetwork()
  await model.compile()

  await model.train(data)
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
  if (CREATE_NEW) {
    await create_new_model()
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

on_startup()
