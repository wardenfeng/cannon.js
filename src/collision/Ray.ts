import { Vec3 } from '../math/Vec3';
import { RaycastResult } from './RaycastResult';
import { Quaternion } from '../math/Quaternion';
import { Shape } from '../shapes/Shape';
import { AABB } from './AABB';
import { Transform } from '../math/Transform';
import { Box } from '../shapes/Box';
import { Plane } from '../shapes/Plane';
import { Sphere } from '../shapes/Sphere';
import { ConvexPolyhedron } from '../shapes/ConvexPolyhedron';
import { Body } from '../objects/Body';
import { World } from '../world/World';

/**
 * A line in 3D space that intersects bodies and return points.
 * @class Ray
 * @constructor
 * @param {Vec3} from
 * @param {Vec3} to
 */
export class Ray {
  static CLOSEST = 1;
  static ANY = 2;
  static ALL = 4;

  from: Vec3;
  to: Vec3;

  precision: number;
  _direction: Vec3;
  checkCollisionResponse: boolean;
  skipBackfaces: boolean;

  collisionFilterMask: number;
  collisionFilterGroup: number;

  mode: number;

  result: RaycastResult;
  hasHit: boolean;
  callback: Function;

  constructor(from?: Vec3, to?: Vec3) {
    /**
     * @property {Vec3} from
     */
    this.from = from ? from.clone() : new Vec3();

    /**
     * @property {Vec3} to
     */
    this.to = to ? to.clone() : new Vec3();

    /**
     * @private
     * @property {Vec3} _direction
     */
    this._direction = new Vec3();

    /**
     * The precision of the ray. Used when checking parallelity etc.
     * @property {Number} precision
     */
    this.precision = 0.0001;

    /**
     * Set to true if you want the Ray to take .collisionResponse flags into account on bodies and shapes.
     * @property {Boolean} checkCollisionResponse
     */
    this.checkCollisionResponse = true;

    /**
     * If set to true, the ray skips any hits with normal.dot(rayDirection) < 0.
     * @property {Boolean} skipBackfaces
     */
    this.skipBackfaces = false;

    /**
     * @property {number} collisionFilterMask
     * @default -1
     */
    this.collisionFilterMask = -1;

    /**
     * @property {number} collisionFilterGroup
     * @default -1
     */
    this.collisionFilterGroup = -1;

    /**
     * The intersection mode. Should be Ray.ANY, Ray.ALL or Ray.CLOSEST.
     * @property {number} mode
     */
    this.mode = Ray.ANY;

    /**
     * Current result object.
     * @property {RaycastResult} result
     */
    this.result = new RaycastResult();

    /**
     * Will be set to true during intersectWorld() if the ray hit anything.
     * @property {Boolean} hasHit
     */
    this.hasHit = false;

    /**
     * Current, user-provided result callback. Will be used if mode is Ray.ALL.
     * @property {Function} callback
     */
    this.callback = (result: RaycastResult) => { };
  }

  private tmpAABB = new AABB();
  private tmpArray: Body[] = [];
  /**
   * Do itersection against all bodies in the given World.
   * @method intersectWorld
   * @param  {World} world
   * @param  {object} options
   * @return {Boolean} True if the ray hit anything, otherwise false.
   */
  intersectWorld(world: World, options: any) {
    this.mode = options.mode || Ray.ANY;
    this.result = options.result || new RaycastResult();
    this.skipBackfaces = !!options.skipBackfaces;
    this.collisionFilterMask = typeof (options.collisionFilterMask) !== 'undefined' ? options.collisionFilterMask : -1;
    this.collisionFilterGroup = typeof (options.collisionFilterGroup) !== 'undefined' ? options.collisionFilterGroup : -1;
    if (options.from) {
      this.from.copy(options.from);
    }
    if (options.to) {
      this.to.copy(options.to);
    }
    this.callback = options.callback || (() => {});
    this.hasHit = false;

    this.result.reset();
    this.updateDirection();

    this.getAABB(this.tmpAABB);
    this.tmpArray.length = 0;
    world.broadphase.aabbQuery(world, this.tmpAABB, this.tmpArray);
    this.intersectBodies(this.tmpArray);

    return this.hasHit;
  }

