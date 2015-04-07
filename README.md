# Be API FrontEnd Framework
## The WordPress BFF !

### Before start ###

Install [NodeJS](https://nodejs.org)

You can check if NPM exist by command :

    $ npm help

Take a look at :
* [Gulp](https://http://gulpjs.com/)
* [Bower](https://bower.io)
* [Sass](http://sass-lang.com/)
* [Bourbon](http://bourbon.io/)
* [Neat](http://neat.bourbon.io/)

NB: BrowserSync is in beta testing

### Installing (Only if WordPress installed)  ###

Clone the repo in the WordPress's themes folder. Delete the .git in order to work with your own repo.

    $ cd wp-content/themes
    $ git clone https://cocola@bitbucket.org/beapi/base-theme-beapi.git name_of_my_theme
    $ cd name_of_my_theme
    $ rm -rf .git

NB: Directory "themewp" is used for backend purpose

### Gulp ###

Install gulp, bower et browser-sync globaly (-g):

    $ npm install gulp bower browser-syng -g

Then launch:

    $ npm install

And:

    $ bower install

First command will "read" the package.json, where all dependencies are listed.
The second one is used to managed external ressources like jQuery etc.
If you have errors, it's probably because NodeJS is not installed.

Once installation done you just need to hit :

    $ gulp

This task will watch your SCSS and JS and compile them:

* style.dev.css (dev-sass task) 
* scripts.min.js (dev-check-js)

If you just want to compile styles and script without watching, you can hit theses command:
    $ gulp dev-sass
    $ gulp dist-sass
    $ gulp dev-check-js

### Gulp and Browser Sync ###
You can use browsersync in a local environnement with yhis commmand:

    $ gulp serve

It will provide local and external url in order to work on mutiple device at the same time.
Actually you need to have wamp instaled because static page files are php. You can change the proxy option in the gulpfile if you want to adapt it to your workspace. More informations at [Browsersync](http://www.browsersync.io/).

### CSS/SASS Guideline ###
We like to present and order our css like this:

    .module {
        /* Position properties (z-index, top etc.) */
        /* Display properties (padding, margin, border etc.) */
        /* Text properties (font-family etc.) */
        /* Colors properties (color, background, etc.) */
        /* Mixins (transition etc.) */
        /* Others (white-space etc.) */
        @include media($desktop-small) {
            //responsive stuffs
        }
    }
    
We do not fully respect the BEM css method but we like this kind of OOCSS:

    .module-name (.header)
    .module-name__element (.header__column, .header__button etc.)
    .module-name__element--modifier (.header__element--visible, .header__element--color-2 etc.)

CSS partials are classified and saved in 4 mains folders

* *vendor*. It's where external ressources are. Most of themes are selected manually from bower_components because sometimes it need to be renamed as .scss and modified. the original files are still available like this.
* *components*. The basics like button forms elements etc. It's where you can defined you root's styles for button input headings etc.
* *patterns*. it's related to your modules. It's where you defined the basics for your module.
* *pages*. a css file for each pages. very useful for change module behavior in a specific context.
* All those parts are referenced in *assets/css/style.scss*. Don't forget to add your files here in the correct order.

