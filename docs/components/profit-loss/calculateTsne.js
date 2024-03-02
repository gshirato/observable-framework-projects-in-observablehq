import TSNE from 'npm:tsne-js';

function calculateTsne(data, config) {
    const model = new TSNE(config);

    model.init({
        data: data,
        type: 'dense'
    })
    let [error, iter] = model.run();
    let result = model.getOutput();
    return result;
}

export default calculateTsne;