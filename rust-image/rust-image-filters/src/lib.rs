use wasm_bindgen::prelude::*;
use image::{ImageOutputFormat };
use std::io::Cursor;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, rust-image-filters!");
}

#[wasm_bindgen]
pub fn grayscale(input: &[u8]) -> Vec<u8> {
    let img = image::load_from_memory(input).expect("Error al cargar la imagen");

    let gray_img = img.grayscale();

    let mut buf: Vec<u8> = Vec::new();
    gray_img
        .write_to(&mut Cursor::new(&mut buf), ImageOutputFormat::Png)
        .expect("Error al escribir la imagen");

    buf
}

#[wasm_bindgen]
pub fn invert(input: &[u8]) -> Vec<u8> {
    let mut img = image::load_from_memory(input).expect("Error al cargar la imagen");

    img.invert();

    let mut buf = Vec::new();
    img.write_to(&mut Cursor::new(&mut buf), ImageOutputFormat::Png)
        .expect("Error al escribir la imagen");

    buf
}


#[wasm_bindgen]
pub fn diff_filter(current: &[u8], previous: &[u8]) -> Vec<u8> {
    let len = current.len().min(previous.len());
    let mut result = Vec::with_capacity(len);
    for i in 0..len {
        let diff = (current[i] as i16 - previous[i] as i16).abs() as u8;
        result.push(diff);
    }
    result
}

#[wasm_bindgen]
pub fn to_grayscale(rgba: &[u8]) -> Vec<u8> {
    let mut gray = Vec::with_capacity(rgba.len() / 4);
    for i in (0..rgba.len()).step_by(4) {
        let r = rgba[i] as u16;
        let g = rgba[i + 1] as u16;
        let b = rgba[i + 2] as u16;
        let gray_val = ((r * 299 + g * 587 + b * 114) / 1000) as u8;
        gray.push(gray_val);
    }
    gray
}

#[wasm_bindgen]
pub fn clean_noise(binary: &[u8], width: usize, height: usize) -> Vec<u8> {
    let mut cleaned = binary.to_vec();

    for y in 1..height - 1 {
        for x in 1..width - 1 {
            let idx = y * width + x;
            let mut count = 0u16;

            // revisar vecinos en cruz
            let neighbors = [
                binary[(y - 1) * width + x],
                binary[(y + 1) * width + x],
                binary[y * width + (x - 1)],
                binary[y * width + (x + 1)],
            ];

            for &val in &neighbors {
                if val == 255 {
                    count += 1;
                }
            }

            // umbral de 2 vecinos encendidos
            if count < 2 {
                cleaned[idx] = 0;
            }
        }
    }

    cleaned
}



#[wasm_bindgen]
pub fn threshold(input: &[u8], thresh: u8) -> Vec<u8> {
    input.iter().map(|&v| if v > thresh { 255 } else { 0 }).collect()
}
