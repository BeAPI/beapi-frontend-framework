<?php $class = ''; ?>
<?php include 'header.php'; ?>
	<section class="content" id="content">
		<?php include 'blocks/breadcrumb.php'; ?>

		<h1 class="entry__title">Page contact avec Gravity form</h1>
		<article class="entry">
			<section class="entry__content">
				<div class="gform_wrapper">
					<a id="gf_8" name="gf_8" class="gform_anchor"></a>
					<form method="post" enctype="multipart/form-data" action="#">
						<div class="gform_body">
							<ul class="gform_fields top_label description_below">
								<li class="gfield  gsection">
									<h2 class="gsection_title">About You</h2>
									<div class="gsection_description">
										tell us a little about yourself
									</div>
								</li>
								<li class="gfield  gfield_contains_required">
									<label class="gfield_label" for="input_8_1_3">Name<span class="gfield_required">*</span></label>
									<div class="ginput_complex ginput_container" id="input_8_1">
										<span id="input_8_1_3_container" class="ginput_left">
										<input type="text" name="input_1.3" id="input_8_1_3" value="" tabindex="1">
										<label for="input_8_1_3">First</label></span><span id="input_8_1_6_container" class="ginput_right">
										<input type="text" name="input_1.6" id="input_8_1_6" value="" tabindex="2">
										<label for="input_8_1_6">Last</label></span>
									</div>
								</li>
								<li class="gfield">
									<label class="gfield_label" for="input_8_4_1">Address</label>
									<div class="ginput_complex ginput_container" id="input_8_4">
										<span class="ginput_full" id="input_8_4_1_container">
											<input type="text" name="input_4.1" id="input_8_4_1" value="" tabindex="3">
											<label for="input_8_4_1" id="input_8_4_1_label">Street Address</label></span><span class="ginput_left" id="input_8_4_3_container">
											<input type="text" name="input_4.3" id="input_8_4_3" value="" tabindex="4">
											<label for="input_8_4_3" id="input_8_4.3_label">City</label></span><span class="ginput_right" id="input_8_4_4_container">
											<select name="input_4.4" id="input_8_4_4" tabindex="5">
												<option value=""></option><option value="Alabama">Alabama</option><option value="Alaska">Alaska</option><option value="Arizona">Arizona</option>
											</select><label for="input_8_4_4" id="input_8_4_4_label">State</label></span><span class="ginput_left" id="input_8_4_5_container">
											<input type="text" name="input_4.5" id="input_8_4_5" value="" tabindex="7">
											<label for="input_8_4_5" id="input_8_4_5_label">Zip Code</label></span>
										<input type="hidden" class="gform_hidden" name="input_4.6" id="input_8_4_6" value="United States">
									</div>
								</li>
								<li id="field_8_2" class="gfield               gfield_contains_required">
									<label class="gfield_label" for="input_8_2">Email<span class="gfield_required">*</span></label>
									<div class="ginput_container">
										<input name="input_2" id="input_8_2" type="text" value="" class="medium" tabindex="8">
									</div>
								</li>
								<li id="field_8_5" class="gfield">
									<label class="gfield_label" for="input_8_5">Phone</label>
									<div class="ginput_container">
										<input name="input_5" id="input_8_5" type="text" value="" class="medium" tabindex="9">
									</div>
								</li>
								<li id="field_8_8" class="gfield  gsection">
									<h2 class="gsection_title">What's on your mind?</h2>
									<div class="gsection_description">
										Please let us know what's on your mind. Have a question for us? Ask away.
									</div>
								</li>
								<li id="field_8_3" class="gfield               gfield_contains_required">
									<label class="gfield_label" for="input_8_3">Your Comments/Quesitons<span class="gfield_required">*</span></label>
									<div class="ginput_container">
										<textarea name="input_3" id="input_8_3" class="textarea medium" tabindex="10" rows="10" cols="50"></textarea>
									</div>
								</li>
							</ul>
						</div>
						<div class="gform_footer top_label">
							<input type="submit" id="gform_submit_button_8" class="button gform_button" value="Submit" tabindex="12">
							<input type="hidden" class="gform_hidden" name="is_submit_8" value="1">
							<input type="hidden" class="gform_hidden" name="gform_submit" value="8">
							<input type="hidden" class="gform_hidden" name="gform_unique_id" value="50742d4291e1f">
							<input type="hidden" class="gform_hidden" name="state_8" value="YToyOntpOjA7czo2OiJhOjA6e30iO2k6MTtzOjMyOiIxMjdhYTM3NTY5MjVjMTg5NDk2ODhlZWIyNGM1NGVlZSI7fQ==">
							<input type="hidden" class="gform_hidden" name="gform_target_page_number_8" id="gform_target_page_number_8" value="0">
							<input type="hidden" class="gform_hidden" name="gform_source_page_number_8" id="gform_source_page_number_8" value="1">
							<input type="hidden" name="gform_field_values" value="">

						</div>
					</form>
				</div>

			</section>
		</article>
	</section>
	<aside class="sidebar" id="sidebar">
		<div class="widget-area">
			<?php include 'blocks/widgets/widget-search.php'; ?>
			<?php include 'blocks/widgets/widget-text.php'; ?>
			<?php include 'blocks/widgets/widget-categories.php'; ?>
			<?php include 'blocks/widgets/widget-archive.php'; ?>
			<?php include 'blocks/widgets/widget-pages.php'; ?>
			<?php include 'blocks/widgets/widget-gravityform.php'; ?>
		</div>
	</aside>
<?php include 'footer.php'; ?>