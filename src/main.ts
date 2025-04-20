import { saveImagePair, getImagePair, getAllKeys } from './db';
import init, { grayscale, invert } from '../rust-image/rust-image-filters/pkg/rust_image_filters.js';
import './video-tracker';

// Function to request notification permission
async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notifications.');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  console.warn('Notification permission has been denied.');
  return false;
}

// Function to show a simple notification with an icon
function showNotification(title: string, body: string) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/icon.png'
    });
  } else {
    console.log('Notification permission not granted.');
  }
}

// Function to simulate a random delay between minSeconds and maxSeconds
function sleep(minSeconds: number, maxSeconds: number): Promise<void> {
  const ms = (Math.random() * (maxSeconds - minSeconds) + minSeconds) * 1000;
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  await init();

  const input = document.getElementById('image-input') as HTMLInputElement;
  const originalImg = document.getElementById('original') as HTMLImageElement;
  const filteredImg = document.getElementById('filtered') as HTMLImageElement;
  const applyBtn = document.getElementById('apply-filter') as HTMLButtonElement;
  const filterSelect = document.getElementById('filter-select') as HTMLSelectElement;
  const loadBtn = document.getElementById('load-last') as HTMLButtonElement;
  const loadingIndicator = document.getElementById('loading-indicator') as HTMLDivElement;

  let imageBuffer: Uint8Array | null = null;
  let originalBlob: Blob | null = null;

  // Load image
  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    imageBuffer = new Uint8Array(arrayBuffer);
    originalBlob = new Blob([arrayBuffer], { type: file.type });

    originalImg.src = URL.createObjectURL(originalBlob);
    filteredImg.src = '';
  });

  // Apply filter
  applyBtn.addEventListener('click', async () => {
    if (!imageBuffer || !originalBlob) return;

    // Request notification permission before showing any notification
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission && Notification.permission === 'denied') {
      console.warn('Notification permission was denied.');
    }

    // Show loading indicator and disable button
    applyBtn.disabled = true;
    loadingIndicator.style.display = 'flex';
    filteredImg.style.opacity = '0.5';
    console.log('Starting filter application...');

    // Simulate a filter application delay
    const selected = filterSelect.value;
    let result: Uint8Array;

    if (selected === 'grayscale') {
      result = grayscale(imageBuffer);
    } else {
      result = invert(imageBuffer);
    }

    // Wait between 2 and 5 seconds artificially
    await sleep(2, 5);

    // Display the filtered image
    const filteredBlob = new Blob([result], { type: 'image/png' });
    filteredImg.src = URL.createObjectURL(filteredBlob);

    // Save both images in IndexedDB
    const key = `img-${Date.now()}`;
    await saveImagePair(key, {
      original: originalBlob,
      filtered: filteredBlob,
    });

    // Hide loading indicator and restore opacity
    loadingIndicator.style.display = 'none';
    filteredImg.style.opacity = '1';

    // Show a notification when the filter is ready
    showNotification('Filtro aplicado!', `'${selected}' ha sido aplicado exitosamente.`);

    // Re-enable the button
    applyBtn.disabled = false;
  });

  // Load the last saved image
  loadBtn?.addEventListener('click', async () => {
    const keys = await getAllKeys();
    if (keys.length === 0) {
      alert('No images saved.');
      return;
    }
  
    const lastKey = keys[keys.length - 1];
    const pair = await getImagePair(lastKey);
    if (!pair) return;
  
    // Convert the original Blob to ArrayBuffer and then to Uint8Array
    const arrayBuffer = await pair.original.arrayBuffer();
    imageBuffer = new Uint8Array(arrayBuffer);
    originalBlob = pair.original;
  
    // Set the images in the <img> elements
    originalImg.src = URL.createObjectURL(pair.original);
    filteredImg.src = URL.createObjectURL(pair.filtered);
  
    console.log('Loaded the last saved image and updated imageBuffer/originalBlob.');
  });
}

run();

// Registrar Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/wasm-image-pwa/sw.js')
      .then((registration) => {
        console.log('Service Worker registrado con éxito:', registration);
      })
      .catch((error) => {
        console.log('Error al registrar el Service Worker:', error);
      });
  });
}

const modeImageBtn = document.getElementById('mode-image') as HTMLButtonElement;
const modeVideoBtn = document.getElementById('mode-video') as HTMLButtonElement;

const imageElements = [
  document.getElementById('image-input'),
  document.getElementById('original'),
  document.getElementById('filtered'),
  document.getElementById('apply-filter'),
  document.getElementById('filter-select'),
  document.getElementById('load-last'),
  document.getElementById('loading-indicator'),
];

const videoInput = document.getElementById('video-input')!;
const video = document.getElementById('video')!;
const canvas = document.getElementById('canvas')!;

modeImageBtn.addEventListener('click', () => {
  imageElements.forEach(el => el && (el.style.display = ''));
  videoInput.style.display = 'none';
  video.style.display = 'none';
  canvas.style.display = 'none';
});

modeVideoBtn.addEventListener('click', () => {
  imageElements.forEach(el => el && (el.style.display = 'none'));
  videoInput.style.display = '';
  video.style.display = '';
  canvas.style.display = '';
});
