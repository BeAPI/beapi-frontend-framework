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

NB: BrowserSyncis in beta testing

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

It will also lauchn browser-sync. in the terminal it will provide local and external url in order to work on mutiple device at the same time.