import { UMAP } from 'npm:umap-js';


function calculateUmap(data, config) {
    const model = new UMAP(config);
    const nEpochs = model.initializeFit(data);
    for (let i = 0; i < nEpochs; i++) {
        model.step();
    }
    const embedding = model.getEmbedding();
    return embedding;
}

export default calculateUmap;