  private v1 = new Vec3();
  private v2 = new Vec3();
  /*
   * As per "Barycentric Technique" as named here http://www.blackpawn.com/texts/pointinpoly/default.html But without the division
   */
  // Ray.pointInTriangle = pointInTriangle;
  static pointInTriangle(p: Vec3, a: Vec3, b: Vec3, c: Vec3) {
    const v0 = new Vec3();
    const v1 = new Vec3();
    const v2 = new Vec3();

    c.vsub(a, v0);
    b.vsub(a, v1);
    p.vsub(a, v2);

    const dot00 = v0.dot(v0);
    const dot01 = v0.dot(v1);
    const dot02 = v0.dot(v2);
    const dot11 = v1.dot(v1);
    const dot12 = v1.dot(v2);

    let u, v;

    return ((u = dot11 * dot02 - dot01 * dot12) >= 0) &&
      ((v = dot00 * dot12 - dot01 * dot02) >= 0) &&
      (u + v < (dot00 * dot11 - dot01 * dot01));
  }

  private intersectBody_xi = new Vec3();
  private intersectBody_qi = new Quaternion();
  /**
   * Shoot a ray at a body, get back information about the hit.
   * @method intersectBody
   * @private
   * @param {Body} body
   * @param {RaycastResult} [result] Deprecated - set the result property of the Ray instead.
   */
  intersectBody(body: Body, result?: RaycastResult) {
    if (result) {
      this.result = result;
      this.updateDirection();
    }
    const checkCollisionResponse = this.checkCollisionResponse;

    if (checkCollisionResponse && !body.collisionResponse) {
      return;
    }

    if ((this.collisionFilterGroup & body.collisionFilterMask) === 0 || (body.collisionFilterGroup & this.collisionFilterMask) === 0) {
      return;
    }

    const xi = this.intersectBody_xi;
    const qi = this.intersectBody_qi;

    for (let i = 0, N = body.shapes.length; i < N; i++) {
      const shape = body.shapes[i];

      if (checkCollisionResponse && !shape.collisionResponse) {
        continue; // Skip
      }

      body.quaternion.mult(body.shapeOrientations[i], qi);
      body.quaternion.vmult(body.shapeOffsets[i], xi);
      xi.vadd(body.position, xi);

      this.intersectShape(
        shape,
        qi,
        xi,
        body
      );

      if (this.result._shouldStop) {
        break;
      }
    }
  }

  /**
   * @method intersectBodies
   * @param {Array} bodies An array of Body objects.
   * @param {RaycastResult} [result] Deprecated
   */
  intersectBodies(bodies: Body[], result?: RaycastResult) {
    if (result) {
      this.result = result;
      this.updateDirection();
    }

    for (let i = 0, l = bodies.length; !this.result._shouldStop && i < l; i++) {
      this.intersectBody(bodies[i]);
    }
  }

  /**
   * Updates the _direction vector.
   * @private
   * @method updateDirection
   */
  private updateDirection() {
    this.to.vsub(this.from, this._direction);
    this._direction.normalize();
  }

  /**
   * @method intersectShape
   * @private
   * @param {Shape} shape
   * @param {Quaternion} quat
   * @param {Vec3} position
   * @param {Body} body
   */
  intersectShape(shape: Shape, quat: Quaternion, position: Vec3, body: Body) {
    const from = this.from;

    // Checking boundingSphere
    const distance = this.distanceFromIntersection(from, this._direction, position);
    if (distance > shape.boundingSphereRadius) {
      return;
    }

    switch (shape.type) {
      case Shape.types.CONVEXPOLYHEDRON:
        this.intersectConvex(<ConvexPolyhedron>shape, quat, position, body, shape);
      break;
      case Shape.types.BOX:
        this.intersectBox(<Box>shape, quat, position, body, shape);
      break;
      case Shape.types.SPHERE:
        this.intersectSphere(<Sphere>shape, quat, position, body, shape);
      break;
    }
    // var intersectMethod = this[shape.type];
    // if (intersectMethod) {
    //   intersectMethod.call(this, shape, quat, position, body, shape);
    // }
  }

