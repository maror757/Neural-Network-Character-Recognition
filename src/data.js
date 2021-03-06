import * as tf from '@tensorflow/tfjs';

export const IMAGE_H = 28;
export const IMAGE_W = 28;
export const NUM_DATASET_ELEMENTS = 65000;
const IMAGE_SIZE = IMAGE_H * IMAGE_W;
const NUM_CLASSES = 10;

const MNIST_IMAGES_SPRITE_PATH =
    'https://storage.googleapis.com/learnjs-data/model-builder/mnist_images.png';
const MNIST_LABELS_PATH =
    'https://storage.googleapis.com/learnjs-data/model-builder/mnist_labels_uint8';

export class MnistData {
    constructor() { }

    async load() {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const imgRequest = new Promise((resolve, reject) => {
            img.crossOrigin = '';
            img.onload = () => {
                img.width = img.naturalWidth;
                img.height = img.naturalHeight;

                const datasetBytesBuffer =
                    new ArrayBuffer(NUM_DATASET_ELEMENTS * IMAGE_SIZE * 4);

                const chunkSize = 5000;
                canvas.width = img.width;
                canvas.height = chunkSize;

                for (let i = 0; i < NUM_DATASET_ELEMENTS / chunkSize; i++) {
                    const datasetBytesView = new Float32Array(
                        datasetBytesBuffer, i * IMAGE_SIZE * chunkSize * 4,
                        IMAGE_SIZE * chunkSize);
                    ctx.drawImage(
                        img, 0, i * chunkSize, img.width, chunkSize, 0, 0, img.width,
                        chunkSize);

                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                    for (let j = 0; j < imageData.data.length / 4; j++) {
                        datasetBytesView[j] = imageData.data[j * 4] / 255;
                    }
                }
                this.datasetImages = new Float32Array(datasetBytesBuffer);

                resolve();
            };
            img.src = MNIST_IMAGES_SPRITE_PATH;
        });

        const labelsRequest = fetch(MNIST_LABELS_PATH);
        const [imgResponse, labelsResponse] =
            await Promise.all([imgRequest, labelsRequest]);

        this.datasetLabels = new Uint8Array(await labelsResponse.arrayBuffer());

        this.trainImages = this.datasetImages.slice(0, IMAGE_SIZE * NUM_DATASET_ELEMENTS);
        this.trainLabels = this.datasetLabels.slice(0, NUM_CLASSES * NUM_DATASET_ELEMENTS);
    }

    /**
     * Get all training data as a data tensor and a labels tensor.
     *
     * @returns
     *   xs: The data tensor, of shape `[numTrainExamples, 28, 28, 1]`.
     *   labels: The one-hot encoded labels tensor, of shape
     *     `[numTrainExamples, 10]`.
     */
    getData(numExamples) {

        numExamples = numExamples || NUM_DATASET_ELEMENTS

        return tf.tidy(() => {
            let xs = tf.tensor4d(
                this.trainImages,
                [this.trainImages.length / IMAGE_SIZE, IMAGE_H, IMAGE_W, 1]);
            let labels = tf.tensor2d(
                this.trainLabels, [this.trainLabels.length / NUM_CLASSES, NUM_CLASSES]);

            if (numExamples != null) {
                xs = xs.slice([0, 0, 0, 0], [numExamples, IMAGE_H, IMAGE_W, 1]);
                labels = labels.slice([0, 0], [numExamples, NUM_CLASSES]);
            }
            return { xs, labels };
        })
    }

    getOneData(data_num) {

        if (((data_num + 1)) >= NUM_TEST_ELEMENTS || data_num === null) {
            console.log('Data out of scope');
            return
        }

        return tf.tidy(() => {
            let xs = tf.tensor4d(
                this.testImages,
                [this.testImages.length / IMAGE_SIZE, IMAGE_H, IMAGE_W, 1]);
            let labels = tf.tensor2d(
                this.testLabels, [this.testLabels.length / NUM_CLASSES, NUM_CLASSES]);

            xs = xs.slice([data_num, 0, 0, 0], [1, IMAGE_H, IMAGE_W, 1]);
            labels = labels.slice([data_num, 0], [1, NUM_CLASSES]);

            return { xs, labels };
        })
    }

     transformToTensor(data) {

       const datasetBytesBuffer = new ArrayBuffer(IMAGE_SIZE * 4);
       const datasetBytesView = new Float32Array(datasetBytesBuffer, 0, IMAGE_SIZE);

        //console.log('data ', data);

       for (var j = 0; j < data.data.length / 4; j++) {
           datasetBytesView[j] = data.data[j * 4] / 255;
       }

       //console.log('datasetBytesView', datasetBytesView);

       var flt32ar = new Float32Array(datasetBytesBuffer);
       var testData = flt32ar.slice(0, IMAGE_SIZE);

       //console.log('testData', testData);

        return tf.tidy(() => {
            let xs = tf.tensor4d(testData, [testData.length / IMAGE_SIZE, IMAGE_H, IMAGE_W, 1]);
            return { xs };
        })
    }
}
