</main> <!-- Main content -->
<footer class="footer" id="footer" role="contentinfo">
	<div class="container">
		<p>Follow us:</p>
		<a class="btn btn--circle" href="https://www.facebook.com/beapi.agency/?ref=bookmarks">
			<span class="visuallyhidden">On Facebook</span>
			<?php the_icon( 'facebook' ); ?>
		</a>
		<a class="btn btn--circle" href="https://twitter.com/be_api">
			<span class="visuallyhidden">On Twitter</span>
			<?php the_icon( 'twitter' ); ?>
		</a>
		<a class="btn btn--circle" href="https://www.instagram.com/agencebeapi/">
			<span class="visuallyhidden">On Instagram</span>
			<?php the_icon( 'instagram' ); ?>
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
	foreach ( WebpackBuiltFiles::$jsFiles as $file ) { ?>
		<script src="assets/<?php echo $file; ?>" async defer></script>
	<?php }
}
?>
</body>
</html>
