/* global Modernizr */
import '../vendor/modernizr.objectfit'
import objectFitImages from 'object-fit-images'

if (!Modernizr.objectfit) {
  objectFitImages()
}
