
var Generator = (function() {

    var canvas = document.createElement( 'canvas' )
    var context = canvas.getContext( '2d' )

    var settings = {
        
        backgroundColor: {
            type: 'color',
            label: 'Background Color',
            value: '#d9ebee'
        }
    }

    return {

        context: context,

        settings: settings,

        initialize: function( done ) {

            done()
        },

        generate: function( done ) {

            context.fillStyle = settings.backgroundColor.value
            context.fillRect( 0, 0, canvas.width, canvas.height )

            done()
        },

        destroy: function( done ) {

            done()
        }
    }

})();