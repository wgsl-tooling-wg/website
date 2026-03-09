import lygia::sdf::starSDF::starSDF;

fn star(pos_xy: vec2f, resolution: vec2f) -> f32 {
  let uv = pos_xy / resolution;
  let st = vec2f((uv.x - 0.2) * resolution.x / resolution.y + 0.3, uv.y);
  return starSDF(st, 5, 0.1);
}
