precision mediump float;

varying float vRandom;

#include <fog_pars_fragment>

void main() {
    gl_FragColor = vec4(0.8, vRandom - 0.1, 1.0, 1.0);

    #include <fog_fragment>
}