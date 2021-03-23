precision mediump float;

varying float vRandom;

#include <fog_pars_fragment>

void main() {

    gl_FragColor = vec4(0.3, vRandom / 2.0 , 0.5, 1.0);

    #include <fog_fragment>
}