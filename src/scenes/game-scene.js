import { SCENE_KEYS } from '../common/scene-keys.js';
import Phaser from '../lib/phaser.js';
import { ASSET_KEYS } from '../common/assets.js';
export class GameScene extends Phaser.Scene {
  #planet;
  #player;
  // variável para armazenar o ângulo de rotação do player
  #playerAngleInRadians;
  #cursorKeys;
  #wasdKeys;
  constructor() {
    super({
      key: SCENE_KEYS.GAME_SCENE,
    });
  }

  create() {
    console.log('game scene');
    // adicionando o background e fazendo a animação de fundo
    for (let i = 1; i < 4; i++) {
      this.add
        .sprite(0, 0, ASSET_KEYS[`BACKGROUND_${i}`], 0)
        .setOrigin(0)
        .setScale(1, 1.35)
        .play(ASSET_KEYS[`BACKGROUND_${i}`])
        .setAlpha(0.4);
    }

    // adicionando o planeta ao centro da tela e fazendo a animação de rotação
    this.#planet = this.add
      .sprite(this.scale.width / 2, this.scale.height / 2, ASSET_KEYS.PLANET, 0)
      .play(ASSET_KEYS.PLANET);

    this.#player = this.add.image(0, 0, ASSET_KEYS.SHIP);
    this.#playerAngleInRadians = 0;
    this.#updatePlayerPosition();
    this.#cursorKeys = this.input.keyboard.createCursorKeys();

    // adicionando as teclas A e D para controlar a rotação do player
    this.#wasdKeys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }

  update() {
    if (this.#cursorKeys.left.isDown || this.#wasdKeys.left.isDown) {
      this.#playerAngleInRadians -= 0.06;
    } else if (this.#cursorKeys.right.isDown || this.#wasdKeys.right.isDown) {
      this.#playerAngleInRadians += 0.06;
    }
    this.#updatePlayerPosition();
  }

  #updatePlayerPosition() {
    // calculando a posição do player com base no ângulo de rotação e na posição do planeta
    const x = this.scale.width / 2 + (this.#planet.displayHeight / 2) * Math.cos(this.#playerAngleInRadians);
    const y = this.scale.height / 2 + (this.#planet.displayHeight / 2) * Math.sin(this.#playerAngleInRadians);
    this.#player.setPosition(x, y);
    this.#player.rotation = this.#playerAngleInRadians + Math.PI / 2;
  }
}