  vector = new Vec3();
  normal = new Vec3();
  intersectPoint = new Vec3();

  a = new Vec3();
  b = new Vec3();
  c = new Vec3();
  d = new Vec3();

  tmpRaycastResult = new RaycastResult();

  /**
   * @method intersectBox
   * @private
   * @param  {Shape} shape
   * @param  {Quaternion} quat
   * @param  {Vec3} position
   * @param  {Body} body
   */
  intersectBox(shape: Box, quat: Quaternion, position: Vec3, body: Body, reportedShape: Shape) {
    return this.intersectConvex(shape.convexPolyhedronRepresentation, quat, position, body, reportedShape);
  }
  // Ray.prototype[Shape.types.BOX] = intersectBox;

  /**
   * @method intersectPlane
   * @private
   * @param  {Shape} shape
   * @param  {Quaternion} quat
   * @param  {Vec3} position
   * @param  {Body} body
   */
  intersectPlane(shape: Plane, quat: Quaternion, position: Vec3, body: Body, reportedShape: Shape) {
    const from = this.from;
    const to = this.to;
    const direction = this._direction;

    // Get plane normal
    const worldNormal = new Vec3(0, 0, 1);
    quat.vmult(worldNormal, worldNormal);

    const len = new Vec3();
    from.vsub(position, len);
    const planeToFrom = len.dot(worldNormal);
    to.vsub(position, len);
    const planeToTo = len.dot(worldNormal);

    if (planeToFrom * planeToTo > 0) {
      // "from" and "to" are on the same side of the plane... bail out
      return;
    }

    if (from.distanceTo(to) < planeToFrom) {
      return;
    }

    const n_dot_dir = worldNormal.dot(direction);

    if (Math.abs(n_dot_dir) < this.precision) {
      // No intersection
      return;
    }

    const planePointToFrom = new Vec3();
    const dir_scaled_with_t = new Vec3();
    const hitPointWorld = new Vec3();

    from.vsub(position, planePointToFrom);
    const t = -worldNormal.dot(planePointToFrom) / n_dot_dir;
    direction.scale(t, dir_scaled_with_t);
    from.vadd(dir_scaled_with_t, hitPointWorld);

    this.reportIntersection(worldNormal, hitPointWorld, reportedShape, body, -1);
  }
  // Ray.prototype[Shape.types.PLANE] = intersectPlane;

  /**
   * Get the world AABB of the ray.
   * @method getAABB
   * @param  {AABB} aabb
   */
  getAABB(result: AABB) {
    const to = this.to;
    const from = this.from;
    result.lowerBound.x = Math.min(to.x, from.x);
    result.lowerBound.y = Math.min(to.y, from.y);
    result.lowerBound.z = Math.min(to.z, from.z);
    result.upperBound.x = Math.max(to.x, from.x);
    result.upperBound.y = Math.max(to.y, from.y);
    result.upperBound.z = Math.max(to.z, from.z);
  }

  // private intersectConvexOptions = {
  //   faceList: [0]
  // };
  // private worldPillarOffset = new Vec3();
  // private intersectHeightfield_localRay = new Ray();
  // private intersectHeightfield_index: any[] = [];
  // private intersectHeightfield_minMax: any[] = [];
  /**
   * @method intersectHeightfield
   * @private
   * @param  {Shape} shape
   * @param  {Quaternion} quat
   * @param  {Vec3} position
   * @param  {Body} body
   */
  // intersectHeightfield(shape: Shape, quat: Quaternion, position: Vec3, body: Body, reportedShape: Shape) {
  //   // var data = shape.data;
  //   // var w = shape.elementSize;

