/*
@licstart  The following is the entire license notice for the 
JavaScript code in this page.

Copyright (C) 2018  Access42

The JavaScript code in this page is free software: you can
redistribute it and/or modify it under the terms of the GNU
General Public License (GNU GPL) as published by the Free Software
Foundation, either version 3 of the License, or (at your option)
any later version.  The code is distributed WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

As additional permission under GNU GPL version 3 section 7, you
may distribute non-source (e.g., minimized or compacted) forms of
that code without the copy of the GNU GPL normally required by
section 4, provided you include this license notice and a URL
through which recipients can access the Corresponding Source.   


@licend  The above is the entire license notice
for the JavaScript code in this page.
*/
/* eslint-disable */
/*** AccessConfig **/

var AccessConfig = (function() {
		
	'use strict '

	/*** Configuration **/
	var config = {
		Setup:{
			//id to catch in the html
			id:'accessconfig',
		},
		
		/**	
		General Setting 
		useExtendContrast : true for three choices (default, inverted, enforced), false for two choices (default, inverted)
		**/
		
		Setting: {
			useExtendContrast: true
		},
		BodyActive: {
			classSetting: 'active'
		},
		Overlay: {
			classSetting: 'overlay'
		},

		/** 
		Modal button and window container 
		**/
		
		ModalButton: {
			id: 'button'
		},
		ModalContainer: {
			classSetting: 'modal',
			titleLang: {
				en: 'Accessibility setting',
				fr: 'Paramètres d’accessibilité',
			},
			titleId: 'title',
			titleClass: 'title',
		}, 
		CloseButton: {
			id: 'close',
			classSetting: 'close',
			lang: {
				en: 'close',
				fr: 'fermer'
			},
			hiddenTextClass: 'sr-only'
		},

		/** 
		Inline content container 
		**/

		InlineContentContainer: {
			id: 'inline-c'
		},

		/** 
		Parameters checkboxes
		lang is based on html lang declaration, first entry is the default when html lang is unknow
		**/
		
		FormFieldsetContent: {
			classSetting: 'content'
		},
		FormFieldset: {
			classSetting: 'fieldset'
		},
		LegendFieldset: {
			classSetting: 'legend'
		},
		FormRadio:{
			classSetting: 'radio'
		},

		/** Contrast 
		value : className of the dedicated className style
		Important ! : value and id must be identical
		**/

		ContrastFieldset: {
			//caution : don't change
			id: 'contrast'
		},
		ContrastLegend: {
			lang: {
				en: 'Contrast',
				fr: 'Contrastes'
			}	
		},
		DefaultContrastCheckbox: {
			id: 'default-contrast',
			value: 'default-contrast',
			//caution : don't change
			groupName: 'contrast',
			//label
			lang: {
				en: 'Default',
				fr: 'Défaut'
			}
		},
		HighContrastCheckbox:{
			id: 'high-contrast',
			value: 'high-contrast',
			//caution : don't change
			groupName: 'contrast',
			//label
			lang: {
				en: 'Reinforce',
				fr: 'Renforcer'
			}
		},
		InvertContrastCheckbox:{
			id: 'inv-contrast',
			value: 'inv-contrast',
			//caution : don't change
			groupName: 'contrast',
			//label
			lang: {
				en: 'Reverse',
				fr: 'Inverser'
			}		
		},
		
		/** 
		Dyslexia font 
		**/
		
		DyslexiaFieldset: {
			//caution : don't change
			id: 'font'
		},
		DyslexiaLegend: {
			//label
			lang: {
				en: 'Font (dyslexia)',
				fr: 'Police (dyslexie)'
			}		
		},
		DefaultFontCheckbox:{
			id: 'default-font',
			value: 'default-font',
			//caution : don't change
			groupName: 'font',
			//label
			lang: {
				en: 'Default',
				fr: 'Défaut'
			}		
		},
		DyslexiaFontCheckbox:{
			id: 'dys-font',
			value: 'dys-font',
			//caution : don't change
			groupName: 'font',
			//label
			lang: {
				en: 'Adapt',
				fr: 'Adapter'
			}		
		},

		/** 
		Line spacing 
		**/
		
		LineSpacingFieldset: {
			//caution : don't change
			id: 'line-spacing'
		},
		LineSpacingLegend: {
			//label
			lang: {
				en: 'Line spacing',
				fr: 'Interlignage'
			}		
		},
		DefaultLineSpacingCheckbox:{
			id: 'default-spacing',
			value: 'default-spacing',
			//caution : don't change
			groupName: 'line-spacing',
			//label
			lang: {
				en: 'Default',
				fr: 'Défaut'
			}		
		},
		DyslexiaLineSpacingCheckbox:{
			id: 'dys-spacing',
			value: 'dys-spacing',
			//caution : don't change
			groupName: 'line-spacing',
			//label
			lang: {
				en: 'Increase',
				fr: 'Augmenter'
			}		
		},
	
		/** 
		Justification 
		**/

		JustificationFieldset: {
			//caution : don't change
			id: 'justification'
		},
		JustificationLegend: {
			//label
			lang: {
				en: 'Justification',
				fr: 'Justification'
			}		
		},
		DefaultJustificationCheckbox:{
			id: 'default-justification',
			value: 'default-justification',
			//caution : don't change
			groupName: 'justification',
			//label
			lang: {
				en: 'Default',
				fr: 'Défaut'
			}		
		},
		DyslexiaJustificationCheckbox:{
			id: 'cancel-justification',
			value: 'cancel-justification',
			//caution : don't change
			groupName: 'justification',
			//label
			lang: {
				en: 'Remove',
				fr: 'Supprimer'
			}		
		},
		
		/** 
		Image replacement 
		**/
		
		ImageReplacementFieldset: {
			//caution : don't change
			id: 'image'
		},
		ImageReplacementCSS: {
			//Css class to use on each image to replace
			replacementCss: 'replace-img',
			//Css class to style the replacement text
			replacementStyle: 'replace-style'
		},
		ImageReplacementLegend: {
			//label
			lang: {
				en: 'Images',
				fr: 'Images'
			}		
		},
		DefaultImageReplacementCheckbox:{
			id: 'default-img',
			value: 'default-img',
			//caution : don't change
			groupName: 'image',
			//label
			lang: {
				en: 'Default',
				fr: 'Défaut'
			}		
		},
		ImageReplacementCheckbox:{
			id: 'text-img',
			value: 'text-img',
			//caution : don't change
			groupName: 'image',
			//label
			lang: {
				en: 'Replace with text',
				fr: 'Remplacer par du texte'
			}		
		},	
	}
	//global
	var global = {
		mode: null,
		cookieName: null,
		openObj: null,
		imgTab : null,
		imgSpan: null
	}

	/** Onload */
	window.onload = function(){

		if(!document.querySelector( '[data-accessconfig-params]' )){
			console.log('AccessConfig warning : HTML missing')
		}else{
		/** Get parameters define in HTML code by user via data-accessconfig-params attribut (JSON format) **/
			var openButton = document.querySelector( '[data-accessconfig-params]' );
			global.userParams = JSON.parse(openButton.getAttribute( 'data-accessconfig-params' ));
			global.userParams.Prefix ? (userPrefix = global.userParams.Prefix) : (userPrefix = 'a42-ac');

			/** Set the setting form **/
			settingForm();

			/** Modal option**/
			if( global.userParams.Modal == true || global.userParams.Modal === undefined) {
				/** If user set data-accessconfig-param.Modal to true, then create a button to launch the modal **/
				var modalButton = document.createElement( 'button' );
				modalButton.setAttribute( 'id', userPrefix+'-'+config.ModalButton.id );
				modalButton.setAttribute( 'data-accessconfig-button','true' ); 

				var modalButtonText = document.querySelector( '[data-accessconfig-buttonname]' );		
				var modalButtonText = document.createTextNode(modalButtonText.getAttribute( 'data-accessconfig-buttonname' ));
				modalButton.appendChild(modalButtonText);

				var setup = document.getElementById(config.Setup.id);
				setup.appendChild(modalButton);

				/** Detect other button that can launch the modal by search to data-accessconfig-button="true" **/
				var otherOpenButton = document.querySelectorAll( '[data-accessconfig-button="true"]' );
				for (i = 0, len = otherOpenButton.length; i < len; i++ ){
					otherOpenButton[i].addEventListener( 'click', function(){
						dialog( this );
					}, false);
				}
			}

			// Contrast features
			if(global.userParams.Contrast != false){
				global.mode = userPrefix+'-'+config.ContrastFieldset.id;
				global.cookieName = 'contrast';
				setEvent();
			}
			// Font feature
			if(global.userParams.Font != false){
				global.mode = userPrefix+'-'+config.DyslexiaFieldset.id;
				global.cookieName = 'font';
				setEvent();
			}
			// Line spacing feature
			if(global.userParams.LineSpacing != false){
				global.mode = userPrefix+'-'+config.LineSpacingFieldset.id;
				global.cookieName = 'line-spacing';
				setEvent();
			}
			// Justification feature
			if(global.userParams.Justification != false){
				global.mode = userPrefix+'-'+config.JustificationFieldset.id;
				global.cookieName = 'justification';
				setEvent();
			}
			// Image replacement feature
			if(global.userParams.ImageReplacement != false){
				global.mode = userPrefix+'-'+config.ImageReplacementFieldset.id;
				global.cookieName = 'image';
				setImgtab();
				setEvent();
			}

		}
	}

	/** Dependencies **/
	/* Create modal or inline setting form : data-accessconfig-params = "Modal" */
	function settingForm(){

		//Constructor
		function $create (o) {
			var tn = o.tagName;
			var x = document.createElement(tn);
			for (var i in o) if (i!='tagName'&&typeof(o[i])!='function') x.setAttribute(i, o[i]);
			return x;
		}

		var langRef = setdefaultLang();
		var div = $create({tagName:'div', id:userPrefix, class:userPrefix});

		var fieldsetContent = $create( {tagName:'div', class:userPrefix+'-'+config.FormFieldsetContent.classSetting});
		
		// set modale
		if( global.userParams.Modal == true || global.userParams.Modal === undefined) {			
			//modale
			div.setAttribute( 'role', 'dialog' );
			div.setAttribute( 'aria-labelledby', userPrefix+'-'+config.ModalContainer.titleId );
			div.setAttribute( 'tabindex', '-1' );
			global.userParams.ContainerClass ? div.classList.add( userPrefix+'-'+global.userParams.ContainerClass ) : 
										   div.classList.add( userPrefix+'-'+config.ModalContainer.classSetting );
			//title
			var titleWindow = $create({tagName:'h1', id:userPrefix+'-'+config.ModalContainer.titleId});
			global.userParams.ModalTitle ? titleWindow.classList.add( userPrefix+global.userParams.ModalTitle ) : 
										   titleWindow.classList.add( userPrefix+'-'+config.ModalContainer.titleClass );
			var titleTxt = document.createTextNode( config.ModalContainer.titleLang[ langRef ]);
			titleWindow.appendChild( titleTxt );
			div.appendChild( titleWindow );
			//Close button
			var CClose = $create({tagName:'button', type:'button',id:userPrefix+'-'+config.CloseButton.id});
			global.userParams.ModalCloseButton ? CClose.classList.add( userPrefix+global.userParams.ModalCloseButton ) :
												 CClose.classList.add( userPrefix+'-'+config.CloseButton.classSetting );
			var SpanHidden = $create({tagName:'span', class:config.CloseButton.hiddenTextClass});
			var CloseTxt = document.createTextNode( config.CloseButton.lang[ langRef ]);
			SpanHidden.appendChild( CloseTxt );
			CClose.appendChild( SpanHidden );
			div.appendChild( CClose );
			div.appendChild(fieldsetContent);
		}
		else {
			//Inline form 
			var setupdiv = document.getElementById( config.Setup.id );
			setupdiv.appendChild(div);
			div.classList.add( userPrefix+'accessconfig-inline');
			div.appendChild(fieldsetContent);
		}

		/**
		Contrast features
		**/

		if(global.userParams.Contrast != false){

			var fieldset = $create({tagName:'fieldset', id:userPrefix+'-'+config.ContrastFieldset.id});
			var legend = document.createElement( 'legend' );
			var legendText = document.createTextNode( config.ContrastLegend.lang[ langRef ] );
			legend.appendChild( legendText );
			fieldset.appendChild( legend );

			/**Default option**/
			var CInput = $create({tagName:'input', type:'radio', checked:'checked', id:userPrefix+'-'+config.DefaultContrastCheckbox.id, value:userPrefix+'-'+config.DefaultContrastCheckbox.value, name:userPrefix+'-'+config.DefaultContrastCheckbox.groupName});
			var CLabel = $create({tagName:'label', for:userPrefix+'-'+config.DefaultContrastCheckbox.id});
			var defaultCText = document.createTextNode ( config.DefaultContrastCheckbox.lang[ langRef ] );
			CLabel.appendChild( defaultCText );
			fieldset.appendChild( CInput );
			fieldset.appendChild( CLabel );

			/**Alterntative option 1 : higher contrast**/
			if( config.Setting.useExtendContrast ) {
				var CInput = $create({tagName:'input', type:'radio', id:userPrefix+'-'+config.HighContrastCheckbox.id , value:userPrefix+'-'+config.HighContrastCheckbox.value, name:userPrefix+'-'+config.HighContrastCheckbox.groupName});
				var CLabel = $create({tagName:'label', for:userPrefix+'-'+config.HighContrastCheckbox.id});
				var defaultCText = document.createTextNode ( config.HighContrastCheckbox.lang[ langRef ] );
				CLabel.appendChild( defaultCText );
				fieldset.appendChild( CInput );
				fieldset.appendChild( CLabel );
			}

			/**Alterntative option 2 : inverted contrast**/
			var CInput = $create({tagName:'input', type:'radio', id:userPrefix+'-'+config.InvertContrastCheckbox.id, value:userPrefix+'-'+config.InvertContrastCheckbox.value, name:userPrefix+'-'+config.InvertContrastCheckbox.groupName});
			var CLabel = $create({tagName:'label', for:userPrefix+'-'+config.InvertContrastCheckbox.id});
			var defaultCText = document.createTextNode ( config.InvertContrastCheckbox.lang[ langRef ] );
			CLabel.appendChild( defaultCText );
			fieldset.appendChild( CInput );
			fieldset.appendChild( CLabel );
			fieldsetContent.appendChild( fieldset );
		}

		/**
		Font feature
		**/

		if(global.userParams.Font != false){
			var fieldset = $create({tagName:'fieldset', id:userPrefix+'-'+config.DyslexiaFieldset.id});
			var legend = document.createElement( 'legend' );
			var legendText = document.createTextNode( config.DyslexiaLegend.lang[ langRef ] );
			legend.appendChild( legendText );
			fieldset.appendChild( legend );

			/**Default option**/
			var CInput = $create({tagName:'input', type:'radio', checked:'checked', id:userPrefix+'-'+config.DefaultFontCheckbox.id, value:userPrefix+'-'+config.DefaultFontCheckbox.value, name:userPrefix+'-'+config.DefaultFontCheckbox.groupName});
			var CLabel = $create({tagName:'label', for:userPrefix+'-'+config.DefaultFontCheckbox.id});
			var defaultCText = document.createTextNode ( config.DefaultFontCheckbox.lang[ langRef ] );
			CLabel.appendChild( defaultCText );
			fieldset.appendChild( CInput );
			fieldset.appendChild( CLabel );
			
			/**Alternative option : alternative font OpenDyslexic**/
			var CInput = $create({tagName:'input', type:'radio', id:userPrefix+'-'+config.DyslexiaFontCheckbox.id, value:userPrefix+'-'+config.DyslexiaFontCheckbox.value, name:userPrefix+'-'+config.DyslexiaFontCheckbox.groupName});
			var CLabel = $create({tagName:'label', for:userPrefix+'-'+config.DyslexiaFontCheckbox.id});
			var defaultCText = document.createTextNode ( config.DyslexiaFontCheckbox.lang[ langRef ] );
			CLabel.appendChild( defaultCText );
			fieldset.appendChild( CInput );
			fieldset.appendChild( CLabel );
			fieldsetContent.appendChild( fieldset );
		}

		/**
		Line spacing feature
		**/

		if(global.userParams.LineSpacing != false){
			var fieldset = $create({tagName:'fieldset', id:userPrefix+'-'+config.LineSpacingFieldset.id});
			var legend = document.createElement( 'legend' );
			var legendText = document.createTextNode( config.LineSpacingLegend.lang[ langRef ] );
			legend.appendChild( legendText );
			fieldset.appendChild( legend );

			/**Default option**/
			var CInput = $create({tagName:'input', type:'radio',checked:'checked', id:userPrefix+'-'+config.DefaultLineSpacingCheckbox.id, value:userPrefix+'-'+config.DefaultLineSpacingCheckbox.value, name:userPrefix+'-'+config.DefaultLineSpacingCheckbox.groupName});
			var CLabel = $create({tagName:'label', for:userPrefix+'-'+config.DefaultLineSpacingCheckbox.id});
			var defaultCText = document.createTextNode ( config.DefaultLineSpacingCheckbox.lang[ langRef ] );
			CLabel.appendChild( defaultCText );
			fieldset.appendChild( CInput );
			fieldset.appendChild( CLabel );

			/**Alternative option : line spacing increase**/
			var CInput = $create({tagName:'input', type:'radio',id:userPrefix+'-'+config.DyslexiaLineSpacingCheckbox.id, value:userPrefix+'-'+config.DyslexiaLineSpacingCheckbox.value, name:userPrefix+'-'+config.DyslexiaLineSpacingCheckbox.groupName});
			var CLabel = $create({tagName:'label', for:userPrefix+'-'+config.DyslexiaLineSpacingCheckbox.id});
			var defaultCText = document.createTextNode ( config.DyslexiaLineSpacingCheckbox.lang[ langRef ] );
			CLabel.appendChild( defaultCText );
			fieldset.appendChild( CInput );
			fieldset.appendChild( CLabel );
			fieldsetContent.appendChild( fieldset );
		}

		/**
		Justification feature
		**/

		if(global.userParams.Justification != false){
			var fieldset = $create({tagName:'fieldset', id:userPrefix+'-'+config.JustificationFieldset.id});
			var legend = document.createElement( 'legend' );
			var legendText = document.createTextNode( config.JustificationLegend.lang[ langRef ] );
			legend.appendChild( legendText );
			fieldset.appendChild( legend );

			/**Default option**/
			var CInput = $create({tagName:'input', type:'radio',checked:'checked', id:userPrefix+'-'+config.DefaultJustificationCheckbox.id, value:userPrefix+'-'+config.DefaultJustificationCheckbox.value, name:userPrefix+'-'+config.DefaultJustificationCheckbox.groupName});
			var CLabel = $create({tagName:'label', for:userPrefix+'-'+config.DefaultJustificationCheckbox.id});
			var defaultCText = document.createTextNode ( config.DefaultJustificationCheckbox.lang[ langRef ] );
			CLabel.appendChild( defaultCText );
			fieldset.appendChild( CInput );
			fieldset.appendChild( CLabel );

			/**Alternative option : kill justification**/
			var CInput = $create({tagName:'input', type:'radio',id:userPrefix+'-'+config.DyslexiaJustificationCheckbox.id, value:userPrefix+'-'+config.DyslexiaJustificationCheckbox.value, name:userPrefix+'-'+config.DyslexiaJustificationCheckbox.groupName});
			var CLabel = $create({tagName:'label', for:userPrefix+'-'+config.DyslexiaJustificationCheckbox.id});
			var defaultCText = document.createTextNode ( config.DyslexiaJustificationCheckbox.lang[ langRef ] );
			CLabel.appendChild( defaultCText );
			fieldset.appendChild( CInput );
			fieldset.appendChild( CLabel );
			fieldsetContent.appendChild( fieldset );
		}

		/**
		Image replacement feature
		**/

		if(global.userParams.ImageReplacement != false){
			var fieldset = $create({tagName:'fieldset', id:userPrefix+'-'+config.ImageReplacementFieldset.id});
			var legend = document.createElement( 'legend' );
			var legendText = document.createTextNode( config.ImageReplacementLegend.lang[ langRef ] );
			legend.appendChild( legendText );
			fieldset.appendChild( legend );

			/**Default option**/
			var CInput = $create({tagName:'input', type:'radio',checked:'checked', id:userPrefix+'-'+config.DefaultImageReplacementCheckbox.id, value:userPrefix+'-'+config.DefaultImageReplacementCheckbox.value, name:userPrefix+'-'+config.DefaultImageReplacementCheckbox.groupName});
			var CLabel = $create({tagName:'label', for:userPrefix+'-'+config.DefaultImageReplacementCheckbox.id});
			var defaultCText = document.createTextNode ( config.DefaultImageReplacementCheckbox.lang[ langRef ] );
			CLabel.appendChild( defaultCText );
			fieldset.appendChild( CInput );
			fieldset.appendChild( CLabel );

			/**Alternative option : Image replacement**/
			var CInput = $create({tagName:'input', type:'radio', id:userPrefix+'-'+config.ImageReplacementCheckbox.id, value:userPrefix+'-'+config.ImageReplacementCheckbox.value, name:userPrefix+'-'+config.ImageReplacementCheckbox.groupName});
			var CLabel = $create({tagName:'label', for:userPrefix+'-'+config.ImageReplacementCheckbox.id});
			var defaultCText = document.createTextNode ( config.ImageReplacementCheckbox.lang[ langRef ] );
			CLabel.appendChild( defaultCText );
			fieldset.appendChild( CInput );
			fieldset.appendChild( CLabel );
			fieldsetContent.appendChild( fieldset );
		}

		/**Set generic class attributes on fieldset, legend and radio**/

		allFieldset = div.querySelectorAll( 'fieldset' );
		for (i = 0, len = allFieldset.length; i < len; i++ ){
			global.userParams.FormFieldset ? allFieldset[i].classList.add( userPrefix+global.userParams.FormFieldset ) : 
											 allFieldset[i].classList.add( userPrefix+'-'+config.FormFieldset.classSetting );
		}

		allLegend = div.querySelectorAll( 'legend' );
		for (i = 0, len = allLegend.length; i < len; i++ ){
			global.userParams.FormFieldsetLegend ? 	allLegend[i].classList.add( userPrefix+global.userParams.FormFieldsetLegend ) : 
													allLegend[i].classList.add( userPrefix+'-'+config.LegendFieldset.classSetting );
		}

		allRadio = div.querySelectorAll( 'input[type="radio"]' );
		for (i = 0, len = allRadio.length; i < len; i++ ){
			global.userParams.FormRadio ? 	allRadio[i].classList.add( userPrefix+global.userParams.FormRadio ) : 
											allRadio[i].classList.add( userPrefix+'-'+config.FormRadio.classSetting );
		}

		/** Set the modal **/
		var modalAttach = document.querySelector( 'body');
		var modalAttachFirstChild = modalAttach.firstChild;
		/** attach modal as the first child of body **/
		if( global.userParams.Modal == true || global.userParams.Modal === undefined) modalAttach.insertBefore( div, modalAttachFirstChild);
	}

	/** Get default language (based on lang attribute) **/
	function setdefaultLang(){
		var lang = document.querySelector( 'html' ).getAttribute( 'lang' );
		if( lang ){
			var ndx;
			( lang.indexOf( '-' ) > 0 ) ? ndx = lang.indexOf( '-' ) : ndx = 3;
			return lang.substring( 0, ndx );
		}
		else {
		 return 'en';
		}
	}

	/** Setting managers **/
	function setEvent(){
		var body = document.querySelector( 'body' );
		var fieldset = document.getElementById( global.mode );
		var checkBoxList = fieldset.querySelectorAll( 'input' );
		for (i = 0, len = checkBoxList.length; i < len; i++ ){
			checkBoxList[i].addEventListener( 'click', function(){
				setAdaptive( this );
			}, false);
		}
		var target = readCookie( global.cookieName );
		if( target ){

			body.classList.add( target );
			for (i = 0, len = checkBoxList.length; i < len; i++ ){
				checkBoxList[i].removeAttribute( 'checked' );
			}
			document.getElementById( target ).setAttribute( 'checked', 'checked');
		}
		//Setting image replacement
		if( body.classList.contains( userPrefix+'-'+config.DefaultImageReplacementCheckbox.value ) ){
			replaceImgSpan();
		}
		if( body.classList.contains( userPrefix+'-'+config.ImageReplacementCheckbox.value ) ){
			replaceImg();
		}
	}
	/**Set adaptive mode**/
	function setAdaptive( obj ){
		global.mode = obj.getAttribute( 'name' );
		global.cookieName = obj.getAttribute( 'name' );
		var fieldset = document.getElementById( global.mode );

		var checkBoxList = fieldset.querySelectorAll( 'input' );
		var body = document.querySelector( 'body' );
		for (i = 0, lenx = checkBoxList.length; i < lenx; i++ ){
			var value = checkBoxList[i].getAttribute( 'value' );
			checkBoxList[i].removeAttribute('checked');
			if( value === userPrefix+'-'+config.DefaultImageReplacementCheckbox.value){
				replaceImgSpan();
			}
				body.classList.remove( value );	
			
		}
		var newClass = obj.getAttribute( 'value' );
		obj.setAttribute( 'checked', 'checked' );
		var value = obj.getAttribute( 'value' );
			if( value === userPrefix+'-'+config.ImageReplacementCheckbox.value){
				replaceImg();
			}	
		body.classList.add( newClass );
		createCookie(global.cookieName, newClass,'180');
	}

	/**
	Image replacement helpers
	**/

	function setImgtab(){
		global.imgSpan = new Array;
		var selector = '.'+ userPrefix+'-'+config.ImageReplacementCSS.replacementCss;
		global.imgTab = document.querySelectorAll( selector );
		for (j = 0, len = global.imgTab.length; j < len; j++ ){
			var imgPReplacement = document.createElement( 'span' );
			var imgAlt = global.imgTab[j].getAttribute( 'alt' );
			var imgTxtReplacement = document.createTextNode( imgAlt );
			imgPReplacement.appendChild( imgTxtReplacement );
			imgPReplacement.classList.add( userPrefix+'-'+config.ImageReplacementCSS.replacementCss );
			imgPReplacement.classList.add( userPrefix+'-'+config.ImageReplacementCSS.replacementStyle );
			global.imgSpan[j] = imgPReplacement;
		}
	}
	function replaceImg(){
		for (j = 0, len = global.imgTab.length; j < len; j++ ){
			if( global.imgTab[j].parentNode ){
				var parent = global.imgTab[j].parentNode;
				global.imgTab[j] = parent.replaceChild( global.imgSpan[j], global.imgTab[j] );
			}
		}
	}
	function replaceImgSpan(){
		for (j = 0, len = global.imgSpan.length; j < len; j++ ){
			if( global.imgSpan[j].parentNode ){
				var parent = global.imgSpan[j].parentNode;
				global.imgSpan[j] = parent.replaceChild( global.imgTab[j], global.imgSpan[j] );
			}		
		}
	}

	/**
	Modal manager
	**/

	function dialog( returnTo ) {
		//on ajoute une classe au body
		document.body.classList.add(userPrefix+'-'+config.BodyActive.classSetting);
		var overlay = document.createElement( 'div' );
		overlay.classList.add( userPrefix+'-'+config.Overlay.classSetting );
		document.body.appendChild(overlay);

		//open
		global.openObj = document.getElementById( userPrefix );
		global.openObj.style.display = 'block';
		document.getElementById( userPrefix+'-'+config.CloseButton.id ).focus();
		//Init events
		//escape close
		document.addEventListener( 'keydown', escClose, false );
		//button close
		var closeButton = document.getElementById( userPrefix+'-'+config.CloseButton.id );
		closeButton.addEventListener( 'click', buttonClose, false );
		//trappingFocus
		document.addEventListener( 'focus', trappingFocus, true );
		//close functions
		function escClose( event ){
			if( event.keyCode === 27 ){
				global.openObj.style.display = 'none';
				returnTo.focus();
				//reset listener and object trapping focus
				document.removeEventListener( 'keydown', escClose , false );
				//on retire la  classe du body
				document.body.classList.remove(userPrefix+'-'+config.BodyActive.classSetting);
				var overlay = document.querySelector( '.'+userPrefix+'-'+config.Overlay.classSetting  );
				if(overlay){
					overlay.remove();
				}
				//global.openObj = null;
			}
		}
		function buttonClose(){
			global.openObj.style.display = 'none';
			returnTo.focus();
			//reset listener and object trapping focus
			closeButton.removeEventListener( 'click', buttonClose, false );
			//on retire la  classe du body
			document.body.classList.remove(userPrefix+'-'+config.BodyActive.classSetting);
			var overlay = document.querySelector( '.'+userPrefix+'-'+config.Overlay.classSetting  );
			if(overlay){
				overlay.remove();
			}
			//reset object trapping focus
			//global.openObj = null
		}
	}
	/* Generic trapping focus function (based on global.openObj setting) */
	function trappingFocus( event ){
		if ( global.openObj && !global.openObj.contains( event.target ) ) {
			event.stopPropagation();
			global.openObj.focus();
		}
	}

	/** 
		Cookies 
	**/
	function createCookie( name, value, days ) {
		if ( days ) {
			var datetime = new Date();
			datetime.setTime( datetime.getTime() + ( days * 24 * 60 * 60 * 1000 ) );
			var expires = "; expires=" + datetime.toGMTString();
		}
		else var expires = "";
		document.cookie = name + "=" + value + expires + "; path=/";
	}
	function readCookie( name ) {
		var nameEQ = userPrefix+'-'+name + "=";
		var ca = document.cookie.split( ';' );
		for(var i = 0; i < ca.length; i++ ) {
			var c = ca[i];
			while ( c.charAt(0) == ' ' ) c = c.substring( 1, c.length );
			if ( c.indexOf( nameEQ ) == 0 ) return c.substring( nameEQ.length, c.length );
		}
		return null;
	}
	function eraseCookie( name ) {
		createCookie( name , "", -1 );
	}
} )();

//Polyfill pour la méthode remove non disponible dans InternetExplorer 
//Credit : https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md

(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('remove')) {
      return;
    }
    Object.defineProperty(item, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove() {
        if (this.parentNode !== null)
          this.parentNode.removeChild(this);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);