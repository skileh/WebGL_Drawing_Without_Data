'use strict';
const vs = `
attribute float vertexId;
uniform float numVerts;
uniform float time;
uniform float freq;
varying lowp vec4 v_color;
uniform mat4 u_matrix;

// hash function from https://www.shadertoy.com/view/4djSRW
// given a value between 0 and 1
// returns a value between 0 and 1 that *appears* kind of random
float hash(float p) {
  vec2 p2 = fract(vec2(p * 5.3983, p * 5.4427));
  p2 += dot(p2.yx, p2.xy + vec2(21.5351, 14.3137));
  return fract(p2.x * p2.y * 95.4337);
}


vec3 hsv2rgb(vec3 c) {
  c = vec3(c.x, clamp(c.yz, 0.0, 1.0));
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}


#define PI 3.141
void main() {
  float d = hash(vertexId * 0.8);
  float atenue = (freq/10.)+1.;

  float u = vertexId / numVerts;          // goes from 0 to 1
  float x = hash(u);          // random position
  float y = fract((50.+time/5.) * u) * PI * -2.0; 
  
  if(vertexId<=(numVerts/40.0)){
    float circleX = x*sin(-y)*.15;
    float circleY = cos(y)*sin(x)*.15;
    gl_Position = u_matrix *vec4(atenue*circleX ,atenue*circleY,1, 1);
    gl_PointSize =mix(1.5,3., (freq - d));
   
  }else if (vertexId<=(numVerts/20.0)){
    float circleX = x*sin(-y)*.25;
    float circleY = cos(y)*sin(x)*.35;
    gl_Position = u_matrix *vec4(atenue*circleX ,atenue*circleY,1, 1);
    gl_PointSize =mix(1.5,3., (freq - d));
    
  }else if (vertexId<=(numVerts/10.0)){
    float circleX = x*sin(-y)*1.3;
    float circleY = cos(y)*sin(x)*1.5;
    gl_Position = u_matrix *vec4(atenue*circleX ,atenue*circleY,1, 1);
    gl_PointSize =mix(1.5,3., (freq - d));
   
  }else{
    float circleX = x*sin(y)*1.3;
    float circleY = cos(y)*sin(x)*1.5;
    gl_Position = u_matrix *vec4(circleX ,circleY,1, 1);
    gl_PointSize =mix(.5, 2., (1. - d));
    
  }
  float hue = mix(0.4, 2., freq);
  float sat = 0.7;
  float val = mix(.5, 3., freq);

  v_color = vec4(hsv2rgb(vec3(hue,sat,val)), pow(1.-d, 0.2));

}
`;

const fs = `
precision mediump float;
varying lowp vec4 v_color;

void main() {

    gl_FragColor = v_color;
 
  

}
`;


const initializeWorld = () => {
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }
  twgl.setAttributePrefix("a_");
  const meshProgramInfo = twgl.createProgramInfo(gl, [
    vs,
    fs,
  ]);

  return {
    gl,
    meshProgramInfo,
  };
};