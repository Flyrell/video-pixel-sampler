import { createSampler } from 'canvas-brightness-sampler';

(async () => {

    // Config variables
    const quality = 1;
    const skipSize = 2;
    const sampleSize = 0;
    const defaultCanvasSize = 512;

    // Styles + Canvas creation
    document.documentElement.style.height = '100%';
    document.body.style.margin = '0';
    document.body.style.height = '100%';
    const canvas = document.createElement('canvas');
    canvas.style.top = '50%';
    canvas.style.left = '50%';
    canvas.style.position = 'absolute';
    canvas.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(canvas);

    // WebCam Creation + canvas sizes based on video from WebCam
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const [ videoTrack ] = stream.getVideoTracks();
    const videoWidth = videoTrack.getSettings().width ?? defaultCanvasSize;
    const videoHeight = videoTrack.getSettings().height ?? defaultCanvasSize;
    canvas.width = videoWidth * quality;
    canvas.height = videoHeight * quality;
    canvas.style.width = `${videoWidth * quality}px`;
    canvas.style.width = `${videoHeight * quality}px`;

    const sampler = createSampler(canvas, { sampleSize, skipSize });
    const context = sampler.getContext();
    const signal = sampler.getSignal();

    const video = document.createElement('video');
    video.autoplay = true;
    video.srcObject = stream;
    video.style.display = 'none';
    video.addEventListener('play', () => {
        const step = async () => {
            const receiver = signal.receive();
            context.clearRect(0, 0,canvas.width, canvas.height);
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            receiver.then(() => context.clearRect(0, 0,canvas.width, canvas.height));
            sampler.sample((brightness, posX, posY) => {
                // Blur
                // context.clearRect(posX, posY, skipSize, skipSize);
                // brightness = Math.round(brightness);
                // const hex = brightness.toString(16);
                // const color = `#${hex}${hex}${hex}`;
                // receiver.then(() => {
                //     context.fillStyle = color;
                //     context.fillRect(posX, posY, skipSize, skipSize);
                // });

                // Circles
                // const percentage = brightness / 255;
                // const halfSample = skipSize / 2;
                // let radius = (1 - percentage) * halfSample;
                // signal.receive().then(() => {
                //     context.fillStyle = '#382f98';
                //     context.beginPath();
                //     context.arc(posX + halfSample, posY + halfSample, radius, 0, 2 * Math.PI);
                //     context.fill();
                // });

                // Squares
                brightness = Math.round(brightness);
                const hex = brightness.toString(16);
                const color = `#${hex}${hex}${hex}`;
                receiver.then(() => {
                    context.fillStyle = color;
                    context.fillRect(posX, posY, skipSize - 1, skipSize - 1);
                });

                // ASCII
                // const percentage = brightness / 255;
                // context.font = `${skipSize}px Courier`;
                // const map = '.\'`^\\",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';
                // const char = map.charAt(Math.round((1 - percentage) * (map.length - 1)));
                // receiver.then(() => context.fillText(char, posX, posY));
            });
            requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    });
    document.body.append(video);
})();
