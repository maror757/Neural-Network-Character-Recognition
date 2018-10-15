import * as tf from '@tensorflow/tfjs'
import { IMAGE_H, IMAGE_W, NUM_DATASET_ELEMENTS } from './data';

export class NeuralNetwork {
    constructor() {
        this.model = tf.sequential();
        this.final_acc = 0;
    }

    compile() {
        console.log('compiling model ...')

        this.model.add(tf.layers.conv2d({
            inputShape: [IMAGE_H, IMAGE_W, 1],
            kernelSize: 5,
            filters: 16,
            strides: 1,
            activation: 'relu',
            kernelInitializer: 'VarianceScaling'
        }));

        this.model.add(tf.layers.maxPooling2d({
            poolSize: 2,
            strides: 2
        }));

        this.model.add(tf.layers.conv2d({
            kernelSize: 3,
            filters: 32,
            activation: 'relu'
        }));

        this.model.add(tf.layers.maxPooling2d({
            poolSize: 2,
            strides: 2
        }));

        this.model.add(tf.layers.conv2d({ kernelSize: 3, filters: 32, activation: 'relu' }));
        this.model.add(tf.layers.flatten({}));
        this.model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));

        //const optimizer = 'rmsprop';
        const LEARNING_RATE = 0.01;
        const optimizer = tf.train.rmsprop(LEARNING_RATE);

        this.model.compile({
            optimizer,
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy'],
        });
        console.log('done')
    }

    async save() {
        console.log('saving model ...');
        try {
            await this.model.save('localstorage://my_model')
            localStorage.setItem('final_acc', this.final_acc);
            console.log('done');
        } catch (e) {
            console.log('could not save model');
        }
    }

    async load() {
        console.log('loading model ...')
        try {
            this.model = await tf.loadModel('localstorage://my_model')
            this.final_acc = localStorage.getItem('final_acc');
            console.log('Test accuracy:', this.final_acc, '%');
            console.log('done')
        } catch (e) {
            console.log('model could not load');
        }
    }

    async train(data) {
        console.log('training model ...')

        const num_test = 1000;
        const num_train = 20000 - num_test;

        const num_examples = num_train + num_test;

        if (NUM_DATASET_ELEMENTS < num_examples) {
            console.log('Not enough training images');
            return
        }

        let all_data = data.getData(num_examples);

        const [train_xs, test_xs] = tf.split(all_data.xs, [num_train, num_test])
        const [train_labels, test_labels] = tf.split(all_data.labels, [num_train, num_test])

        const numOfEpochs = 3;
        const batchSize = 64;
        const validationSplit = 0.15;
        let trainBatchCount = 0;
        const totalNumBatches =
            Math.ceil(train_xs.shape[0] * (1 - validationSplit) / batchSize * numOfEpochs ) ;
        let log10percent = Math.round(totalNumBatches / 10);

        await this.model.fit(train_xs, train_labels,
        {
            batchSize,
            validationSplit,
            epochs: numOfEpochs,
            shuffle: true,
            callbacks:
            {
              onBatchEnd: async (batch, logs) => {
                  trainBatchCount++;
                  if( (trainBatchCount % log10percent) == 0  || trainBatchCount == totalNumBatches)
                  {
                    console.log(
                        '(' + `${( trainBatchCount / totalNumBatches * 100 ).toFixed(1)}%` +
                        ` complete). To stop training, refresh or close page.`);
                    await tf.nextFrame();
                  }
              }
              /*,onEpochEnd: async (epoch, logs) => {
                  console.log('epoch ended..')
                  await tf.nextFrame();
              }*/
            }
        });

        const testResult = await this.model.evaluate(test_xs, test_labels);
        const testAccPercent = testResult[1].dataSync()[0] * 100;
        this.final_acc = testAccPercent.toFixed(1);
        console.log('Final test accuracy:', this.final_acc, '%');
        console.log('done')
    }

    show_prediction(data) {
        console.log('predicting')

        tf.tidy(() => {
            const output = this.model.predict(data.xs);
            const predictions_res = Array.from(output.argMax(1).dataSync())[0];
            const predictions_acc = Array.from(output.dataSync());

            if (predictions_acc[predictions_res] < 0.5) {
                console.log('Im not sure');

            } else {
                console.log('Guess: ', predictions_res);
            }
            console.log(predictions_acc.map((elem) => { return elem.toFixed(2)}));
            

            //const labels = Array.from(data.labels.argMax(axis).dataSync());
            //console.log('Ans: ', labels);*/
        })
        console.log('done');
    }
}
