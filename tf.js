const model

function set_up_conv_model() {
    model = tf.sequential()

    model.add(tf.layers.conv2d({
        inputShape: [IMAGE_H, IMAGE_W, 1],
        kernelSize: 5,
        filters: 16,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'VarianceScaling'
    }));
    
    model.add(tf.layers.maxPooling2d({
        poolSize: 2,
        strides: 2
    }));

    model.add(tf.layers.conv2d({
        kernelSize: 3,
        filters: 32,
        activation: 'relu'
    }));

    model.add(tf.layers.maxPooling2d({
        poolSize: 2,
        strides: 2
    }));

    model.add(tf.layers.conv2d({
        kernelSize: 3,
        filters: 32,
        activation: 'relu'
    }));

    model.add(tf.layers.flatten({
    }));

    model.add(tf.layers.dense({
        units: 10,
        activation: 'softmax'
    }));
}

model.compile({
  optimizer: tf.train.sgd(0.1),
  loss: tf.losses.meanSquaredError
});

const xs = tf.tensor2d([
  [0, 0],
  [0.5, 0.5],
  [1, 1]
]);

const ys = tf.tensor2d([
  [1],
  [0.5],
  [0]
]);


train().then(() => {
  let outputs = model.predict(xs);
  outputs.print();
  console.log('training complete');
});

async function train() {
  for (let i = 0; i < 10; i++) {
    const config = {
      shuffle: true,
      epochs: 10
    }
    const response = await model.fit(xs, ys, config);
    console.log(response.history.loss[0]);
  }
}


// const xs = tf.tensor2d([
//   [0.25, 0.92],
//   [0.12, 0.3],
//   [0.4, 0.74],
//   [0.1, 0.22],
// ]);
// let ys = model.predict(xs);
// outputs.print();
