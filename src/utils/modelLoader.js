// src/utils/modelLoader.js
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as THREE from "three";

export class ModelLoader {
  constructor() {
    this.gltfLoader = new GLTFLoader();
    this.fbxLoader = new FBXLoader();
    this.fileLoader = new THREE.FileLoader();
    this.textureLoader = new THREE.TextureLoader();
  }

  async load(modelPath) {
    const isGlb = modelPath.endsWith(".glb");
    const isFbx = modelPath.endsWith(".fbx");

    try {
      if (isGlb) {
        return await this.loadGLTF(modelPath);
      } else if (isFbx) {
        return await this.loadFBX(modelPath);
      }
    } catch (error) {
      console.error(`Error loading model: ${modelPath}`, error);
      throw error;
    }
  }

  loadGLTF(path) {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        path,
        (gltf) => resolve({ scene: gltf.scene, type: "glb" }),
        undefined,
        reject
      );
    });
  }

  loadFBX(path) {
    return new Promise((resolve, reject) => {
      this.fileLoader.setResponseType("arraybuffer");
      this.fileLoader.load(
        path,
        (buffer) => {
          try {
            const fbxModel = this.fbxLoader.parse(buffer, "");
            resolve({ scene: fbxModel, type: "fbx" });
          } catch (fbxError) {
            // If parsing fails, try alternative approach
            this.fbxLoader.load(
              path,
              (model) => resolve({ scene: model, type: "fbx" }),
              undefined,
              reject
            );
          }
        },
        undefined,
        reject
      );
    });
  }
}
