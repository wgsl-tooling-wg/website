import package::graphics::mandelbrot;

const start = vec2f(-0.75, 0.0);
const startSize = vec2f(3.5, 2.0);
const end = vec2f(-0.7453, 0.1127);

fn mandelbrotZoom(uv: vec2f, time: f32) -> f32 {
  let z = exp(time * 0.3);
  let center = end + (start - end) / z;
  let size = startSize / z;
  let c = center + (uv - 0.5) * size;
  return mandelbrot(c);
}
