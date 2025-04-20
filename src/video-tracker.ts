import init, {
  to_grayscale,
  diff_filter,
  threshold,
  clean_noise,
} from '../rust-image/rust-image-filters/pkg/rust_image_filters.js';

await init();

const videoInput = document.getElementById('video-input') as HTMLInputElement;
const video = document.getElementById('video') as HTMLVideoElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const thresholdSlider = document.getElementById('threshold-range') as HTMLInputElement;
const thresholdLabel = document.getElementById('threshold-value') as HTMLSpanElement;
const restartButton = document.getElementById('restart-button') as HTMLButtonElement;

let previousGray: Uint8Array | null = null;
let trackingInterval: ReturnType<typeof setInterval> | null = null;

function trackFrame() {
  if (trackingInterval !== null) {
    clearInterval(trackingInterval);
  }

  trackingInterval = setInterval(() => {
    if (video.paused || video.ended) {
      clearInterval(trackingInterval!);
      trackingInterval = null;
      return;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const currentGray = to_grayscale(new Uint8Array(frame.data.buffer));

    if (!previousGray) {
      previousGray = new Uint8Array(currentGray);
      return;
    }

    const diff = diff_filter(currentGray, previousGray);
    const thresholdValue = parseInt(thresholdSlider?.value || '40');
    thresholdLabel.textContent = `${thresholdValue}`;
    const rawBinary = threshold(diff, thresholdValue);
    const binary = clean_noise(rawBinary, canvas.width, canvas.height);

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < binary.length; i++) {
      const val = binary[i];
      imageData.data[i * 4 + 0] = val;
      imageData.data[i * 4 + 1] = val;
      imageData.data[i * 4 + 2] = val;
      imageData.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);

    previousGray.set(currentGray);
  }, 100);
}

// Cuando se carga un nuevo video
videoInput.addEventListener('change', () => {
  const file = videoInput.files?.[0];
  if (!file) return;

  previousGray = null;
  video.pause();
  video.src = URL.createObjectURL(file);

  video.onloadeddata = () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    video.currentTime = 0;
    video.play();
    trackFrame();
  };
});

// Botón de reinicio de análisis
restartButton?.addEventListener('click', () => {
  if (!video.src) return;

  video.pause();
  previousGray = null;
  video.currentTime = 0;
  video.play();
  trackFrame();
});

// Cambiar entre modo imagen y modo video
document.getElementById('mode-image')?.addEventListener('click', () => {
  document.getElementById('image-controls')!.style.display = 'flex';
  document.getElementById('image-view')!.style.display = 'flex';

  document.getElementById('video-controls')!.style.display = 'none';
  document.getElementById('video-view')!.style.display = 'none';
});

document.getElementById('mode-video')?.addEventListener('click', () => {
  document.getElementById('image-controls')!.style.display = 'none';
  document.getElementById('image-view')!.style.display = 'none';

  document.getElementById('video-controls')!.style.display = 'flex';
  document.getElementById('video-view')!.style.display = 'flex';
});
