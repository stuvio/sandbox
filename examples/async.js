
/*
    
    This example demonstrates one technique for creating asynchronous generators - ones that, for
    various reasons including performance, might not be able to produce an image in a single frame.

    Here we render a single circle at a regular interval until the desired number of circles have 
    rendered before firing the `done` callback passed to the `generate` method. We also ensure that 
    all queued tasks from the last call to `generate` are cleared so as to ensure to memory or 
    visual leak occurs.

*/

var Generator = (function() {

    var canvas = document.createElement( 'canvas' )
    var context = canvas.getContext( '2d' )
    var counter = 0
    var interval = -1

    var settings = {
        
        numCircles: {
            type: 'number',
            label: 'Circle count',
            range: [ 20, 250 ],
            value: 100,
            step: 1
        }
    }

    function addCircle() {

        // remember to use `stuvio.random` to keep it deterministic!

        var width = context.canvas.width
        var height = context.canvas.height
        var radius = Math.min( width, height ) * stuvio.random.float( 0.01, 0.1 )
        var offset = Math.min( width, height ) * stuvio.random.float( 0.5 ) - radius
        var angle = stuvio.random.float( 0, Math.PI * 2 )

        var x = ( width / 2 ) + Math.cos( angle ) * offset
        var y = ( height / 2 ) + Math.sin( angle ) * offset
        
        var hue = Math.round( stuvio.random.float( 360 ) )
        var sat = Math.round( stuvio.random.float( 30, 100 ) )
        var lum = Math.round( stuvio.random.float( 30, 90 ) )

        context.beginPath()
        context.arc( x, y, radius, 0, Math.PI * 2 )
        context.fillStyle = 'hsla(' + hue + ',' + sat + '%,' + lum + '%,0.8)'
        context.fill()
    }

    return {

        context: context,

        settings: settings,

        initialize: function( done ) {

            done()
        },

        generate: function( done ) {

            clearInterval( interval )

            context.fillStyle = '#ddd'
            context.fillRect( 0, 0, context.canvas.width, context.canvas.height )

            counter = 0

            interval = setInterval( function() {

                if ( counter++ < settings.numCircles.value ) {

                    addCircle()

                } else {

                    clearInterval( interval )
                    done()
                }

            }, 10 )
        },

        destroy: function( done ) {

            done()
        }
    }

})();