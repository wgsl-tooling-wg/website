import test::Uniforms;
@group(0) @binding(0) var<uniform> u: Uniforms;

@fragment
fn fs_main(@builtin(position) pos: vec4f) -> @location(0) vec4f {
  let uv = pos.xy / u.resolution;
  return vec4f(uv, 0.5 + 0.5 * sin(u.time), 1.0);
}
