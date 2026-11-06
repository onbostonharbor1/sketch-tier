# Which gallery scripts a combination can use

Written by `npm run test:combinable` on 2026-11-06; do not edit by hand. 6 of 86 scripts can be combined.

## Reasons, counted

- 60: scriptInfo has no draw()
- 16: its draw() clears the canvas
- 2: exports no scriptInfo
- 1: its controls have groups of their own (showsGroup)
- 1: does not load
- 1: a copy throws
- 1: a copy does not answer its own settings (it may use "scriptInfo" by name)

## Can be combined

- `/gallery/Scripts/Curve Stitch/alternatingShapes.js`
- `/gallery/Scripts/Curve Stitch/alternatingShapesDefined.js`
- `/gallery/Scripts/Curve Stitch/joinedParabsBand.js`
- `/gallery/Scripts/Curve Stitch/joinedParabsBandLinked.js`
- `/gallery/Scripts/Curve Stitch/ovalBoat.js`
- `/gallery/Scripts/General parametric/3Lobed.js`

## Cannot be combined

- `/gallery/Scripts/Curve Stitch/arcsAndInner.js`: exports no scriptInfo
- `/gallery/Scripts/Curve Stitch/curveStitch.js`: scriptInfo has no draw()
- `/gallery/Scripts/Curve Stitch/joinedParabs.js`: its draw() clears the canvas
- `/gallery/Scripts/Curve Stitch/manyJoinedParabs.js`: its draw() clears the canvas
- `/gallery/Scripts/Curve Stitch/manyRowsColumns.js`: its draw() clears the canvas
- `/gallery/Scripts/Curve Stitch/overlappingStars1.js`: scriptInfo has no draw()
- `/gallery/Scripts/Curve Stitch/polygonCorner.js`: scriptInfo has no draw()
- `/gallery/Scripts/Curve Stitch/tractrix.js`: scriptInfo has no draw()
- `/gallery/Scripts/Curve Stitch/weaving.js`: scriptInfo has no draw()
- `/gallery/Scripts/Curves/cissoidDiocles.js`: scriptInfo has no draw()
- `/gallery/Scripts/Curves/cissoidSimplified.js`: scriptInfo has no draw()
- `/gallery/Scripts/Curves/nicodemus.js`: scriptInfo has no draw()
- `/gallery/Scripts/Elliptical/ellipseCurveStitching.js`: its draw() clears the canvas
- `/gallery/Scripts/Elliptical/generativeModulated.js`: scriptInfo has no draw()
- `/gallery/Scripts/Elliptical/modulatdCircle2.js`: scriptInfo has no draw()
- `/gallery/Scripts/Envelopes/chladni.js`: scriptInfo has no draw()
- `/gallery/Scripts/Envelopes/cycloidLike.js`: scriptInfo has no draw()
- `/gallery/Scripts/Envelopes/harmongraph.js`: scriptInfo has no draw()
- `/gallery/Scripts/Envelopes/parabolas.js`: scriptInfo has no draw()
- `/gallery/Scripts/Envelopes/rotaryHarmonograph.js`: scriptInfo has no draw()
- `/gallery/Scripts/Envelopes/superformula.js`: scriptInfo has no draw()
- `/gallery/Scripts/Envelopes/superformulaFamilies.js`: scriptInfo has no draw()
- `/gallery/Scripts/Experimental/concentricCircles.js`: scriptInfo has no draw(); its controls have groups of their own (showsGroup)
- `/gallery/Scripts/Experimental/maurer.js`: scriptInfo has no draw()
- `/gallery/Scripts/Experimental/variedEllipse.js`: scriptInfo has no draw()
- `/gallery/Scripts/General parametric/strophoid.js`: scriptInfo has no draw()
- `/gallery/Scripts/Generative/barnsleyFern.js`: scriptInfo has no draw()
- `/gallery/Scripts/Generative/boat.js`: scriptInfo has no draw()
- `/gallery/Scripts/Generative/butterfly.js`: scriptInfo has no draw()
- `/gallery/Scripts/Generative/lorenzAttractor.js`: scriptInfo has no draw()
- `/gallery/Scripts/Generative/phyllotaxisSpirals.js`: scriptInfo has no draw()
- `/gallery/Scripts/Generative/voronoi.js`: does not load: Failed to fetch dynamically imported module: http://localhost:5173/gallery/Scripts/Generative/voronoi.js?import&t=1793990590084
- `/gallery/Scripts/Multiple/fourParabolicLike.js`: scriptInfo has no draw()
- `/gallery/Scripts/Multiple/manyParametric.js`: scriptInfo has no draw()
- `/gallery/Scripts/Multiple/parametricSketcher.js`: scriptInfo has no draw()
- `/gallery/Scripts/Multiple/roseAndLissajous.js`: scriptInfo has no draw()
- `/gallery/Scripts/Named parametric/LISSAJOUS100.js`: scriptInfo has no draw()
- `/gallery/Scripts/Named parametric/cardiodFromCircles.js`: scriptInfo has no draw()
- `/gallery/Scripts/Named parametric/cochleoid.js`: scriptInfo has no draw()
- `/gallery/Scripts/Named parametric/epicycloid.js`: scriptInfo has no draw()
- `/gallery/Scripts/Named parametric/epitrochoid.js`: scriptInfo has no draw()
- `/gallery/Scripts/Named parametric/epitrochoid1.js`: scriptInfo has no draw()
- `/gallery/Scripts/Named parametric/epitrochoid_good.js`: scriptInfo has no draw()
- `/gallery/Scripts/Named parametric/hypocycloid.js`: scriptInfo has no draw()
- `/gallery/Scripts/Named parametric/hypocycloidEvolute.js`: scriptInfo has no draw()
- `/gallery/Scripts/Named parametric/hypocycloidMany.js`: scriptInfo has no draw()
- `/gallery/Scripts/Named parametric/hypotrochoid.js`: scriptInfo has no draw()
- `/gallery/Scripts/Named parametric/hypotrochoid1.js`: scriptInfo has no draw()
- `/gallery/Scripts/Named parametric/hypotrochoidInteractive.js`: scriptInfo has no draw()
- `/gallery/Scripts/Named parametric/lissajois1.js`: its draw() clears the canvas
- `/gallery/Scripts/Named parametric/lissajous.js`: a copy throws: autoFit: #sharedCanvas not found
- `/gallery/Scripts/Named parametric/lissajous3.js`: scriptInfo has no draw()
- `/gallery/Scripts/Named parametric/lissajous4.js`: scriptInfo has no draw()
- `/gallery/Scripts/Named parametric/lissajous5.js`: scriptInfo has no draw()
- `/gallery/Scripts/Named parametric/lissajousCurveStitch.js`: scriptInfo has no draw()
- `/gallery/Scripts/Named parametric/roseCurve.js`: scriptInfo has no draw()
- `/gallery/Scripts/Named parametric/roseCurveInterative.js`: scriptInfo has no draw()
- `/gallery/Scripts/Named parametric/roseCurvesMany.js`: scriptInfo has no draw()
- `/gallery/Scripts/Named parametric/roseRhodena.js`: scriptInfo has no draw()
- `/gallery/Scripts/Pursuit/copilot1.js`: its draw() clears the canvas
- `/gallery/Scripts/Pursuit/copilotAnimation.js`: its draw() clears the canvas
- `/gallery/Scripts/Pursuit/pursuit.js`: its draw() clears the canvas
- `/gallery/Scripts/Pursuit/pursuit2.js`: its draw() clears the canvas
- `/gallery/Scripts/Pursuit/pursuit3.js`: its draw() clears the canvas
- `/gallery/Scripts/Pursuit/pursuit4.js`: its draw() clears the canvas
- `/gallery/Scripts/Pursuit/pursuitDynamic5.js`: its draw() clears the canvas
- `/gallery/Scripts/Pursuit/pursuitMice.js`: its draw() clears the canvas
- `/gallery/Scripts/Pursuit/pursuitStatic5.js`: exports no scriptInfo
- `/gallery/Scripts/Pursuit/pusuitSurface.js`: scriptInfo has no draw()
- `/gallery/Scripts/Rose/rose.js`: scriptInfo has no draw()
- `/gallery/Scripts/Spiral/golden.js`: scriptInfo has no draw()
- `/gallery/Scripts/Spiral/nautilus2.js`: its draw() clears the canvas
- `/gallery/Scripts/Spiral/nautilusInteractive.js`: its draw() clears the canvas; a copy does not answer its own settings (it may use "scriptInfo" by name)
- `/gallery/Scripts/Spiral/polygonalSpiral.js`: scriptInfo has no draw()
- `/gallery/Scripts/Unicorns/bezierBlossom.js`: scriptInfo has no draw()
- `/gallery/Scripts/Unicorns/curveStitchEditor.js`: scriptInfo has no draw()
- `/gallery/Scripts/Unicorns/radialPetals.js`: scriptInfo has no draw()
- `/gallery/Scripts/Unicorns/ribbon1.js`: its draw() clears the canvas
- `/gallery/Scripts/Unicorns/ribbon2.js`: scriptInfo has no draw()
- `/gallery/Scripts/Unicorns/ribbonAnimated.js`: scriptInfo has no draw()
