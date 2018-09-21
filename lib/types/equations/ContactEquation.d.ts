import { Equation } from './Equation';
import { Vec3 } from '../math/Vec3';
import { Body } from '../objects/Body';
export declare class ContactEquation extends Equation {
    restitution: number;
    ri: Vec3;
    rj: Vec3;
    ni: Vec3;
    constructor(bodyA: Body, bodyB: Body, maxForce?: number);
    private ContactEquation_computeB_temp1;
    private ContactEquation_computeB_temp2;
    private ContactEquation_computeB_temp3;
    computeB(h: number): number;
    private ContactEquation_getImpactVelocityAlongNormal_vi;
    private ContactEquation_getImpactVelocityAlongNormal_vj;
    private ContactEquation_getImpactVelocityAlongNormal_xi;
    private ContactEquation_getImpactVelocityAlongNormal_xj;
    private ContactEquation_getImpactVelocityAlongNormal_relVel;
    getImpactVelocityAlongNormal(): number;
}
