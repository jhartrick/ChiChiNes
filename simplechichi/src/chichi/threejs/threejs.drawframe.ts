import * as THREE from 'three';
import { Wishbone } from '../wishbone/wishbone';
import { basicEncoder } from './basicEncoder';


export const drawFrameWebGL = (renderer: THREE.WebGLRenderer, listener: THREE.AudioListener) =>  (wishbone: Wishbone): () => void =>  {
    
    const vbuffer = wishbone.vbuffer;
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.add(listener);
    const scene = new THREE.Scene();
    const encoder = basicEncoder();
    // const encoder = new NTSCEncoder(this.nesService);

    const geometry = new THREE.PlaneGeometry(5, 5);
    const material = encoder(<Uint8Array>vbuffer);
    scene.add(new THREE.Mesh(geometry, material.material));
    camera.position.z = 5.8;

    return  () => {
        material.text.needsUpdate = true;
        renderer.render(scene, camera);
    };
};
