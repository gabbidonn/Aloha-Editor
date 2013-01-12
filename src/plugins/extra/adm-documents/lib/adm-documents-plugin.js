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
	
	var GENTICS = window.GENTICS,
	pluginNamespace = 'extra-adm-document';
	
	
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
				
				var html = '<div class="doc_featuresZZ">';
						html += '<fieldset id="History">';
						html += '<legend>Revision History</legend><select name=\"ctl00$MainContent$HistorySelect\" onchange=\"javascript:setTimeout(\"__doPostBack(\'ctl00$MainContent$HistorySelect\',\'\')\', 0)\" id=\"ctl00_MainContent_HistorySelect\">';
						html += '<option selected="selected" value="1">2 - 12 Oct 12 15:09</option>';
						html += '<option value="0">1 - 12 Oct 12 15:09</option>';
						html += '<option value="0">1 - 12 Oct 12 15:09</option>';
						html += '</select></fieldset>';
						html += '</fieldset>';
						html += '<fieldset id="WarnNotAllTokens" runat="server" Visible="False">';
						html += 'Not All Tokens Are Shown <a onclick="removeMessages(); addMessage(this.title); showMessages(); this.blur(); return false;" onmouseover="ShowToolTip(this)" class="hand" href="#" title="Tokens which are locked to specific scheme question sets are not shown for this document because it is not assigned to a specific scheme. To see tokens for a specific scheme create a document for that scheme instead. You may still use tokens that are not shown in the list but they will only work when the document is generated for the related scheme and not if used for others"><img src="<%=ENVIRONMENT.MediaLib%>images/interface/icons/16x16/info.gif" alt=""/></a>';
						html += '</fieldset>';
						
						
						
						html += '</div>';
				
				var pl = this;
				pl.sidebar = sidebar;
				sidebar.addPanel( {

					id       : pl.nsClass( 'sidebar-panel-class' ),
					title    : 'Options and Preferences',
					content  : html,
					expanded : true,
					activeOn : true,

					onInit: function () {
										
					},

					onActivate: function ( effective ) {
						
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
