import { createRenderer } from 'canvas-brightness-sampler';

const quality = 1;
const sampleSize = 4;
const walkingSize = 8;

(async () => {
    document.documentElement.style.height = '100%';
    document.body.style.margin = '0';
    document.body.style.height = '100%';

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const [ videoTrack ] = stream.getVideoTracks();
    // const imageCapture = new ImageCapture(videoTrack);

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '50%';
    canvas.style.left = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';
    canvas.width = (videoTrack.getSettings().width ?? 512) * quality;
    canvas.height = (videoTrack.getSettings().height ?? 512) * quality;
    canvas.style.width = `${videoTrack.getSettings().width ?? 512}px`;
    canvas.style.width = `${videoTrack.getSettings().height ?? 512}px`;
    document.body.appendChild(canvas);
    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error('No context');
    }
    const renderer = createRenderer(canvas, { sampleSize, walkingSize });
    const signal = renderer.getSignal();

    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    video.style.display = 'none';
    video.addEventListener('play', () => {
        const step = async () => {
            // const bitmap = await imageCapture.grabFrame();
            context.clearRect(0, 0,canvas.width, canvas.height);
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            signal.receive().then(() => context.clearRect(0, 0,canvas.width, canvas.height));
            renderer.render((brightness, posX, posY) => {
                // context.clearRect(posX, posY, walkingSize, walkingSize);
                const percentage = brightness / 255;
                if (isNaN(percentage)) {
                    return;
                }

                // Circles
                // const halfSample = walkingSize / 2;
                // let radius = (1 - percentage) * halfSample;
                // signal.receive().then(() => {
                //     context.fillStyle = '#382f98';
                //     context.beginPath();
                //     context.arc(posX + halfSample, posY + halfSample, radius, 0, 2 * Math.PI);
                //     context.fill();
                // });

                // ASCII : SS 8, Q: 2
                context.font = `${walkingSize}px Courier`;
                const map = '.\'`^\\",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';
                const char = map.charAt(Math.round((1 - percentage) * (map.length - 1)));
                signal.receive().then(() => context.fillText(char, posX, posY));
            });
            requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    });
    document.body.append(video);
})();
