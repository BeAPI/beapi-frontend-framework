</main> <!-- Main content -->
<footer class="footer" id="footer" role="contentinfo">
	<div class="container">
		<p>Follow us:</p>
		<a class="button button--circle" href="https://www.facebook.com/beapi.agency/?ref=bookmarks">
			<span class="visuallyhidden">On Facebook</span>
			<svg class="icon" focusable="false" aria-hidden="true" role="img">
				<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#facebook"></use>
			</svg>
		</a>
		<a class="button button--circle" href="https://twitter.com/be_api">
			<span class="visuallyhidden">On Twitter</span>
			<svg class="icon" focusable="false" aria-hidden="true" role="img">
				<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#twitter"></use>
			</svg>
		</a>
		<a class="button button--circle" href="https://www.instagram.com/agencebeapi/">
			<span class="visuallyhidden">On Instagram</span>
			<svg class="icon" focusable="false" aria-hidden="true" role="img">
				<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#instagram"></use>
			</svg>
		</a>
	</div>
</footer>
</div><!-- Main -->

<!-- Polyfill.io -->
<script src="https://cdn.polyfill.io/v3/polyfill.min.js?features=es5,es6,fetch,Array.prototype.includes,CustomEvent,Element.prototype.closest,NodeList.prototype.forEach"></script>

<!-- Theme js -->
<?php
if ( is_readable( dirname( __FILE__ ) . '/../WebpackBuiltFiles.php' ) ) {
	require_once dirname( __FILE__ ) . '/../WebpackBuiltFiles.php';
	foreach ( WebpackBuiltFiles::$jsFiles as $file ) {
		?>
		<script src="assets/<?php echo $file; ?>" async defer></script>
		<?php
	}
}
?>
</body>
</html>
