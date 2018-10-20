/**
 * Defines a physics material.
 * @class Material
 * @constructor
 * @param {object} [options]
 * @author schteppe
 */
export class Material {
  static idCounter = 0;

  name: string;
  id: number;
  friction: number;
  restitution: number;

  constructor(options: any = {}) {
    options = Object.assign({
      name: '',
      friction: -1,
      restitution: -1
    }, options);

    // Backwards compatibility fix
    // if (typeof (options) === 'string') {
    //   name = options;
    //   options = {};
    // } else if (typeof (options) === 'object') {
    //   name = '';
    // }

    /**
     * @property name
     * @type {String}
     */
    this.name = options.name;

    /**
     * material id.
     * @property id
     * @type {number}
     */
    this.id = Material.idCounter++;

    /**
     * Friction for this material. If non-negative, it will be used instead of
     * the friction given by ContactMaterials. If there's no matching ContactMaterial,
     * the value from .defaultContactMaterial in the World will be used.
     * @property {number} friction
     */
    this.friction = options.friction;

    /**
     * Restitution for this material. If non-negative, it will be used instead of
     * the restitution given by ContactMaterials. If there's no matching ContactMaterial,
     * the value from .defaultContactMaterial in the World will be used.
     * @property {number} restitution
     */
    this.restitution = options.restitution;
  }
}
