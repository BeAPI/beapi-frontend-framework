<!-- Polyfill.io -->
<script src="https://cdn.polyfill.io/v3/polyfill.min.js?features=es5,es6,fetch,Array.prototype.includes,CustomEvent,Element.prototype.closest,NodeList.prototype.forEach"></script>

<script>
    // inline loadJS
    function loadJS(e,t){"use strict";var n=window.document.getElementsByTagName("script")[0],o=window.document.createElement("script");return o.src=e,o.async=!0,n.parentNode.insertBefore(o,n),t&&"function"==typeof t&&(o.onload=t),o}
    // then load your JS
    if (sessionStorage.getItem('fonts-loaded')) {
        // fonts cached, add class to document
        document.documentElement.classList.remove('fonts-loading');
    } else {
        // load script with font observing logic
        loadJS('<?php echo get_theme_file_uri( '/src/js/vendor_async/fonts-css-async.js' );?>');
    }
</script>
