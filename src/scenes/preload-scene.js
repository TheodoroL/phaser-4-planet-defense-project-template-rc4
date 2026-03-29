import { SCENE_KEYS } from '../common/scene-keys.js';
import Phaser from '../lib/phaser.js';
import { IMAGE_ASSETS, AUDIO_ASSETS, SPRITESHEET_ASSETS } from '../common/assets.js';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({
      key: SCENE_KEYS.PRELOAD_SCENE,
    });
  }
  //carregamento dos assets
  preload() {
    IMAGE_ASSETS.forEach((assets) => {
      this.load.image(assets.assetKey, assets.path);
    });
    // carregamento dos audios
    AUDIO_ASSETS.forEach((assets) => {
      this.load.audio(assets.assetKey, assets.path);
    });

    // carregamento dos spritesheets
    SPRITESHEET_ASSETS.forEach((assets) => {
      this.load.spritesheet(assets.assetKey, assets.path, {
        // definindo o tamanho de cada frame do spritesheet
        frameWidth: assets.frameWidth,
        frameHeight: assets.frameHeight,
      });
    });
  }

  create() {
    console.log('preload scene');
    // criando as animações a partir dos spritesheets
    SPRITESHEET_ASSETS.forEach((assets) => {
      this.anims.create({
        key: assets.assetKey,
        frames: this.anims.generateFrameNames(assets.assetKey),
        frameRate: assets.frameRate,
        repeat: assets.repeat,
      });
    });

    this.scene.start(SCENE_KEYS.GAME_SCENE);
  }
}
