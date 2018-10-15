import { MnistData} from './data'
import { NeuralNetwork } from './model'
import sketch from './sketch'
import p5 from 'p5'

// Maybe remove p5 and keep @types/p5

var c = new p5(sketch)

var model
var data

const CREATE_NEW = false

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

function on_startup() {
  if (CREATE_NEW) {
    create_new_model()
  } else {
    load_old_model()
  }
}

on_startup()


/// Detta ska ligga i ui.js sen

function clear() {
  let element = document.createElement('BUTTON');
  element.innerHTML = 'clear pixls'
  element.id = 'clrbtn'

  element.addEventListener('click', (event) => {
    c.clear_pixels();
  });

  return element;
}

function drawing() {
  let element = document.createElement('div');
  element.id = 'drawing'

  element.addEventListener('click', (event) => {
    // Time out?
    var cnvPixels = c.get_pixels();
    let cnvTensor = data.transformToTensor(cnvPixels);
    model.show_prediction(cnvTensor);
  });

  return element;
}

document.body.appendChild(drawing());
document.body.appendChild(clear());
