alias Complex = vec2f;

fn mandelbrot_uv(uv: vec2f) -> f32 {
  let c = vec2f(uv.x * 3.5 - 2.5, uv.y * 2.0 - 1.0);
  return mandelbrot(c);
}

fn mandelbrot(c: Complex) -> f32 {
  var z = vec2f(0.0);
  var count = 0u;
  for (var i = 0u; i < 200u; i = i + 1u) {
    if (length(z) > 2.0) { break; }
    z = vec2f(
      z.x * z.x - z.y * z.y + c.x, 
      2.0 * z.x * z.y + c.y
    );
    count = count + 1u;
  }
  return f32(count) / 200.0;
}
