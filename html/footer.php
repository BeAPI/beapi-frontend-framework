				</div><!-- main content wrapper -->
			</main> <!-- Main content -->
			<footer class="footer" id="footer" role="contentinfo">
				<div class="wrapper">
					<p>Follow us:</p>
					<a class="button button--circle" href="https://www.facebook.com/beapi.agency/?ref=bookmarks">
						<span class="visuallyhidden">On Facebook</span>
						<svg class="icon icon-facebook" aria-hidden="true" role="img">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-facebook"></use>
						</svg>
					</a>
					<a class="button button--circle" href="https://twitter.com/be_api">
						<span class="visuallyhidden">On Twitter</span>
						<svg class="icon icon-twitter" aria-hidden="true" role="img">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-twitter"></use>
						</svg>
					</a>
					<a class="button button--circle" href="https://www.instagram.com/agencebeapi/">
						<span class="visuallyhidden">On Instagram</span>
						<svg class="icon icon-instagram" aria-hidden="true" role="img">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-instagram"></use>
						</svg>
					</a>
					
				</div>
			</footer>
		</div><!-- Main -->
		<?php include '../assets/icons/icons.svg'; ?>
		<script>
			//inline loadCSS
			function loadCSS(e,n,t){"use strict";var o=window.document.createElement("link"),d=n||window.document.getElementsByTagName("script")[0],i=window.document.styleSheets;return o.rel="stylesheet",o.href=e,o.media="only x",d.parentNode.insertBefore(o,d),o.onloadcssdefined=function(e){for(var n,t=0;t<i.length;t++)i[t].href&&i[t].href===o.href&&(n=!0);n?e():setTimeout(function(){o.onloadcssdefined(e)})},o.onloadcssdefined(function(){o.media=t||"all"}),o}

			// load webfonts asyn cusing LoasCSS filament group lib
			loadCSS("../assets/css/fonts.css");
			loadCSS("../assets/css/style.css");
			
			// inline loadJS
			function loadJS(e,t){"use strict";var n=window.document.getElementsByTagName("script")[0],o=window.document.createElement("script");return o.src=e,o.async=!0,n.parentNode.insertBefore(o,n),t&&"function"==typeof t&&(o.onload=t),o}
			// js for font loading with caching strategy
			if (sessionStorage.getItem('fonts-loaded')) {
				// fonts cached, add class to document
				document.documentElement.classList.add('fonts-loaded');
			} else {
				// load script with font observing logic
				loadJS('../assets/js/vendor_async/fonts-css-async.js');
			}
			//load main site js
			loadJS("../assets/js/scripts.min.js");
		</script>
	</body>
</html>