
let data;
async function load() {
  data = new MnistData();
  await data.load();
}


async function gitgud()
{
  await load();
  //const trainData = data.getTrainData();
  const testData = data.getTestData(5);
    console.log(testData);
}

gitgud();



// This is a helper class for loading and managing MNIST data specifically.
// It is a useful example of how you could create your own data manager class
// for arbitrary data though. It's worth a look :)

/**
 * Creates a convolutional neural network (Convnet) for the MNIST data.
 *console.log("");
 * returns {tf.Model} An instance of tf.Model.
 */
 function createConvModel() {

  // Create a sequential neural network model. tf.sequential provides an API
  // for creating "stacked" models where the output from one layer is used as
  // the input to the next layer.
  const model = tf.sequential();

  // The first layer of the convolutional neural network plays a dual role:
  // it is both the input layer of the neural network and a layer that performs
  // the first convolution operation on the input.
  //It uses a simple RELU activation function which pretty much just looks like this: __/
  model.add(tf.layers.conv2d({
    inputShape: [IMAGE_H, IMAGE_W, 1],  /*The shape of the data that will flow into the first layer of the model.
                                          28x28 rows and colums (num of pixels), depth = 1 since we only have 1 color channel */
    kernelSize: 5,                      //The size of the sliding convolutional filter windows (5x5)
    filters: 16,                        //The number of filter windows of size kernelSize to apply to the input data
    strides: 1,                         //Here the filter will slide over the image in steps of 1 pixel.
    activation: 'relu',
    kernelInitializer: 'VarianceScaling'//The method to use for randomly initializing the model weights
  }));

  // After the first layer we include a MaxPooling layer. This acts as a sort of
  // downsampling using max values in a region instead of averaging.
  // https://www.quora.com/What-is-max-pooling-in-convolutional-neural-networks
  /* The objective is to down-sample an input representation ,
   reducing its dimensionality and allowing for assumptions to be made about features contained in the sub-region.
   This is done partly to avoid over-fitting by providing an abstracted form of the representation, aswell as cutting computation */
  model.add(tf.layers.maxPooling2d({
    poolSize: 2,
    strides: 2
  }));

  // Our third layer is another convolution, this time with 32 filters.
  model.add(tf.layers.conv2d({
    //inputShape: inferred from the shape of output from previous layer
    kernelSize: 3,
    filters: 32,
    //strides: 1,
    activation: 'relu'
  }));

  // Max pooling again.
  model.add(tf.layers.maxPooling2d({
    poolSize: 2,
    strides: 2
  }));

  // Add another conv2d layer.
  model.add(tf.layers.conv2d({kernelSize: 3, filters: 32, activation: 'relu'}));

  // Now we flatten the output from the 2D filters into a 1D vector to prepare
  // it for input into our last layer. This is common practice when feeding
  // higher dimensional data to a final classification output layer.
  model.add(tf.layers.flatten({}));

  //model.add(tf.layers.dense({units: 64, activation: 'relu'}));
  //?? not sure what this does ??

  // Our last layer is a dense layer which has 10 output units, one for each
  // output class (i.e. 0, 1, 2, 3, 4, 5, 6, 7, 8, 9). Here the classes actually
  // represent numbers, but it's the same idea if you had classes that
  // represented other entities like dogs and cats (two output classes: 0, 1).
  // We use the softmax function as the activation for the output layer as it
  // creates a probability distribution over our 10 classes so their output
  // values sum to 1.
  model.add(tf.layers.dense({units: 10, activation: 'softmax'}));

  return model;
}

createConvModel();
async function train(model) {

  const LEARNING_RATE = 0.01;

  console.log("train");
  //Optimizer minimises the loss function.
  //rmsprop: Divide the	learning rate for a weight by a running	average	of the
  //magnitudes of	recent gradients for that weight.
  //"RMS" = Root Mean Squared
  const optimizer = 'rmsprop';

  // We compile our model by specifying an optimizer, a loss function, and a
  // list of metrics that we will use for model evaluation. Here we're using a
  // categorical crossentropy loss, the standard choice for a multi-class
  // classification problem like MNIST digits.
  // The categorical crossentropy loss is differentiable and hence makes
  // model training possible. But it is not amenable to easy interpretation
  // by a human. This is why we include a "metric", namely accuracy, which is
  // simply a measure of how many of the examples are classified correctly.
  // This metric is not differentiable and hence cannot be used as the loss
  // function of the model.
  model.compile({
    optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });
}
