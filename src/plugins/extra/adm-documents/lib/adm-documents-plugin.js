/*!
 * Aloha Editor
 * Author & Copyright (c) 2012 Gentics Software GmbH
 * aloha-sales@gentics.com
 * Licensed under the terms of http://www.aloha-editor.com/license.html
 *
 * @overfiew: Provides a development tool for Aloha Editor that shows the
 *            source around the selection inside an editable.
 */
define(
	['aloha',
	'jquery',
	'aloha/plugin',
	'aloha/console',
	'css!adm-documents/css/adm-documents.css'], 
function(Aloha,jQuery, Plugin,console,module) {

	'use strict';
	
	
	return Plugin.create('adm-documents', {
        
        // duplicated code from link-plugin
			//Creates string with this component's namepsace prefixed the each classname
			nsClass: function () {
				var stringBuilder = [], prefix = pluginNamespace;
				jQuery.each( arguments, function () {
					stringBuilder.push( this == '' ? prefix : prefix + '-' + this );
				} );
				return jQuery.trim(stringBuilder.join(' '));
			},
        
        initSidebar: function ( sidebar ) {
				var pl = this;
				pl.sidebar = sidebar;
				sidebar.addPanel( {

					id       : pl.nsClass( 'sidebar-panel-class' ),
					title    : 'Revision History',
					content  : '',
					expanded : true,
					activeOn : this.formatOptions || false,

					onInit: function () {
					},

					onActivate: function ( effective ) {
						var that = this;
						that.effective = effective;
					
						if ( !effective[0] ) {
							return;
						}
						that.format = effective[0].nodeName.toLowerCase();

						var dom = jQuery('<div>').attr('class', pl.nsClass( 'target-container' ));
						var fieldset = jQuery('<fieldset>');
						fieldset.append(jQuery('<legend>' + that.format + ' ' + i18n.t( 'format.class.legend' )).append(jQuery('<select>')));
					
						dom.append(fieldset);
					
						var html = 
							'<div class="' + pl.nsClass( 'target-container' ) + '"><fieldset><legend>' + i18n.t( 'format.class.legend' ) + '</legend><select name="targetGroup" class="' + pl.nsClass( 'radioTarget' ) + '">' + 
							'<option value="">' + i18n.t( 'format.class.none' ) + '</option>';

							if ( pl.config[that.format] && pl.config[that.format]['class'] ) {
								jQuery.each(pl.config[that.format]['class'], function(i ,v) {
									html += '<option value="' + i + '" >' + v + '</option>';
								});
							}

							html += '</select></fieldset></div>';

						var that = this,
							content = this.setContent(html).content; 

						 jQuery( pl.nsSel( 'framename' ) ).live( 'keyup', function () {
							jQuery( that.effective ).attr( 'target', jQuery( this ).val().replace( '\"', '&quot;' ).replace( "'", "&#39;" ) );
						 } );
					

						var that = this;
						that.effective = effective;
						jQuery( pl.nsSel( 'linkTitle' ) ).val( jQuery( that.effective ).attr( 'title' ) );
					}

				} );

				sidebar.show();
			},
        
        init: function () {
            
            var me = this;
            
            // Executed on plugin initialization
            console.log(this.settings.value);
            Aloha.jQuery('.editable').aloha();
    		
    		
    		
    		Aloha.ready(function () {

			me.initSidebar( Aloha.Sidebar.right );	

		        /*if (!Aloha.isPluginLoaded('adm-documents')) {
		            //Aloha.Sidebar.right.addPanel(Panel);
		            return;
		        }*/

    		});
    		
    		
    		
    		
        },
    	
    
    });
	
});
