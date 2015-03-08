# Generator Sandbox

You can use this sandbox to develop generative art applications (_Generators_) which can be embedded on [Stuvio](http://stuv.io) and used by customers to create unique art prints.

  - [Getting started](#getting-started)
  - [Creating a Generator](#creating-a-generator)
  - [Defining User Configurable Settings](#defining-user-configurable-settings)
  - [Using Randomness](#using-randomness)
  - [Dimensions](#dimensions)
  - [Sharing your Generator](#sharing-your-generator)

## Getting started

To get going, clone this repository and point a local web server (such as [http-server](https://github.com/nodeapps/http-server) or [SimpleHTTPServer](https://docs.python.org/2/library/simplehttpserver.html#module-SimpleHTTPServer) at it.

    git clone https://github.com/stuvio/sandbox.git
    cd sandbox
    http-server

## Creating a Generator

There are several [examples](examples/) available to illustrate how to create different types of Generator (to run them, modify [index.html](index.html) to link to the desired script in the examples directory.) You can structure your code however you want and make use of any third party libraries you need. To make your Generator compatible with Stuvio, you must simply expose a variable named `Generator` with the following signature:

    var Generator = {
        context: {},
        settings: { ... },
        initialize: function( done ) {},
        generate: function( done ) {},
        destroy: function( done ) {}
    }

The `Generator` object is the interface through which Stuvio can talk to your application. The `context` will generally be an instance of `CanvasRenderingContext2D` or `WebGLRenderingContext` and can be `null` to begin with, but must be populated by the time your generator has finished initializing. The `initialize`, `generate` and `destroy` methods are all passed a callback as the first parameter and you _must_ call this once you've performed all the tasks you need to for that method (see the [async example](examples/async.js) for clarification.)

The [generator.json](generator.json) manifest is where you should name and describe your Generator and provide information about you and any collaborators, since this information is used on the website to label your work.

You should perhaps think of a Generator somewhat differently to how you might a regular interactive application, at least with respect to how state works. Essentially, all state information that your Generator needs should be held in the `settings` property and before you fire the `done` callback passed to the `generate` method, an image representing that state should have been produced. This enables us to automate the process of generating the final print that a customer will receive, since all that is saved when they place an order is a preview image and a JSON object containing the settings used to produce that image. It is crucial therefore to ensure that given the same settings and a single call to `generate`, your Generator can faithfully reproduce the same image every time. See [Using Randomness](#using-randomness) for a guide to using deterministic random values.

## Defining User Configurable Settings

Try to be somewhat conservative with what you choose to expose to the user. Some people can be intimidated by a huge stack of controls and so it's always a good idea to consider how you might consolidate what could be several related variables within your Generator code into a single input (or fewer inputs) for the user. This can be tricky to do from a conceptual point of view, if not a technical one, but from testing with users who are fans of art and design but don't necessarily frequent sites like [Chrome Experiments](https://www.chromeexperiments.com/), a `funkiness` slider, for example, is much more fun to play with than 12 separate sliders controlling all of the variables that contribute to the _funkiness_!

For the properties that you do wish to expose through the `settings` object, the sandbox and website will automatically create a user interface for you - all you have to do is describe each property so that the interface can be constructed optimally. Here are the currently supported data types and the fields you should provide for them, but please [create an issue](https://github.com/stuvio/sandbox/issues) if you need other types or different functionality. You can also run the [types example](examples/types.js) for a demonstration.

### Number

    propName: {
        type: 'number',
        label: 'The number',
        description: 'An example number',
        range: [ 5, 15 ],
        value: 10,
        step: 0.5
    }

### Range

    propName: {
        type: 'number',
        label: 'The range',
        description: 'An example range',
        range: [ 0.0, 1.0 ],
        value: [ 0.1, 0.9 ],
        step: 0.01
    }
    
### Boolean

    propName: {
        type: 'boolean',
        label: 'The boolean',
        description: 'An example boolean',
        value: true
    }
    
### String

    propName: {
        type: 'string',
        label: 'The string',
        description: 'An example string',
        value: 'Hello World'
    }
    
### Image

    propName: {
        type: 'image',
        label: 'The image',
        description: 'An example image',
        value: new Image()
    }
    
### Color

    propName: {
        type: 'color',
        label: 'The color',
        description: 'An example color',
        value: '#4DECB4'
    }

### Audio

    propName: {
        type: 'audio',
        label: 'The audio',
        description: 'An example sound',
        // interval (in seconds) between samples (1 / samples-per-second)
        interval: 1 / 20,
        // min / max duration in seconds
        duration: [ 1, 10 ],
        // number of bands per sample
        bands: 64,
        value: null
    }

## Using Randomness

If you want to use pseudo-random numbers in your Generator, make sure you keep it deterministic. This is because the output from your Generator must be reproducible - creating the same image from the same settings in a predictable manner.

In order to do this, we provide you with a seeded random number generator, which you can access from the global `stuvio.random` object. Here are the available methods:

    // choose a random new seed value
    stuvio.random.mutate()
    
    // float between 0 and 1
    stuvio.random()

    // float between 0 and 1
    stuvio.random.float()

    // float between 0 and `max`
    stuvio.random.float( max )

    // float between `min` and `max`
    stuvio.random.float( min, max )

    // int between 0 and 1
    stuvio.random.int()

    // int between 0 and `max`
    stuvio.random.int( max )

    // int between `min` and `max`
    stuvio.random.int( min, max )

    // -1 or 1 based on `chance`
    stuvio.random.sign( chance )

    // true or false based on `chance`
    stuvio.random.bool( chance )

    // 0 or 1 based on `chance`
    stuvio.random.bit( chance )

    // random item from `array`
    stuvio.random.item( array )

    // random float with standard deviation `sdev` from `mean`
    stuvio.random.gaussian( mean, sdev )

There is also a `stuvio.random.seed` property, which is shuffled each time your Generator is initialized and reset before each call to your `generate` method. This means that all random numbers used to generate an image will be the same each time, so long as the `seed` value remains the same. You can expose this vicariously as a setting to make it user configurable (and therefore saved when a print is ordered) - just make sure you use the value of your setting to set the random number generator's seed at the top of your `generate` method (see (the random example)[examples/random.js] for clarification.)

## Dimensions

Your Generator will need to run at many different sizes, although the aspect ratio will always remain the same. Currently, this is 1:SQRT(2) (that of international paper sizes) but we're working on a mechanism for you to define your own. Because of this, we recommend that you design your Generator to work based off of a normalized coordinate system - you should select `x` and `y` coordinates for example based on factors of the canvas width and height, rather than absolute values. This will allow your images to scale up and down with different users viewports and when being captured at high resolution for print. You should take the dimensions from the canvas that owns your drawing context, for example `Generator.context.canvas.width`.

## Sharing your Generator

The best way to share your code with us is to push it to a remote git repository and give us access to it, so that we can pull your code down, integrate it into the site and deploy it after testing. If you want to keep your code private but don't have a paid GitHub account, there are services like [BitBucket](https://bitbucket.org/) that offer free private repositories.

Once you've pushed your code up, you should grant access to the GitHub user [soulwire](https://github.com/soulwire) or the email address: _justin@soulwire.co.uk_

Alternatively, you can simply zip up the sandbox that includes your Generator code and email it to [art@stuv.io](mailto:art@stuv.io).