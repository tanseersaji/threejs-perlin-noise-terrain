uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;

attribute vec3 position;
attribute float aRandom;

varying float vRandom;

void main(){

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    modelPosition.y += aRandom * 1.5;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position += projectionPosition;
    vRandom = aRandom;
}