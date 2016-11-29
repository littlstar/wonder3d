'use strict'

/**
 * Module dependencies.
 */

const OrbitCameraController = require('axis3d/controls/orbit-camera').OrbitCameraController
const Keyboard = require('axis3d/input/keyboard').KeyboardCommand
const Context = require('axis3d/context').Context
const Camera = require('axis3d/camera').CameraCommand
const Sphere = require('axis3d/mesh/sphere').SphereCommand
const Mouse = require('axis3d/input/mouse').MouseCommand
const Video = require('axis3d/media/video').VideoCommand
const Frame = require('axis3d/frame').FrameCommand
const raf = require('raf')

// axis context
const ctx = new Context({
  clear: {
    color: [17/255, 17/255, 17/255, 1],
    depth: 1,
  },
}, {element: document.querySelector('#video')})

// objects
const camera = new Camera(ctx)
const frame = new Frame(ctx)
// inputs
const keyboard = new Keyboard(ctx)
const mouse = new Mouse(ctx)

// orbit controller
const orbitController = new OrbitCameraController(ctx, {
  inputs: {mouse, keyboard},
  target: camera,
  invert: true,
})

function myFunc(videoFile) {
  const video = new Video(ctx, videoFile)
  const sphere = new Sphere(ctx, { envmap: video })


  // orient controllers to "center" of video/video
  raf(() => {
    orbitController.orientation.y = -Math.PI / 2

    // play next frame
    video.play()
    video.mute()

    // focus now
    ctx.focus()
  })

  // expose useful things to window
  Object.assign(window, {camera, sphere, video})
  // axis animation frame loop
  frame(({time}) => {
    // update controller states
    orbitController()

    // draw camera scene
    camera({fov: Math.PI / 2.75}, () => {
      sphere({scale: [100, 100, 100]})
    })
  })
}