  //   // Convert the ray to local heightfield coordinates
  //   var localRay = this.intersectHeightfield_localRay; //new Ray(this.from, this.to);
  //   localRay.from.copy(this.from);
  //   localRay.to.copy(this.to);
  //   Transform.pointToLocalFrame(position, quat, localRay.from, localRay.from);
  //   Transform.pointToLocalFrame(position, quat, localRay.to, localRay.to);
  //   localRay.updateDirection();

  //   // Get the index of the data points to test against
  //   var index = this.intersectHeightfield_index;
  //   var iMinX, iMinY, iMaxX, iMaxY;

  //   // Set to max
  //   iMinX = iMinY = 0;
  //   iMaxX = iMaxY = shape.data.length - 1;

  //   var aabb = new AABB();
  //   localRay.getAABB(aabb);

  //   shape.getIndexOfPosition(aabb.lowerBound.x, aabb.lowerBound.y, index, true);
  //   iMinX = Math.max(iMinX, index[0]);
  //   iMinY = Math.max(iMinY, index[1]);
  //   shape.getIndexOfPosition(aabb.upperBound.x, aabb.upperBound.y, index, true);
  //   iMaxX = Math.min(iMaxX, index[0] + 1);
  //   iMaxY = Math.min(iMaxY, index[1] + 1);

  //   for (var i = iMinX; i < iMaxX; i++) {
  //     for (var j = iMinY; j < iMaxY; j++) {

  //       if (this.result._shouldStop) {
  //         return;
  //       }

  //       shape.getAabbAtIndex(i, j, aabb);
  //       if (!aabb.overlapsRay(localRay)) {
  //         continue;
  //       }

  //       // Lower triangle
  //       shape.getConvexTrianglePillar(i, j, false);
  //       Transform.pointToWorldFrame(position, quat, shape.pillarOffset, worldPillarOffset);
  //       this.intersectConvex(shape.pillarConvex, quat, worldPillarOffset, body, reportedShape, intersectConvexOptions);

  //       if (this.result._shouldStop) {
  //         return;
  //       }

  //       // Upper triangle
  //       shape.getConvexTrianglePillar(i, j, true);
  //       Transform.pointToWorldFrame(position, quat, shape.pillarOffset, worldPillarOffset);
  //       this.intersectConvex(shape.pillarConvex, quat, worldPillarOffset, body, reportedShape, intersectConvexOptions);
  //     }
  //   }
  // };
  // Ray.prototype[Shape.types.HEIGHTFIELD] = intersectHeightfield;

  private Ray_intersectSphere_intersectionPoint = new Vec3();
  private Ray_intersectSphere_normal = new Vec3();
  /**
   * @method intersectSphere
   * @private
   * @param  {Shape} shape
   * @param  {Quaternion} quat
   * @param  {Vec3} position
   * @param  {Body} body
   */
  intersectSphere(shape: Sphere, quat: Quaternion, position: Vec3, body: Body, reportedShape: Shape) {
    const from = this.from;
    const to = this.to;
    const r = shape.radius;

    const a = Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2) + Math.pow(to.z - from.z, 2);
    const b = 2 * ((to.x - from.x) * (from.x - position.x)
      + (to.y - from.y) * (from.y - position.y) + (to.z - from.z) * (from.z - position.z));
    const c = Math.pow(from.x - position.x, 2) + Math.pow(from.y - position.y, 2) + Math.pow(from.z - position.z, 2) - Math.pow(r, 2);

    const delta = Math.pow(b, 2) - 4 * a * c;

    const intersectionPoint = this.Ray_intersectSphere_intersectionPoint;
    const normal = this.Ray_intersectSphere_normal;

