var canvas = new fabric.Canvas('c', {
    hoverCursor: 'pointer',
    selection: false,
    perPixelTargetFind: true,
    targetFindTolerance: 5
})

var WIDTH = 800
var HEIGHT = 400
var radiusList = [350, 300, 250, 200, 150]
var circleList = []
var ballList = []

radiusList.forEach(function(r) {
    var circle = new fabric.Circle({
        radius: r,
        fill: '#333',
        stroke: 'rgb(0, 192, 255)',
        strokeWidth: 2,
        left: WIDTH / 2 - r,
        top: HEIGHT - r
    })
    circle.selectable = false
    circleList.push(circle)

    var r1 = Math.max(Math.random() * 10, 5)
    var ball = new fabric.Circle({
        radius: r1,
        fill: 'red',
        strokeWidth: 0,
        left: WIDTH / 2 - r - r1,
        top: HEIGHT - r1 * 2,
        selectable: false
    })
    ball.__r = r
    ball.__r1 = r1
    ballList.push(ball)

    canvas.add(circle)
    canvas.add(ball)
})

var start = 0
var end = 180
var current = 0

function animate() {
    if (current === 180) {
        start = 180
        end = 0
    } else {
        start = 0
        end = 180
    }

    fabric.util.animate({
        startValue: start,
        endValue: end,
        duration: 3000,
        // 线性移动
        easing: function(t, b, c, d) {return c*t/d + b},
        onChange: function(angle) {
            current = angle
            angle = fabric.util.degreesToRadians(angle)
            var deltaX = Math.cos(angle)
            var deltaY = Math.sin(angle)
            var isOverCenter = angle > 90

            ballList.forEach(function(ball) {
                var left = isOverCenter ? WIDTH / 2 + deltaX * ball.__r  + ball.__r1 :
                    (WIDTH / 2 - deltaX * ball.__r - ball.__r1)
                var top = HEIGHT - deltaY * ball.__r - ball.__r1
                ball.set({
                    left: left,
                    top: top
                })
            })

            canvas.renderAll()
        },
        onComplete: animate
    })
}

animate()








