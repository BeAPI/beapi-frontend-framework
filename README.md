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
* [Susy](http://susy.oddbird.net/)

NB: BrowserSync is in beta testing

### Installing (Only if WordPress installed)  ###

Clone the repo in the WordPress's themes folder. Delete the .git in order to work with your own repo.

    $ cd wp-content/themes
    $ git clone https://github.com/BeAPI/beapi-frontend-framework.git name_of_my_theme
    $ cd name_of_my_theme
    $ rm -rf .git

NB: Directory "themewp" is used for backend purpose

### Gulp ###

Install gulp, bower et browser-sync globaly (-g):

    $ npm install gulp bower browser-sync -g

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
You can use browsersync in a local environnement with this commmand:

    $ gulp serve

It will provide local and external url in order to work on mutiple device at the same time.
You can change the proxy option in the gulpfile if you want to adapt it to your workspace. More informations at [Browsersync](http://www.browsersync.io/).
NB : Responsive image are not working yet

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

If you need a library, instal it with bower and then move the file into *assets/js/vendor* (source and minified version) gulp will update 'vendor.min.js'.

If you want to play with it, create a new file in 'assets/js/src' like slider.js for example. You need to require it in scripts.js as a CommonJS module, then gulp will compile your scripts in 'scripts.min.js' and update 'scripts.min.js.map' in order to debbug the script.


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
The only thing to do is to provide the lazyload class when you call the image, like this :

    <?php echo get_the_post_thumbnail( 0, 'thumbnail', array( 'data-location' => 'entry-img-01', 'class' => 'my_class_name lazyload' ) ); ?>

And you can mangage the effect in the css in /assets/css/patterns/lazyload.scss

If you don't want this feature you still can set BEA_LAZYSIZE to false in /functions/class-bea-images.php. it will turn the markup to basic img tag with srcset.

### Styleguide / Toolkit (Fabricator) ###

BFF include a UI toolkit generated with node package Fabricator. It's stored in the styleguide/ folder.

Install and lauch (localhost)

    $ npm install
    $ npm start

If you need to add some styles, juste add it in :

    /styleguide/src/assets/toolkit/styles/toolkit.scss

If you want to add a component, a structure, or a page, add an HTML file in one of those folders :

    /styleguide/src/materials/components/
    /styleguide/src/materials/structures/
    /styleguide/src/views/pages/

Then just add your code and a comment above. For example :

    ---
        notes: |
          Description of your component
    ---
    <span class="your-component"></span>

Keep in mind that your components will be listed by alphabetical order.
Issues :
- At the moment, you will not be able to load assets (fonts, img) on localhost
- Picturefill is not supported