    if (delta < 0) {
      // No intersection
      return;

    } else if (delta === 0) {
      // single intersection point
      from.lerp(to, delta, intersectionPoint);

      intersectionPoint.vsub(position, normal);
      normal.normalize();

      this.reportIntersection(normal, intersectionPoint, reportedShape, body, -1);

    } else {
      const d1 = (- b - Math.sqrt(delta)) / (2 * a);
      const d2 = (- b + Math.sqrt(delta)) / (2 * a);

      if (d1 >= 0 && d1 <= 1) {
        from.lerp(to, d1, intersectionPoint);
        intersectionPoint.vsub(position, normal);
        normal.normalize();
        this.reportIntersection(normal, intersectionPoint, reportedShape, body, -1);
      }

      if (this.result._shouldStop) {
        return;
      }

      if (d2 >= 0 && d2 <= 1) {
        from.lerp(to, d2, intersectionPoint);
        intersectionPoint.vsub(position, normal);
        normal.normalize();
        this.reportIntersection(normal, intersectionPoint, reportedShape, body, -1);
      }
    }
  }
  // Ray.prototype[Shape.types.SPHERE] = intersectSphere;

  private intersectConvex_normal = new Vec3();
  private intersectConvex_minDistNormal = new Vec3();
  private intersectConvex_minDistIntersect = new Vec3();
  private intersectConvex_vector = new Vec3();
  /**
   * @method intersectConvex
   * @private
   * @param  {Shape} shape
   * @param  {Quaternion} quat
   * @param  {Vec3} position
   * @param  {Body} body
   * @param {object} [options]
   * @param {array} [options.faceList]
   */
  intersectConvex(
    shape: ConvexPolyhedron,
    quat: Quaternion,
    position: Vec3,
    body: Body,
    reportedShape: Shape,
    options?: any
  ) {
    const minDistNormal = this.intersectConvex_minDistNormal;
    const normal = this.intersectConvex_normal;
    const vector = this.intersectConvex_vector;
    const minDistIntersect = this.intersectConvex_minDistIntersect;
    const faceList = (options && options.faceList) || null;

    // Checking faces
    const faces = shape.faces;
    const vertices = shape.vertices;
    const normals = shape.faceNormals;
    const direction = this._direction;

    const from = this.from;
    const to = this.to;
    const fromToDistance = from.distanceTo(to);

    const minDist = -1;
    const Nfaces = faceList ? faceList.length : faces.length;
    const result = this.result;

    for (let j = 0; !result._shouldStop && j < Nfaces; j++) {
      const fi = faceList ? faceList[j] : j;

      const face = faces[fi];
      const faceNormal = normals[fi];
      const q = quat;
      const x = position;

      // determine if ray intersects the plane of the face
      // note: this works regardless of the direction of the face normal

      // Get plane point in world coordinates...
      vector.copy(vertices[face[0]]);
      q.vmult(vector, vector);
      vector.vadd(x, vector);

      // ...but make it relative to the ray from. We'll fix this later.
      vector.vsub(from, vector);

      // Get plane normal
      q.vmult(faceNormal, normal);

      // If this dot product is negative, we have something interesting
      const dot = direction.dot(normal);

      // Bail out if ray and plane are parallel
      if (Math.abs(dot) < this.precision) {
        continue;
      }

      // calc distance to plane
      const scalar = normal.dot(vector) / dot;

      // if negative distance, then plane is behind ray
      if (scalar < 0) {
        continue;
      }

      // if (dot < 0) {

      // Intersection point is from + direction * scalar
      direction.mult(scalar, this.intersectPoint);
      this.intersectPoint.vadd(from, this.intersectPoint);

      // a is the point we compare points b and c with.
      this.a.copy(vertices[face[0]]);
      q.vmult(this.a, this.a);
      x.vadd(this.a, this.a);

      for (let i = 1; !result._shouldStop && i < face.length - 1; i++) {
        // Transform 3 vertices to world coords
        this.b.copy(vertices[face[i]]);
        this.c.copy(vertices[face[i + 1]]);
        q.vmult(this.b, this.b);
        q.vmult(this.c, this.c);
        x.vadd(this.b, this.b);
        x.vadd(this.c, this.c);

        const distance = this.intersectPoint.distanceTo(from);

        if (!(Ray.pointInTriangle(this.intersectPoint, this.a, this.b, this.c)
          || Ray.pointInTriangle(this.intersectPoint, this.b, this.a, this.c))
          || distance > fromToDistance) {
          continue;
        }

        this.reportIntersection(normal, this.intersectPoint, reportedShape, body, fi);
      }
      // }
    }
  }
  // Ray.prototype[Shape.types.CONVEXPOLYHEDRON] = intersectConvex;

  // private intersectTrimesh_normal = new Vec3();
  // private intersectTrimesh_localDirection = new Vec3();
  // private intersectTrimesh_localFrom = new Vec3();
  // private intersectTrimesh_localTo = new Vec3();
  // private intersectTrimesh_worldNormal = new Vec3();
  // private intersectTrimesh_worldIntersectPoint = new Vec3();
  // private intersectTrimesh_localAABB = new AABB();
  // private intersectTrimesh_triangles: any[] = [];
  // private intersectTrimesh_treeTransform = new Transform();
  /**
   * @method intersectTrimesh
   * @private
   * @param  {Shape} shape
   * @param  {Quaternion} quat
   * @param  {Vec3} position
   * @param  {Body} body
   * @param {object} [options]
   * @todo Optimize by transforming the world to local space first.
   * @todo Use Octree lookup
   */
  // intersectTrimesh(
  //   mesh: Shape,
  //   quat: Quaternion,
  //   position: Vec3,
  //   body: Body,
  //   reportedShape: Shape,
  //   options: any
  // ) {
  //   var normal = this.intersectTrimesh_normal;
  //   var triangles = this.intersectTrimesh_triangles;
  //   var treeTransform = this.intersectTrimesh_treeTransform;
  //   var minDistNormal = this.intersectConvex_minDistNormal;
  //   var vector = this.intersectConvex_vector;
  //   var minDistIntersect = this.intersectConvex_minDistIntersect;
  //   var localAABB = this.intersectTrimesh_localAABB;
  //   var localDirection = this.intersectTrimesh_localDirection;
  //   var localFrom = this.intersectTrimesh_localFrom;
  //   var localTo = this.intersectTrimesh_localTo;
  //   var worldIntersectPoint = this.intersectTrimesh_worldIntersectPoint;
  //   var worldNormal = this.intersectTrimesh_worldNormal;
  //   var faceList = (options && options.faceList) || null;

  //   // Checking faces
  //   var indices = mesh.indices;
  //   var vertices = mesh.vertices;
  //   var normals = mesh.faceNormals;

  //   var from = this.from;
  //   var to = this.to;
  //   var direction = this._direction;

  //   var minDist = -1;
  //   treeTransform.position.copy(position);
  //   treeTransform.quaternion.copy(quat);

  //   // Transform ray to local space!
  //   Transform.vectorToLocalFrame(position, quat, direction, localDirection);
  //   Transform.pointToLocalFrame(position, quat, from, localFrom);
  //   Transform.pointToLocalFrame(position, quat, to, localTo);

  //   localTo.x *= mesh.scale.x;
  //   localTo.y *= mesh.scale.y;
  //   localTo.z *= mesh.scale.z;
  //   localFrom.x *= mesh.scale.x;
  //   localFrom.y *= mesh.scale.y;
  //   localFrom.z *= mesh.scale.z;

  //   localTo.vsub(localFrom, localDirection);
  //   localDirection.normalize();

  //   var fromToDistanceSquared = localFrom.distanceSquared(localTo);

  //   mesh.tree.rayQuery(this, treeTransform, triangles);

  //   for (var i = 0, N = triangles.length; !this.result._shouldStop && i !== N; i++) {
  //     var trianglesIndex = triangles[i];

  //     mesh.getNormal(trianglesIndex, normal);

  //     // determine if ray intersects the plane of the face
  //     // note: this works regardless of the direction of the face normal

  //     // Get plane point in world coordinates...
  //     mesh.getVertex(indices[trianglesIndex * 3], a);

  //     // ...but make it relative to the ray from. We'll fix this later.
  //     this.a.vsub(localFrom, vector);

  //     // If this dot product is negative, we have something interesting
  //     var dot = localDirection.dot(normal);

  //     // Bail out if ray and plane are parallel
  //     // if (Math.abs( dot ) < this.precision){
  //     //     continue;
  //     // }

  //     // calc distance to plane
  //     var scalar = normal.dot(vector) / dot;

  //     // if negative distance, then plane is behind ray
  //     if (scalar < 0) {
  //       continue;
  //     }

  //     // Intersection point is from + direction * scalar
  //     localDirection.scale(scalar, this.intersectPoint);
  //     this.intersectPoint.vadd(localFrom, this.intersectPoint);

  //     // Get triangle vertices
  //     mesh.getVertex(indices[trianglesIndex * 3 + 1], this.b);
  //     mesh.getVertex(indices[trianglesIndex * 3 + 2], this.c);

  //     var squaredDistance = this.intersectPoint.distanceSquared(localFrom);

  //     if (!(Ray.pointInTriangle(this.intersectPoint, this.b, this.a, this.c)
  //          || Ray.pointInTriangle(this.intersectPoint, this.a, this.b, this.c))
  //          || squaredDistance > fromToDistanceSquared) {
  //       continue;
  //     }

  //     // transform intersectpoint and normal to world
  //     Transform.vectorToWorldFrame(quat, normal, worldNormal);
  //     Transform.pointToWorldFrame(position, quat, this.intersectPoint, worldIntersectPoint);
  //     this.reportIntersection(worldNormal, worldIntersectPoint, reportedShape, body, trianglesIndex);
  //   }
  //   triangles.length = 0;
  // };
  // Ray.prototype[Shape.types.TRIMESH] = intersectTrimesh;

  /**
   * @method reportIntersection
   * @private
   * @param  {Vec3} normal
   * @param  {Vec3} hitPointWorld
   * @param  {Shape} shape
   * @param  {Body} body
   * @return {boolean} True if the intersections should continue
   */
  reportIntersection(normal: Vec3, hitPointWorld: Vec3, shape: Shape, body: Body, hitFaceIndex: number) {
    const from = this.from;
    const to = this.to;
    const distance = from.distanceTo(hitPointWorld);
    const result = this.result;

    // Skip back faces?
    if (this.skipBackfaces && normal.dot(this._direction) > 0) {
      return;
    }

    result.hitFaceIndex = typeof (hitFaceIndex) !== 'undefined' ? hitFaceIndex : -1;

    switch (this.mode) {
      case Ray.ALL:
        this.hasHit = true;
        result.set(
          from,
          to,
          normal,
          hitPointWorld,
          shape,
          body,
          distance
        );
        result.hasHit = true;
        this.callback(result);
        break;

      case Ray.CLOSEST:

        // Store if closer than current closest
        if (distance < result.distance || !result.hasHit) {
          this.hasHit = true;
          result.hasHit = true;
          result.set(
            from,
            to,
            normal,
            hitPointWorld,
            shape,
            body,
            distance
          );
        }
        break;

      case Ray.ANY:

        // Report and stop.
        this.hasHit = true;
        result.hasHit = true;
        result.set(
          from,
          to,
          normal,
          hitPointWorld,
          shape,
          body,
          distance
        );
        result._shouldStop = true;
        break;
    }
  }

  v0 = new Vec3();
  intersect = new Vec3();
  distanceFromIntersection(from: Vec3, direction: Vec3, position: Vec3): number {
    // v0 is vector from from to position
    position.vsub(from, this.v0);
    const dot = this.v0.dot(direction);

    // intersect = direction*dot + from
    direction.mult(dot, this.intersect);
    this.intersect.vadd(from, this.intersect);

    const distance = position.distanceTo(this.intersect);

    return distance;
  }
}
