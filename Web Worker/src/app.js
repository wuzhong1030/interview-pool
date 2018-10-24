console.log('app.js')

if (window.Worker) {
    var worker = new Worker('./src/worker.js')
    console.log(worker)
    worker.postMessage('hello world')

    worker.onmessage = function(event) { // 接收
        console.log('Received message ' + event.data);
    }
}