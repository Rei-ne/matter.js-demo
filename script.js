
const { Engine, Render, Bodies, World, MouseConstraint, Composites, Query } = Matter

const sectionTag = document.querySelector("section.shapes");

//width and height of the page
let w = window.innerWidth
let h = window.innerHeight

const engine = Engine.create();

const renderer = Render.create({
    element: sectionTag,
    engine: engine,
    options: {
        width: w,
        height: h,
        background: "#000000",
        wireframes: false,
        pixelRatio: window.devicePixelRatio

    }
});


const createShape = function (x, y) {
    return Bodies.circle(x, y, 30, {
        frictionAir: 0.2,
        render: {


            fillStyle: "blue",
            yScale: 0.5,
            xScale: 0.5,


        }
    });
}


//Create a Static Element
const smileyFace = Bodies.circle(w / 2, h / 2, Math.min(w / 4, h / 4), {
    isStatic: true,
    render: {
        sprite: {
            texture: "https://i.ibb.co/X4tm54x/smiley.png",
            visible: true
        }


    }

});

// Create a wall for the shapes to bounce off
const wallOptions = {
    isStatic: true,
    render: {
        visible: true
    }
}

const ground = Bodies.rectangle(w / 2, h + 50, w + 100, 100, wallOptions)
const ceiling = Bodies.rectangle(w / 2, -50, w + 100, 100, wallOptions)
const leftWall = Bodies.rectangle(-50, h / 2, 100, h + 100, wallOptions)
const rightWall = Bodies.rectangle(w + 50, h / 2, 100, h + 100, wallOptions)


const mouseControl = MouseConstraint.create(engine, {
    element: sectionTag,
    constraint: {
        render: {
            visible: false
        }
    }
})

const intialShapes = Composites.stack(50, 50, 15, 5, 40, 40, function (x, y) {
    return createShape(x, y)
})

World.add(engine.world, [
    smileyFace,
    ground,
    ceiling,
    leftWall,
    rightWall,
    mouseControl,
    intialShapes
]);


document.addEventListener("click", function (event) {

    const shape = createShape(event.pageX, event.pageY)
    intialShapes.bodies.push(shape)
    World.add(engine.world, shape)
})

//when we move our mouse check matter for collions
//does the mouse touch the body
document.addEventListener("mousemove", function (event) {
    const vector = { x: event.pageX, y: event.pageY };
    const hoveredShapes = Query.point(intialShapes.bodies, vector)

    //console.log("hoveredShapes")

    hoveredShapes.forEach(shape => {
        shape.render.sprite = null
        shape.render.fillStyle = "yellow"
    })

})


Engine.run(engine);
Render.run(renderer);

window.addEventListener("resize", function () {

})


// Add Gravity

let time = 0
const changeGravity = function () {
    time = time + 0.01


    engine.world.gravity.x = Math.sin(time)
    engine.world.gravity.y = Math.cos(time)

    requestAnimationFrame(changeGravity)
}

changeGravity()


//Change gravity based on device orientation
/*
window.addEventListener("deviceorientation", function(event){
  engine.world.gravity.x = event.gamma
  engine.world.gravity.y = event.beta
})
*/

