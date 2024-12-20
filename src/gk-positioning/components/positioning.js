import * as d3 from 'npm:d3'

export function formatFloat(digit) {
    return d3.format(`.${digit}f`)
}

export function distance(a, b) {
    return ((a.x - b.x) ** 2 + (a.y - b.y) ** 2) ** (1/2)
}

export function isShotPossible(ball, goal, threshold) {
    // return ball.x < 34 - 16.5 - 3.66 || ball.x > 34 + 16.5 + 3.66 || ball.y < 52.5 - 16.5
    return distance(ball, goal) < threshold
}

export function getGKPosition(ball, goal, magnitude = 1) {
    // 楕円の長径と短径
    let a = 3.66 * magnitude; // 長径 // 逆では？ 実装上は関係なさそうだけど
    let b = 5.5 * magnitude; // 短径

    if (!isShotPossible(ball, goal, 30)) {
        return { x: 5.5, y: 34 }; // GK should be at the center of the longer edge of the goal area
    }


    // ボールの位置とゴールの間の直線の傾きと切片を計算する関数
    function calculateLine(ball, goal) {
        let slope = (ball.y - goal.y) / (ball.x - goal.x);
        let intercept = ball.y - slope * ball.x;

        return { slope, intercept };
    }

    // 楕円上の点を求める関数
    function findPointOnEllipse(slope, intercept, a, b) {
        // 楕円の方程式： ((x-h)^2/a^2) + ((y-k)^2/b^2) = 1
        // ここで、(h,k)は楕円の中心 (ゴールの位置)
        // 直線の方程式： y = slope * x + intercept
        // これらを組み合わせて、交点を求めます。

        if (slope === Infinity || slope === -Infinity) {
        // When the slope is undefined, the x value of the point on the ellipse is known (=goal.x), and the y value needs to be calculated.
        let y1 =
            Math.sqrt(b ** 2 * (1 - (ball.x - goal.x) ** 2 / a ** 2)) + goal.y;
        let y2 = -y1

        if (Math.abs(ball.y - y1) < Math.abs(ball.y - y2)) {
            return { x: goal.x, y: y1 };
        } else {
            return { x: goal.x, y: y2 };
        }
        }

        // Usual Case
        // 楕円と直線の交点を計算する二次方程式の係数を求めます。
        let A = 1 / a ** 2 + slope ** 2 / b ** 2;
        let B = (2 * slope * (intercept - goal.y)) / b ** 2 - (2 * goal.x) / a ** 2;
        let C = goal.x ** 2 / a ** 2 + (intercept - goal.y) ** 2 / b ** 2 - 1;
        // 二次方程式の解（x座標）を求めます。
        let x1 = (-B + Math.sqrt(B ** 2 - 4 * A * C)) / (2 * A);
        let x2 = (-B - Math.sqrt(B ** 2 - 4 * A * C)) / (2 * A);

        // x座標に対応するy座標を求めます。
        let y1 = slope * x1 + intercept;
        let y2 = slope * x2 + intercept;

        // ボールに近い解を選択します。
        if (Math.abs(ball.x - x1) < Math.abs(ball.x - x2)) {
        return { x: x1, y: y1 };
        } else {
        return { x: x2, y: y2 };
        }
    }

    let line = calculateLine(ball, goal);
    let gkPosition = findPointOnEllipse(line.slope, line.intercept, a, b);
    return gkPosition;
}