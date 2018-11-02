/* global Modernizr */
import '../vendor/modernizr.objectfit'
import objectFitImages from 'object-fit-images'

console.log(Modernizr.objectfit)

if (!Modernizr.objectfit) {
  objectFitImages()
}
