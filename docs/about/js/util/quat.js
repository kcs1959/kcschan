const rad2deg = 57.29578;
const deg2rad = 0.01745329;

function quat_fromAxisAngle(axis, angle) {
    var res = quat.create();
    quat.setAxisAngle(res, axis, deg2rad * angle);
    return res;
}

function quat_vec(q, v) {
        var u = vec3.fromValues(q[0], q[1], q[2]);
        var s = q[3];
    
        var a = vec3_mulf(u, vec3.dot(u, v))
        var b = vec3_mulf(v, (s * s - vec3.dot(u, u)))
        var c = vec3_mulf(vec3_mulf(vec3_cross(u, v), s), 2);
		var res = vec3_add(vec3_add(a, b), c);
		vec3.normalize(res, res);
		return res;
}

function quat_lookAt(tarr, up) {
    var tar = vec3_normalized(tarr);
    var fw = vec3.fromValues(0, 0, 1);
	var q1 = quat.create();
	if (tar[2] > 0.999) { //no rotation required
		;
	}
	else if (tar[2] < -0.999) { //inverse
		quat.setAxisAngle(q1, vec3.fromValues(0, 1, 0), deg2rad * 180);
	}
	else {
		var axis = vec3_cross(tar, fw);
		vec3.normalize(axis, axis);
		var angle = Math.acos(clamp(vec3.dot(tar, fw), -1.0, 1.0));
		var tr = vec3_cross(axis, fw);
		if (vec3.dot(tr, tar) < 0) angle *= -1;
		quat.setAxisAngle(q1, axis, angle);
	}

	var mup = quat_vec(q1, vec3.fromValues(0, 1, 0));
	var mrt = quat_vec(q1, vec3.fromValues(1, 0, 0));
	var rt = vec3_cross(up, tar);
	vec3.normalize(rt, rt);
	var angle2 = rad2deg*Math.acos(clamp(vec3.dot(mrt, rt), -1.0, 1.0));
	if (vec3.dot(mup, rt) < 0) angle2 *= -1;
	var q2 = quat_fromAxisAngle(tar, angle2);
	if (Math.abs(angle2) < 0.000001) quat.identity(q2);

	var rot = quat.create();
	quat.mul(rot, q2, q1);
	if (isNaN(rot[0]) || isNaN(rot[1]) || isNaN(rot[2]) || isNaN(rot[3])) {
		quat.identity(rot);
	}

	return rot;
}

function quat_tostring(v) {
    return '(' + v[3].toFixed(3) + ',' + v[0].toFixed(3) + ',' + v[1].toFixed(3) + ',' + v[2].toFixed(3) + ')';
}