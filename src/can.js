import * as three from 'three'
import { outerTrackRadius } from './rendermap';
import { innerTrackRadius } from './rendermap';
import { arcCenterX } from './rendermap';

export function Can() {
    
    const can = new three.Group();
    
    const down = new three.Mesh(
        new three.BoxGeometry(7.5,15,15),
        new three.MeshLambertMaterial({ color: 0xa52523 })
    );

    down.position.x = 0;
    down.position.y = 0;
    down.position.z = 0;

    can.add(down);
    
    const up = new three.Mesh(
        new three.BoxGeometry(5,9,9),
        new three.MeshLambertMaterial({ color: 0xa52523 })
    );

    up.position.x = 2;
    up.position.y = 0;
    up.position.z = 6;

    can.add(up);

    return can;

}

export function get_can(can) {
    let can_x = (Math.random() * (2*arcCenterX)) - arcCenterX;

    var select = Math.floor(Math.random() * 2);
    
    let can_y;
    if (select == 0)
        can_y = (Math.random() * (outerTrackRadius - innerTrackRadius) + innerTrackRadius);
    else
        can_y = -(Math.random() * (outerTrackRadius - innerTrackRadius) + innerTrackRadius);
    
    let can_z = 8;
    // can_y = 200;
    // can_x = 60;

    can.position.x = can_x;
    can.position.y = can_y;
    can.position.z = can_z;
}

export function gen_cans(cans) {

    // for (var i = 0; i < 10000; i++)
    // {
        cans = Can();
        get_can(cans);
    // }

}


