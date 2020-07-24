#  BeAPI FrontEnd Framework
![Node.js CI](https://github.com/BeAPI/beapi-frontend-framework/workflows/Node.js%20CI/badge.svg?branch=master)

##  What is BeAPI FrontEnd Framework ?

BeAPI FrontEnd Framework (BFF) is a Front-end WordPress theme friendly boilerplate to help you to build your own WordPress theme with modern tools and a better productivity.

## Tools
* [Webpack 4](https://www.npmjs.com/package/webpack)
* [Node SASS](https://www.npmjs.com/package/node-sass)
* [Favicons](https://www.npmjs.com/package/favicons)
* [SVGStore](https://www.npmjs.com/package/svgstore)
* [SVGGo](https://www.npmjs.com/package/svgstore)
* [Lazysizes](https://www.npmjs.com/package/lazysizes)
* [Eslint](https://www.npmjs.com/package/eslint)
* [Babel Loader](https://www.npmjs.com/package/babel-loader)
* [Browser Sync](https://www.npmjs.com/package/browser-sync-webpack-plugin)

## Requirements

### Composer
You need composer to autoload all your classes from the inc folder.

Use the `beapi/composer-scaffold-theme` package that add it automatically to the composer.json file.
You can add it yourself like this :
 
```composer.json
    "autoload": {
        "psr-4": {
            "BEA\\Theme\\Framework\\": "content/themes/framework/inc/"
        }
    }
```

## Autoload
The autoload is based on psr-4 and handled by composer.

### Node 8

You need a minimum of Node 8.

### Advanced Responsive Images

You need to work in a wordpress environment in order to make the BFF work with webpack for local dev. To do that you need to install [Advanced Responsive Images](https://github.com/asadowski10/advanced-responsive-images) in your plugin folder.

## Installation

Download the latest release of BFF [here](https://github.com/BeAPI/beapi-frontend-framework/releases) and extract the zip archive into your `themes` WordPress's folder.

```bash
|____wp-admin
|____wp-content
| |____plugins
| |____themes
| | |____beapi-frontend-framework
| |____uploads
|____wp-includes
```

Of course, you can rename `beapi-frontend-framework` to define your WordPress theme's name.

Next, go to your theme folder (in the following example, I didn't rename `beapi-frontend-framework`) with your favorite Term software.

```bash
$ cd wp-content/themes/beapi-frontend-framework
```

Then install node dependencies with NPM or Yarn.
```bash
$ npm install
```

## Configuration
### Webpack
You can edit Webpack configuration with `webpack.config.js` file and settings by editing `webpack.settings.js`.

### Babel
You can find a `.babelrc` file to modify Babel configuration.

### Eslint
You can find a `.eslintrc.js` file to modify Eslint configuration and ignore files in `.eslintignore`.

## How to use BFF ?
After installing dependencies, you can run some commands which are explained below.

### Local Server with Browser Sync
You probably need to add this following line in your `hosts` file.

```
::1 localhost
```

and run a first time the following command to generate required distributions files to run the server properly.
```
$ npm run build:dev
```

Then, you can run a "Petit PHP" local server with Browser Sync by running :
```bash
$ npm start
```

### Watching files for development purpose
If you don't need a local server you just can compile AND watch styles and scripts (with sourcemap) by using :

```bash
$ npm run watch
```

### Development build
If you want to build styles and scripts (with sourcemap) by using :

```bash
$ npm run build:dev
```

### Production build
For production purpose, you can compile all of your assets by using :

```bash
$ npm run build:prod
```

If you want to deliver assets for both developpement and production, run :

```bash
$ npm run build
```

### Bump WordPress theme version
You can change your WordPress theme's version by using :

```bash
$ npm run bump [-t | -type] [patch | minor | major]
```

It will change the version of your theme filled in the `style.css` file in the theme's root.
There are 3 kinds of update available : patch, minor or major.

In the case of a multiple themes of a Wordpress project, you can use the previous task in any themes in one command with a bash script. To use the command, you have to move the `build.sh` file based in your WordPress theme's root to your WordPress project's root and go to the Wordpress root path with your Terminal software.

```bash
$ mv build.sh ../../../
$ cd ../../../
```

By the way, you can specify the type of bump wanted.

```bash
$ sh build.sh [-t | -type] [patch | minor | major]
```

### Assets
#### Favicons

Generate appicons and favicons from the sources files in src/img/favicons/ by using :

```bash
$ npm run favicon
```

#### SVG Icons
Generate SVG sprite from the icons files in src/img/icons/ by using :

```bash
$ npm run icon
```

Generate JSON image sizes and locations (more details in the [Responsive images section](#responsive-images)) by using :

```bash
# you can add csv as argument to generate a CSV file of image locations
$ npm run image [csv]
```

## Composer JS

In order to keep a lightweight stack, you can add extra components that are used most of the time in Web dev by using :

```bash
$ npm run composerjs
```

You can find the list of SCSS and JS components to use [here](https://github.com/BeAPI/beapi-frontend-framework/blob/master/composerjs).

## Responsive images

WordPress native thumbnails are not enough for us. We want to build images :
* That can have differents art direction between differents viewports
* That can be displayed in the good resolution
* That can be lazyloaded, but still accessible if no Javascript

Something like this :
```html
<picture>
    <!--[if IE 9]><video style="display: none"><![endif]-->
    <source
        srcset="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
        data-srcset="img-mobile, img-mobile 2x"
        media="(max-width: 375px)" />
    <source
        srcset="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
        data-srcset="img-tablet, img-tablet 2x"
        media="(max-width: 1024px)" />
    <source
        srcset="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
        data-srcset="img-desktop, img-desktop 2x" />
    <!--[if IE 9]></video><![endif]-->
    <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="lazyload" alt="image with artdirection"/>
</picture>
```

So with the [Advanced Responsive Images](https://github.com/asadowski10/advanced-responsive-images) plugin we can manage a `picture` tag with different file configuration.

* provide a 2x img with "x" descriptor. perfect for thumbnails. ( srcset="my_image, my_image-HD 2x" )
* provide a range of image depend on viewport with "w" descriptor. ( srcset="my_image-mobile 480w, my_image-tablet 768w, etc." )

You have to build your picture template in `src/conf-img/tpl`. `default-picture.tpl` is the main `<picture>` container. In this tpl we can see the reference for the sources we want, for example in `entry-img-01.tpl` we want a square image under 1024px viewport, displayed in normal or 2x resolution, for bigger screen a landscape image:

    <source data-srcset="%%img-100-100%%, %%img-200-200%% 2x" media="(max-width: 1024px)" %%srcset%% />
    <source data-srcset="%%img-300-200%%, %%img-600-400%% 2x" %%srcset%% />

Then run the following command to generate your JSON image locations and sizes :
```
$ npm run image
```

Example of *src/conf-img/images-sizes.json* :
```json
"img-100-100":
    {
        "width":"100",
        "height":"100",
        "crop":true
    }
```
Example of *src/conf-img/images-locations.json* :

```json
"entry-img-01": [
    {
        "srcsets": [
            {
                "size": "img-100-100"
            },
            {
                "size": "img-200-200"
            },
            {
                "size": "img-300-200"
            },
            {
                "size": "img-600-400"
            }
        ],
        "default_img": "default-300-200.jpg",
        "img_base": "img-300-200"
    }
]
```

`default_img` is used for default image if no image are provoded in WordPress Admin. `img_base` is used as fallback for older browser.

You can use this [Sketch extension](https://github.com/Nkzq/advanced-responsive-images-default) to generate default image according to your *images-locations.json* file. There is a sketch file provided in the *src/img/default* folder.

Now you can use it in your markup like this:
```php
    <?php echo get_the_post_thumbnail( 0, 'thumbnail', array( 'data-location' => 'entry-img-01' ) ); ?>
```
If you need to add a class to your picture (the lazyload class is added by default):
```php
    <?php echo get_the_post_thumbnail( 0, 'thumbnail', array( 'data-location' => 'entry-img-01', 'class' => 'my_class_name' ) ); ?>
```

We add Lazyload support too! We use [Lazysize](https://github.com/aFarkas/lazysizes) in addition to picturefill in order to provide responsive image served as fast as possible.

If you don't want this feature you still can set BEA_LAZYSIZE to false in /functions/class-bea-images.php. it will turn the markup to basic img tag with srcset.

Lazysize is also used for displaying background image in different sizes for differents viewports. Look at the Lazysize bgset documentation and the `page__header` or `hero` pattern.