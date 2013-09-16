<?php include 'header.php'; ?>
<section id="content">
	<?php include 'blocks/breadcrumb.php'; ?>

	<h1 class="page-title">Page contact avec Gravity form</h1>
	<article class="entry">
		<section class="entry-content">
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
											<option value=""></option><option value="Alabama">Alabama</option><option value="Alaska">Alaska</option><option value="Arizona">Arizona</option><option value="Arkansas">Arkansas</option><option value="California">California</option><option value="Colorado">Colorado</option><option value="Connecticut">Connecticut</option><option value="Delaware">Delaware</option><option value="District of Columbia">District of Columbia</option><option value="Florida">Florida</option><option value="Georgia">Georgia</option><option value="Hawaii">Hawaii</option><option value="Idaho">Idaho</option><option value="Illinois">Illinois</option><option value="Indiana">Indiana</option><option value="Iowa">Iowa</option><option value="Kansas">Kansas</option><option value="Kentucky">Kentucky</option><option value="Louisiana">Louisiana</option><option value="Maine">Maine</option><option value="Maryland">Maryland</option><option value="Massachusetts">Massachusetts</option><option value="Michigan">Michigan</option><option value="Minnesota">Minnesota</option><option value="Mississippi">Mississippi</option><option value="Missouri">Missouri</option><option value="Montana">Montana</option><option value="Nebraska">Nebraska</option><option value="Nevada">Nevada</option><option value="New Hampshire">New Hampshire</option><option value="New Jersey">New Jersey</option><option value="New Mexico">New Mexico</option><option value="New York">New York</option><option value="North Carolina">North Carolina</option><option value="North Dakota">North Dakota</option><option value="Ohio">Ohio</option><option value="Oklahoma">Oklahoma</option><option value="Oregon">Oregon</option><option value="Pennsylvania">Pennsylvania</option><option value="Rhode Island">Rhode Island</option><option value="South Carolina">South Carolina</option><option value="South Dakota">South Dakota</option><option value="Tennessee">Tennessee</option><option value="Texas">Texas</option><option value="Utah">Utah</option><option value="Vermont">Vermont</option><option value="Virginia" selected="selected">Virginia</option><option value="Washington">Washington</option><option value="West Virginia">West Virginia</option><option value="Wisconsin">Wisconsin</option><option value="Wyoming">Wyoming</option><option value="Armed Forces Americas">Armed Forces Americas</option><option value="Armed Forces Europe">Armed Forces Europe</option><option value="Armed Forces Pacific">Armed Forces Pacific</option>
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
</div>								</li>
							<li id="field_8_6" class="gfield">
								<label class="gfield_label" for="input_8_6">Captcha</label>
								<script type="text/javascript">
									var RecaptchaOptions = {
										theme : 'white'
									};
									if (parseInt('11') > 0) {
										RecaptchaOptions.tabindex = 11;
									}
								</script>
								<div class="ginput_container" id="input_8_6">
									<script type="text/javascript" src="http://www.google.com/recaptcha/api/challenge?k=6LezBAgAAAAAAMNZeJQDT44f6kBZo9qQKct5g4bX&amp;hl=en"></script><script type="text/javascript" src="http://www.google.com/recaptcha/api/js/recaptcha.js"></script>
									<div id="recaptcha_widget_div" style="" class=" recaptcha_nothad_incorrect_sol recaptcha_isnot_showing_audio">
										<div id="recaptcha_area">
											<table id="recaptcha_table" class="recaptchatable recaptcha_theme_white">
												<tbody>
													<tr>
														<td colspan="6" class="recaptcha_r1_c1"></td>
													</tr>
													<tr>
														<td class="recaptcha_r2_c1"></td><td colspan="4" class="recaptcha_image_cell">
														<div id="recaptcha_image" style="width: 300px; height: 57px; "><img style="display:block;" alt="reCAPTCHA challenge image" height="57" width="300" src="http://www.google.com/recaptcha/api/image?c=03AHJ_Vutqmd2MV5aZBaSfcP2BrZxJea220Nsmfex8rWendnRQRF_XNLx4EB9-k1iGuciPOgvqxXVi63G_Vu7bVSdGlrIoiutVjdT_AFYtf9rZalQFDXoPQK7IjJ7PRPfmLhK1UFGkiI5poFoR49k7XTQN2XUz8jLvjA">
														</div></td><td class="recaptcha_r2_c2"></td>
													</tr>
													<tr>
														<td rowspan="6" class="recaptcha_r3_c1"></td><td colspan="4" class="recaptcha_r3_c2"></td><td rowspan="6" class="recaptcha_r3_c3"></td>
													</tr>
													<tr>
														<td rowspan="3" class="recaptcha_r4_c1" height="49">
														<div class="recaptcha_input_area">
															<label for="recaptcha_response_field" class="recaptcha_input_area_text"><span id="recaptcha_instructions_image" class="recaptcha_only_if_image recaptcha_only_if_no_incorrect_sol">Type the two words:</span><span id="recaptcha_instructions_audio" class="recaptcha_only_if_no_incorrect_sol recaptcha_only_if_audio">Type what you hear:</span><span id="recaptcha_instructions_error" class="recaptcha_only_if_incorrect_sol">Incorrect. Try again.</span></label>
															<br>
															<span id="recaptcha_challenge_field_holder" style="display: none; ">
																<input type="hidden" name="recaptcha_challenge_field" id="recaptcha_challenge_field" value="03AHJ_Vutqmd2MV5aZBaSfcP2BrZxJea220Nsmfex8rWendnRQRF_XNLx4EB9-k1iGuciPOgvqxXVi63G_Vu7bVSdGlrIoiutVjdT_AFYtf9rZalQFDXoPQK7IjJ7PRPfmLhK1UFGkiI5poFoR49k7XTQN2XUz8jLvjA">
															</span>
															<input name="recaptcha_response_field" id="recaptcha_response_field" type="text" autocorrect="off" autocapitalize="off" autocomplete="off" tabindex="11">
														</div></td><td rowspan="4" class="recaptcha_r4_c2"></td><td><a id="recaptcha_reload_btn" title="Get a new challenge" href="javascript:Recaptcha.reload();" tabindex="12"><img id="recaptcha_reload" width="25" height="17" src="http://www.google.com/recaptcha/api/img/white/refresh.gif" alt="Get a new challenge"></a></td><td rowspan="4" class="recaptcha_r4_c4"></td>
													</tr>
													<tr>
														<td><a id="recaptcha_switch_audio_btn" class="recaptcha_only_if_image" title="Get an audio challenge" href="javascript:Recaptcha.switch_type('audio');" tabindex="13"><img id="recaptcha_switch_audio" width="25" height="16" alt="Get an audio challenge" src="http://www.google.com/recaptcha/api/img/white/audio.gif"></a><a id="recaptcha_switch_img_btn" class="recaptcha_only_if_audio" title="Get a visual challenge" href="javascript:Recaptcha.switch_type('image');" tabindex="14"><img id="recaptcha_switch_img" width="25" height="16" alt="Get a visual challenge" src="http://www.google.com/recaptcha/api/img/white/text.gif"></a></td>
													</tr>
													<tr>
														<td><a id="recaptcha_whatsthis_btn" title="Help" href="http://www.google.com/recaptcha/help?c=03AHJ_Vutqmd2MV5aZBaSfcP2BrZxJea220Nsmfex8rWendnRQRF_XNLx4EB9-k1iGuciPOgvqxXVi63G_Vu7bVSdGlrIoiutVjdT_AFYtf9rZalQFDXoPQK7IjJ7PRPfmLhK1UFGkiI5poFoR49k7XTQN2XUz8jLvjA&amp;hl=en" target="_blank" tabindex="15"><img id="recaptcha_whatsthis" width="25" height="16" src="http://www.google.com/recaptcha/api/img/white/help.gif" alt="Help"></a></td>
													</tr>
													<tr>
														<td class="recaptcha_r7_c1"></td><td class="recaptcha_r8_c1"></td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
									<script>
										Recaptcha.widget = Recaptcha.$("recaptcha_widget_div");
										Recaptcha.challenge_callback();
									</script>

									<noscript>
										&lt;iframe src="http://www.google.com/recaptcha/api/noscript?k=6LezBAgAAAAAAMNZeJQDT44f6kBZo9qQKct5g4bX" height="300" width="500" frameborder="0"&gt;&lt;/iframe&gt;&lt;br/&gt;
										&lt;textarea name="recaptcha_challenge_field" rows="3" cols="40"&gt;&lt;/textarea&gt;
										&lt;input type="hidden" name="recaptcha_response_field" value="manual_challenge"/&gt;
									</noscript>
								</div>
								<div class="gfield_description">
									please help us prevent spam by typing the letters into the field above.
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
<aside id="sidebar">
	<div class="widget-area">
		<?php include 'blocks/widgets/widget-search.php'; ?>
		<?php include 'blocks/widgets/widget-gravityform.php'; ?>
		<?php include 'blocks/widgets/widget-text.php'; ?>
		<?php include 'blocks/widgets/widget-categories.php'; ?>
		<?php include 'blocks/widgets/widget-archive.php'; ?>
		<?php include 'blocks/widgets/widget-pages.php'; ?>
	</div>
</aside>
<?php include 'footer.php';
?>