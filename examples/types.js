
/*
    
    This is the kitchen sink example, showing all of the current input types

*/

var Generator = (function() {

    var canvas = document.createElement( 'canvas' )
    var context = canvas.getContext( '2d' )

    var settings = {

        exampleColor: {
            type: 'color',
            label: 'Color',
            description: 'Example color input',
            value: '#4DECB4'
        },

        exampleImage: {
            type: 'image',
            label: 'Image',
            description: 'Example image input',
            value: new Image()
        },

        exampleNumber: {
            type: 'number',
            label: 'Number',
            description: 'Example number input',
            range: [ 0.1, 1.0 ],
            value: 0.5,
            step: 0.01
        },

        exampleRange: {
            type: 'number',
            label: 'Range',
            description: 'Example range input',
            range: [ 0.0, 1.0 ],
            value: [ 0.1, 0.9 ],
            step: 0.01
        },

        exampleBoolean: {
            type: 'boolean',
            label: 'Boolean',
            description: 'Example boolean input',
            value: true
        },

        exampleAudio: {
            type: 'audio',
            label: 'Audio',
            description: 'Example audio input',
            interval: 1 / 20,   // interval (in seconds) between samples (1 / samplesPerSecond)
            duration: [ 1, 3 ], // min / max duration in seconds
            bands: 64,          // number of bands per sample
            value: null
        }
    }

    return {

        context: context,

        settings: settings,

        initialize: function( done ) {

            // load assets before declaring the generator ready...
            settings.exampleImage.value.src = 'assets/logo.png'
            settings.exampleImage.value.onload = done
        },

        generate: function( done ) {

            // use color

            context.fillStyle = settings.exampleColor.value
            context.fillRect( 0, 0, canvas.width, canvas.height )

            // use audio and range

            var audioData = settings.exampleAudio.value

            if ( audioData && audioData.length ) {

                var slices = audioData.length
                var bands = settings.exampleAudio.bands
                
                var xMin = canvas.width * settings.exampleRange.value[0]
                var xMax = canvas.width * settings.exampleRange.value[1]
                
                var yStep = canvas.height / ( audioData.length + 1 )
                var xStep = ( xMax - xMin ) / bands

                var slice, band, data

                context.save()
                context.translate( xMin, 0 )
                context.beginPath()

                for ( slice = 0; slice < slices; slice++ ) {
                    
                    data = audioData[ slice ]

                    context.translate( 0, yStep )

                    for ( band = 0; band < bands; band++ ) {

                        if ( band === 0 ) {
                            
                            context.moveTo( band * xStep, ( data[ band ] / 255 ) * yStep * -2.0 )

                        } else {

                            context.lineTo( band * xStep, ( data[ band ] / 255 ) * yStep * -2.0 )
                        }
                        
                    }
                }

                context.strokeStyle = '#111'
                context.lineWidth = 1
                context.lineJoin = 'round'
                context.lineCap = 'round'
                context.stroke()
                context.restore()
            }

            // use image, number and boolean

            if ( settings.exampleBoolean.value ) {

                var texture = settings.exampleImage.value
                var aspect = texture.height / texture.width
                var sideA = Math.min( canvas.width, canvas.height )
                var sideB = Math.max( texture.width, texture.height )
                var scale = settings.exampleNumber.value * ( sideA / sideB )

                context.save()
                context.translate( canvas.width / 2, canvas.height / 2 )
                context.scale( scale, scale )
                context.translate( texture.width / -2, texture.height / -2 )
                context.drawImage( texture, 0, 0 )
                context.restore()
            }


            // all present and correct

            done()
        },

        destroy: function( done ) {

            done()
        }
    }

})();