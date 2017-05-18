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
			// inline loadJS
			function loadJS(e,t){"use strict";var n=window.document.getElementsByTagName("script")[0],o=window.document.createElement("script");return o.src=e,o.async=!0,n.parentNode.insertBefore(o,n),t&&"function"==typeof t&&(o.onload=t),o}
			// then load your JS
			if (sessionStorage.getItem('fonts-loaded')) {
				// fonts cached, add class to document
				document.documentElement.classList.add('fonts-loaded');
			} else {
				// load script with font observing logic
				loadJS('../assets/js/vendor_async/fonts-css-async.js');
			}
		</script>
		<script src="../assets/js/scripts.min.js" async defer></script>
	</body>
</html>