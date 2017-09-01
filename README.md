# Be API FrontEnd Framework
## The WordPress BFF !

### Before start ###

Install [NodeJS](https://nodejs.org)

You can check if NPM exist by command :

    $ npm help

Take a look at :

* [Gulp](https://http://gulpjs.com/)
* [Sass](http://sass-lang.com/)
* [Bourbon](http://bourbon.io/)
* [Susy](http://susy.oddbird.net/)

### Installing (Only if WordPress installed)  ###

Clone the repo in the WordPress's themes folder. Delete the .git in order to work with your own repo.

    $ cd wp-content/themes
    $ git clone https://github.com/BeAPI/beapi-frontend-framework.git name_of_my_theme
    $ cd name_of_my_theme
    $ mv build.sh ../../../
    $ rm -rf .git

NB: Directory "themewp" is used for backend purpose

### Gulp ###

#### Gulp - Installation ####

Install gulp and browser-sync globaly (-g):

    $ npm install gulp browser-sync -g

Then launch:

    $ npm install

First command will "read" the package.json, where all dependencies are listed.
The second one is used to managed external ressources like jQuery etc.
If you have errors, it's probably because NodeJS is not installed.

#### Gulp - Sass/Js ####

Once installation done you just need to hit :

    $ gulp

This task will watch your SCSS and JS and compile them:

* style.css (sass task) 
* style.min.css (sass task) 
* scripts.min.js (js task)

If you just want to compile styles and script without watching, you can hit theses command:

    $ gulp sass
    $ gulp js

#### Gulp - Icons ####

There are 2 differents tasks for icon purpose :

    $ gulp svgicons
    $ gulp iconfont
    
By default, iconfont task is not used, you can enable it for old browsers support.
Svgicons create a svg sprite from all svg files located in `assets/img/icons`.

#### Gulp - Serve ####

You can use browsersync in a local environnement with this commmand:

    $ gulp serve
    
It will provide local and external url in order to work on mutiple device at the same time.
You can change the proxy option in the gulpfile if you want to adapt it to your workspace. More informations at Browsersync.

#### Gulp - Build ####

You can generate a css file that contains all styles visible before the float line break :

    $ gulp critical-css
    
In order to use this command, you have to edit the configuration file in `assets/css/critical/bea-critical-conf.json`.

To prevent Wordpress and/or browsers cache issues, you can update the `style.css` in the theme's root. There are 3 kinds of update available : `patch`, `minor` or `major`.

    $ gulp bump [-t | -type] [patch | minor | major]
    
To launch all the gulp tasks, without watching any files, in once command, you can type :

    $ gulp build
    
In the case of a multiple themes of a Wordpress project, you can use the previous task in any themes in one command with a bash script. *To use the command, you have to be in the Wordpress root path.*
By the way, you can specify the type of bump wanted.

    $ sh build.sh [-t | -type] [patch | minor | major]

### CSS/SASS Guideline ###

We like to present and order our css like this:

    .module {
        Position properties (z-index, top etc.)
        Display properties (padding, margin, border etc.)
        Text properties (font-family etc.)
        Colors properties (color, background, etc.)
        Mixins (transition etc.)
        Others (white-space etc.)
        @include media($desktop-small) {
            Responsive stuffs
        }
    }
    
We do not fully respect the BEM css method but we like this kind of OOCSS:

    .module-name (.header)
    .module-name__element (.header__column, .header__button etc.)
    .module-name__element--modifier (.header__element--visible, .header__element--color-2 etc.)

Keep in mind that your class will be more reusable if they are generic enough. If you have too much subelements in your class, there's a problem in your markup.

For example

    .entry-metas
    .entry-metas__date
    .entry-metas__date__month
Should be

    .entry-metas
    .entry-date
    .entry-date__month
Cause date element could be used outside metas. You shouldn't have more than 1 subelement, except in really specifical cases.

We like to keep our code clean and readable. This is why we skip lines between each selectors and add empty line between declarations and includes (like media queries)

    // Example
    .class,
    .class--alt {
      attr: value;

      @media screen and (min-width: $breakpoint) {
        attr: value;
      }
    }


CSS partials are classified and saved in 4 mains folders

* *vendor*. It's where external ressources are. Most of themes are selected manually from bower_components because sometimes it need to be renamed as .scss and modified. the original files are still available like this.
* *components*. The basics like button forms elements etc. It's where you can defined you root's styles for button input headings etc.
* *patterns*. it's related to your modules. It's where you defined the basics for your module.
* *pages*. a css file for each pages. very useful for change module behavior in a specific context.
* All those parts are referenced in *assets/css/style.scss*. Don't forget to add your files here in the correct order.

### JS Guideline ###

As said above all javascript ressources are compiled with gulp with a sourcemap for debbugging.

If you need a library, install it with npm.
    
    $ npm install --save my_lib
    
Then you can require it where you need to use it, like this :
    
    $ var npm_lib = require('npm_lib')
    
If there is no packages available on npm for the library you need, paste the dist file into js vendor folder. Then you have to require it :

    $ var vendor_lib = require('../vendor/vendor_lib')

If you want to play with it, create a new file in 'assets/js/src' like slider.js for example. You need to require it in scripts.js as a CommonJS module, then gulp will compile your scripts in 'scripts.min.js' and update 'scripts.min.js.map' in order to debbug the script.

We are using ESLint coding Standard : https://github.com/standard/standard

### Responsive images ###

BFF support responsive images using RICG picturefill library. But with somes limitation, you have two choices:
* provide a 2x img with "x" descriptor. perfect for thumbnails. ( srcset="my_image, my_image-HD 2x" )
* provide a range of image depend on viewport with "w" descriptor. ( srcset="my_image-mobile 480w, my_image-tablet 768w, etc." )

You can define image sizes in *assets/conf-img/images-sizes.json* like this:

    [
    	{
    		"small":[],
    		"img-150-150":
    			{
    				"width":"150",
    				"height":"150",
    				"crop":true
    			},
    		"img-300-300":
    			{
    				"width":"300",
    				"height":"300",
    				"crop":true
    			}
    	}
    ]

And when your image sizes are made you have to pass them in a location like this :

    [
    	{
    		"entry-img-01":[
    			{
    				"srcset":"",
    				"size":"img-150-150",
    				"class":""
    			},
    			{
    				"srcset":"2x",
    				"size":"img-300-300",
    				"class":"",
    				"default_src":true
    			}
    		]
    	}
    ]

Now you can use it in your markup like this:

    <?php echo get_the_post_thumbnail( 0, 'thumbnail', array( 'data-location' => 'entry-img-01' ) ); ?>

If you need to add a class to your img tag:

    <?php echo get_the_post_thumbnail( 0, 'thumbnail', array( 'data-location' => 'entry-img-01', 'class' => 'my_class_name' ) ); ?>

We add Lazyload support too! We use [Lazysize](https://github.com/aFarkas/lazysizes) in addition to picturefill in order to provide responsive image served as fast as possible.

If you don't want this feature you still can set BEA_LAZYSIZE to false in /functions/class-bea-images.php. it will turn the markup to basic img tag with srcset.
