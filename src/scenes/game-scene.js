import { SCENE_KEYS } from '../common/scene-keys.js';
import Phaser from '../lib/phaser.js';
import { ASSET_KEYS } from '../common/assets.js';
export class GameScene extends Phaser.Scene {
  #planet;
  #player;
  // variável para armazenar o ângulo de rotação do player
  #playerAngleInRadians;
  #cursorKeys;
  // variável para armazenar as teclas A e D para controlar a rotação do player
  #wasdKeys;
  // variável para armazenar o grupo de balas
  #bulletGroup;
  // variável para armazenar o tempo do último disparo da bala, para limitar a taxa de disparo
  #lastBulletFireTime;

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

    // criando um grupo para as balas
    this.#bulletGroup = this.physics.add.group([]);
    this.#lastBulletFireTime = 0;

    this.#cursorKeys = this.input.keyboard.createCursorKeys();

    // adicionando as teclas A e D para controlar a rotação do player
    this.#wasdKeys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }

  update(time) {
    if (this.#cursorKeys.left.isDown || this.#wasdKeys.left.isDown) {
      this.#playerAngleInRadians -= 0.06;
    } else if (this.#cursorKeys.right.isDown || this.#wasdKeys.right.isDown) {
      this.#playerAngleInRadians += 0.06;
    }
    this.#updatePlayerPosition();

    if (Phaser.Input.Keyboard.JustDown(this.#cursorKeys.space) && time > this.#lastBulletFireTime + 200) {
      this.#fireBullet();
      this.#lastBulletFireTime = time;
    }

    this.#bulletGroup.getChildren().forEach((bullet) => {
      if (
        bullet.active &&
        (bullet.x < 0 || bullet.x > this.scale.width || bullet.y < 0 || bullet.y > this.scale.height)
      ) {
        // desativando e escondendo a bala quando ela sair da tela para reutilizá-la posteriormente
        bullet.setActive(false);
        bullet.setVisible(false);
      }
    });
  }

  #updatePlayerPosition() {
    // calculando a posição do player com base no ângulo de rotação e na posição do planeta
    const x = this.scale.width / 2 + (this.#planet.displayHeight / 2) * Math.cos(this.#playerAngleInRadians);
    const y = this.scale.height / 2 + (this.#planet.displayHeight / 2) * Math.sin(this.#playerAngleInRadians);
    this.#player.setPosition(x, y);

    // definindo a rotação do player para que ele fique sempre apontando para fora do planeta, adicionando 90 graus (Math.PI / 2) para corrigir a orientação da imagem do player
    this.#player.rotation = this.#playerAngleInRadians + Math.PI / 2;
  }

  // função para criar uma bala e adicioná-la ao grupo de balas
  #fireBullet() {
    const x = this.#player.x;
    const y = this.#player.y;
    // calculando a velocidade da bala com base no ângulo de rotação do player
    const angleInDegrees = Phaser.Math.RadToDeg(this.#playerAngleInRadians);

    const speed = this.physics.velocityFromAngle(angleInDegrees, 400);

    // pegando a primeira bala morta do grupo de balas para reutilizá-la
    const bullet = this.#bulletGroup.getFirstDead(true, x, y, ASSET_KEYS.BULLET, 0, true);

    // ativando, mostrando e configurando a bala para ser reutilizada, definindo a animação da bala e habilitando o corpo físico para que ela possa colidir com outros objetos
    bullet.setActive(true).setVisible(true).setScale(1.5).play(ASSET_KEYS.BULLET).enableBody();

    bullet.setVelocity(speed.x, speed.y);
    bullet.setRotation(this.#player.rotation);

    console.log('fire bullet', this.#bulletGroup.getChildren().length);
  }
}
