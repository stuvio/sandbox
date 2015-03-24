
/*

    This is an example of a WebGL based generator, built on top of the Three.js library. It shows 
    how to use a rendering context created by a third party library, as well as how to utilize the 
    `studio.env` attribute in order to perform conditional actions based on whether the generator 
    is running on the web, or being used to generate high resolution output for print.

    When the generator is being used to create print ready images (this happens on our servers once 
    a customers has created and purchased a print), the `studio.env` attribute is set to ’print’ as 
    opposed to ‘web’. For WebGL based generators, the drawing buffer must be preserved when in this 
    mode, and so when constructing the WebGL context (in this case via the Three.js WebGLRenderer 
    Class) you must ensure that `preserveDrawingBuffer` is set to `true`

*/

var Generator = (function() {

    var renderer, camera, scene, cube

    return {

        context: null,

        settings: {
            
            rotationX: {
                type: 'number',
                label: 'X Rotation',
                description: 'Rotation of the cube along the x axis',
                range: [ 0, Math.PI * 2 ],
                value: Math.PI * 0.25,
                step: Math.PI / 180
            },
            
            rotationY: {
                type: 'number',
                label: 'Y Rotation',
                description: 'Rotation of the cube along the y axis',
                range: [ 0, Math.PI * 2 ],
                value: Math.PI * 0.25,
                step: Math.PI / 180
            },
            
            rotationZ: {
                type: 'number',
                label: 'Z Rotation',
                description: 'Rotation of the cube along the z axis',
                range: [ 0, Math.PI * 2 ],
                value: 0,
                step: Math.PI / 180
            }
        },

        initialize: function( done ) {

            // normally, you should add and link dependencies from the dependencies directory
            // we're injecting Three.js from a CDN here simply to avoid cluttering index.html
            // for the sake of this example
            var script = document.createElement( 'script' )
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r70/three.min.js'
            document.body.appendChild( script )

            script.onload = function() {

                renderer = new THREE.WebGLRenderer({
                    // we need to preserve the drawing buffer when this generator is being used to output for print
                    preserveDrawingBuffer: stuvio.env === 'print',
                    antialias: true
                })

                camera = new THREE.PerspectiveCamera()
                camera.position.z = 1000
                
                scene = new THREE.Scene()

                cube = new THREE.Mesh( new THREE.BoxGeometry( 200, 200, 200 ), new THREE.MeshNormalMaterial() )
                cube.rotation.x = Math.PI * 0.2
                cube.rotation.y = Math.PI * 0.2
                scene.add( cube )

                // since the context is created by Three, we must add it to the Generator object
                // here since once initialize completes a context is required
                Generator.context = renderer.context

                done()
            }
        },

        generate: function( done ) {

            var width = this.context.canvas.width
            var height = this.context.canvas.height

            cube.rotation.x = this.settings.rotationX.value
            cube.rotation.y = this.settings.rotationY.value
            cube.rotation.z = this.settings.rotationZ.value
            
            camera.aspect = width / height
            camera.updateProjectionMatrix()
            
            renderer.setSize( width, height )
            renderer.render( scene, camera )
            
            done()
        },

        destroy: function( done ) {

            done()
        }
    }

})()