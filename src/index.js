import { MnistData } from './data';
import { NeuralNetwork } from './model';

let model;
let data;

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
  await data.load()

  model = new NeuralNetwork()
  await model.load()

  // Test start

  //model.show_prediction(img)

  // Test end
}

function on_startup() {

  if (CREATE_NEW) {
    create_new_model()
  } else {
    load_old_model()
  }
}


on_startup()