
#  BeAPI FrontEnd Framework
##  What is it ?
BeAPI FrontEnd Framework (BFF) is an open source framework for WordPress stacks. Mobile-first projects with the latest useful tools for the Frontend Development like Webpack, LivingCSS, SASS, Critical CSS, Favicons generation and custom tools like ComposerJS.

##  Installation
You have to install [Webpack](https://webpack.js.org/) and [Concurrently](https://www.npmjs.com/package/concurrently) globaly.

```$ npm install webpack concurrently --g```

Clone the repository in the WordPress's themes folder. Remove the `.git` folder in order to work with your own repo.

```
$ cd wp-content/themes
$ git clone https://github.com/BeAPI/beapi-frontend-framework.git name\_of\_my_theme
$ cd name\_of\_my_theme
$ mv build.sh ../../../
$ rm -rf .git
```
Then install dependencies width NPM.
```
$ npm install
```
Or using Yarn.
```
$ yarn
```
##  Configuration
In the `build` directory, you can find the Webpack configurations files.
-   _config.js —_ the configuration settings (entries, output, port etc…)
- _css-loader.js —_ the common loaders for CSS, SASS and SCSS filetypes
- _server.js_ — the Browser Sync configuration
- _webpack.base.js_ — the basic configuration of Webpack for development and production purpose.
- _webpack.dev.js_ — the configuration of Webpack for development purpose
- _webpack.prod.js_ — the configuration of Webpack for production purpose

##  How to use it ?
### Local Server with Browser Sync
You can launch a local php server with Browser Sync using :
```
$ npm start
```
### Development purpose
If you don't need this server you can just compile styles and JS using :
```
$ npm run dev
```
### Production purpose
For production purpose, you can compile all of your assets by using :
```
$ npm run prod
```
If want to bump your WordPress theme version you can add a flag like this :
```
$ npm run prod -- -t minor
```
For example, if you have a 1.2.1 theme version, it will be bumped to 1.3.0. You can replace `minor` by `patch` or `major`.

### Favicons and appicons generation
You can also generate favicons from the sources files in `assets/img/favicons/` by using :
```
$ npm run favicon
```
 You can also generate appicons :
```
$ npm run appicon
```
### Bump of WordPress theme version
To prevent WordPress and/or browsers cache issues, you can update the version of `style.css` in the theme's root. There are 3 kinds of update available : `patch`, `minor` or `major`.
```
$ npm run bump [-t | -type] [patch | minor | major]
```
In the case of a multiple themes of a Wordpress project, you can use the previous task in any themes in one command with a bash script. _To use the command, you have to be in the Wordpress root path._ By the way, you can specify the type of bump wanted.

```
$ sh build.sh [-t | -type] [patch | minor | major]
```

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


CSS partials are classified and saved in 6 mains folders

* *root*. Where you're define common base. Variables, Mixins, Fonts, Susy library etc.
* *vendor*. It's where external ressources are (jQuery plugins fr example).
* *plugins*. One file by WordPress plugins (Mailpoet, WPForms etc.). in order to define the base style of plugin in the theme. Make specific style in your patterns or pages.
* *components*. The basics like button forms elements etc. It's where you can defined you root's styles for button input headings etc.
* *patterns*. it's related to your modules. It's where you defined the basics for your module.
* *pages*. a css file for each pages. very useful for change module behavior in a specific context.
* All those parts are referenced in *assets/css/style.scss*. Don't forget to add your files here in the correct order.

### JS Guideline ###

As said above all JavaScript ressources are compiled with Webpack with a sourcemap for debbugging.

If you need a library, install it with npm.
    
    $ npm install --save my_lib
    
Then you can require it where you need to use it, like this :
    
    $ import npm_lib from 'npm_lib'
    
If there is no packages available on npm for the library you need, paste the dist file into js vendor folder. Then you have to require it :

    $ import vendor_lib from '../vendor/vendor_lib'


We are using ESLint coding Standard : https://github.com/standard/standard

### Composer JS ###

In order to keep a lightweight stack, you can add extra components that are used most of the time in Web dev. You have to use [composerjs](composerjs)  

### LivingCSS / Styleguide ###

SASS file are commented in order to generate a living styleguide using `npm run livingcss`
It is also available at `your_local_url/livingcss/html/` and watched by `gulp serve`
For more details look at : https://github.com/straker/livingcss

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
