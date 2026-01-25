import package::zoom::mandelbrotZoom;

@group(0) @binding(0) var<uniform> u: test::Uniforms;

@fragment
fn fs_main(@builtin(position) pos: vec4f)
    -> @location(0) vec4f {
  let uv = pos.xy / u.resolution;
  let t = mandelbrotZoom(uv, u.time);
  let c = purple(t);
  return vec4f(c, 1.0);
}

fn purple(t: f32) -> vec3f {
  return vec3f(t * 0.8, t * 0.4, t);
}
