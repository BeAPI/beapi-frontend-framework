				</div><!-- main content container -->
			</main> <!-- Main content -->
			<footer class="footer" id="footer" role="contentinfo">
				<div class="container">
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
					<a class="button button--circle" href="#">
						<span class="visuallyhidden">On Viadeo</span>
						<svg class="icon icon-viadeo" aria-hidden="true" role="img">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-viadeo"></use>
						</svg>
					</a>
					<a class="button button--circle" href="#">
						<span class="visuallyhidden">On Google</span>
						<svg class="icon icon-google" aria-hidden="true" role="img">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-google"></use>
						</svg>
					</a>
					<a class="button button--circle" href="#">
						<span class="visuallyhidden">On Youtube</span>
						<svg class="icon icon-youtube" aria-hidden="true" role="img">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-youtube"></use>
						</svg>
					</a>
					
				</div>
			</footer>
		</div><!-- Main -->
		<?php include '../assets/icons/icons.svg'; ?>
		<script>
			// inline loadJS
			function loadJS(e,t){"use strict";var n=window.document.getElementsByTagName("script")[0],o=window.document.createElement("script");return o.src=e,o.async=!0,n.parentNode.insertBefore(o,n),t&&"function"==typeof t&&(o.onload=t),o}
			// then load your JS
			if (sessionStorage.getItem('fonts-loaded')) {
				// fonts cached, add class to document
				document.documentElement.classList.remove('fonts-loading');
			} else {
				// load script with font observing logic
				loadJS('../assets/js/vendor_async/fonts-css-async.js');
			}
		</script>
		<script src="../assets/js/scripts.min.js" async defer></script>
	</body>
</html>