fn palette(uv: vec2f, time: f32) -> vec3f {
  let d = length(uv - 0.5);
  let t = d * 3.0 + time * 0.15;
  return vec3f(
    0.2 + 0.2 * cos(t + 0.5),
    0.15 + 0.2 * cos(t + 1.5),
    0.35 + 0.25 * cos(t + 2.5),
  );
}
