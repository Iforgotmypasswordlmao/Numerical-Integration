const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")

let x_scale = 50
let y_scale = 10
const canvas_height = canvas.height
const canvas_width = canvas.width

function math_func(x)
{
    return Math.pow(x, 3)
}

function monte_carlo_integration(a, b, func, {iterations=1000})
{
    let Points_Below_Func = 0
    let Points_Above_Func = 0
    const Point_Radius = 3

    for (let i = 0; i < iterations; i++)
    {
        const rand_x = a + (Math.random()*(b-a))
        const rand_y = Math.random()*func(b)
        context.beginPath()
        if (rand_y <= func(rand_x))
        {
            context.fillStyle = "#34eb64"
            Points_Below_Func += 1
        }
        else
        {
            context.fillStyle = "#4c60f5"
            Points_Above_Func += 1
        } 
        // -- DRAW POINTS --
        context.arc(rand_x*x_scale, canvas_height - rand_y*y_scale, Point_Radius, 0, 2*Math.PI)
        context.fill()
    }
    return func(b)*b*(Points_Below_Func) / (Points_Above_Func + Points_Below_Func)
}

function trapezoid_integration(a, b, func, {steps=10})
{
    const step_x = (b-a)/steps
    context.fillStyle = "rgba(250, 212, 61, 0.4)"
    let area_sum = func(a)

    for (let x = a; x <= b; x += step_x)
    {
        const y = func(x)
        const is_not_a_or_b = !(x != a ) ^ (x != b)
        if (is_not_a_or_b)
        {
            area_sum += y
        }
        else
        {
            area_sum += 0.5*y
        }

        // -- DRAW TRAPEZOID --
        const Scaled_X = x*x_scale
        const Scaled_Y = canvas_height - y*y_scale
        const Scaled_Next_X = (x + step_x)*x_scale
        const Scaled_Next_Y = canvas_height - func(x + step_x)*y_scale
        context.beginPath()
        context.moveTo(Scaled_X, Scaled_Y)
        context.lineTo(Scaled_X, canvas_height)
        context.lineTo(Scaled_Next_X, canvas_height)
        context.lineTo(Scaled_Next_X, Scaled_Next_Y)
        context.lineTo(Scaled_X, Scaled_Y)
        context.fill()
    }
    return area_sum
}

function main()
{
    const a = 0
    const b = 10
    const steps = 100
    const jump_interval = (b-a)/steps
    // -- SET GRAPH SCALES --
    x_scale = canvas_width/(b-a)
    y_scale = canvas_height/math_func(b)
    // -- GRAPHING FUNCTION --
    context.beginPath()
    context.moveTo(a*x_scale, math_func(a)*y_scale)
    for (let i = a; i < b; i += jump_interval)
    {
        context.lineTo(i*x_scale, canvas_height - math_func(i)*y_scale)
    }
    context.stroke()

    const monte_carlo_area = monte_carlo_integration(a, b, math_func, {})
    const trapezoid_area = trapezoid_integration(a, b, math_func, {})
    console.log(`Monte Carlo: ${monte_carlo_area}, Trapezoid: ${trapezoid_area}`)

}

window.onload = () => {
    main()
}