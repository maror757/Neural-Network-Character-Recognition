import * as tf from '@tensorflow/tfjs'
import { MnistData } from './data'
import { NeuralNetwork } from './model'
import sketch from './sketch'
import p5 from 'p5'

// Maybe remove p5 and keep @types/p5

let canvas
let model
let data

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

  canvas = new p5(sketch)
}

on_startup()
/*
/// UI

function component() {
  let element = document.createElement('BUTTON');
  element.innerHTML = 'get pixels'
  element.id = 'btn'
  return element;
}

document.body.appendChild(component());

const btn_element = document.getElementById('btn');

btn_element.onclick = function () {

  let temp = canvas.get_pixels()
  console.log(temp);


};


let xs = tf.tensor4d(
  this.trainImages,
  [this.trainImages.length / IMAGE_SIZE, IMAGE_H, IMAGE_W, 1]);
let labels = tf.tensor2d(
  this.trainLabels, [this.trainLabels.length / NUM_CLASSES, NUM_CLASSES]);

if (numExamples != null) {
  xs = xs.slice([0, 0, 0, 0], [numExamples, IMAGE_H, IMAGE_W, 1]);
  labels = labels.slice([0, 0], [numExamples, NUM_CLASSES]);
}
*/