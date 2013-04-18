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
	'ui/ui',
	'aloha/console',
	'PubSub',
	'css!admdocuments/css/admdocuments.css'], 
function(Aloha,jQuery, Plugin,console,module,PubSub) {

	'use strict';
	
	var GENTICS = window.GENTICS,
	pluginNamespace = 'admdocuments';
	
	return Plugin.create('admdocuments', {
        
        // duplicated code from link-plugin
			//Creates string with this component's namepsace prefixed the each classname
			nsClass: function () {
				var stringBuilder = [], prefix = pluginNamespace;
				jQuery.each( arguments, function () {
					stringBuilder.push( this == '' ? prefix : prefix + '-' + this );
				} );
				return jQuery.trim(stringBuilder.join(' '));
			},
        
        mediaPath: '', 
        
        dynamicFields : [],
        
        endorsementTypes : [],
        
        header : '',
        
        standardHeader: false,
        
        standardFooter: false,
        
        footer : '',
        
        headerAjaxCall : '',
        
        footerAjaxCall : '',
        
        sideBarContent: '',
        
        getDynamicFields : function() {
        	var pl = this;
        	var dynamicFieldsMarkup = '<fieldset id="ctl00_MainContent_WarnNotAllTokens">\
        							   Not All Tokens Are Shown <a class="hand" href="#" title="Tokens which are locked to specific scheme question sets are not shown for this document because it is not assigned to a specific scheme.\r\r' +
        							   'To see tokens for a specific scheme create a document for that scheme instead. You may still use tokens that are not shown in the list but they will only work when the document is generated' + 
        							   'for the related scheme and not if used for others">\
        							   <img src="' + pl.mediaPath + 'images/interface/icons/16x16/info.gif" alt=""></a>\
        							    </fieldset>';
        	
        	dynamicFieldsMarkup += '<fieldset id="TemplateFields">\
        							<legend>Dynamic Fields <a onclick="return false;"  class="hand" href="#"\
        							 title="Click on the document body where you want the field to appear and then click on the name of the' + 
        							 'field you want to add to the document">\
        							 <img src="' + pl.mediaPath + 'images/interface/icons/16x16/info.gif" alt=""></a>\
        							 </legend>\
        							 <div id="TokenContainer" class="doc_tokens">';
        	
        	Aloha.jQuery.each(pl.dynamicFields,function(i,item) {
        			
        			dynamicFieldsMarkup += '<a class="TemplateTokenContainer" href="#' + item[1] + '" title="' + item[1] + '">' + item[0] + '</a>';
        		
        	});
        	
        	dynamicFieldsMarkup += '</fieldset></div>';
        	
        	return dynamicFieldsMarkup;
        	
        },
        
        getEndorsementTypes : function() {
        	var pl = this;
        	
        	var markup = '<select name="EndorsementTypes" id="EndorsementTypes">';
        	
        	Aloha.jQuery.each(pl.endorsementTypes,function(i,item) {
        		
        		markup += '<option value="' + item + '">' + item + '</option>';
        		
        	});
        	
        	markup += '</select>';
        	
        	return markup;
        	
        	
        },
        getHeaderMarkup: function() {
						var pl = this;
						
						return '<p style="margin:0; padding:0;text-align:center;position:relative;">\
									<img id="displayHeader" style="max-width:1px;top:1px; border-bottom:2px dashed #dddddd;" alt="" src="' + pl.header + '" />\
								</p>';	
						
					},
		getFooterMarkup: function() {
					 	
					 	var pl = this;
					 	
					 	return '<p style="margin:0; padding:0;text-align:center;padding: 0px 0px;">\
									<img id="displayFooter" style="max-width:720px; position:relative; left:1px; bottom:2px; border-top:2px dashed #dddddd;" alt="" src="' + pl.footer + '" />\
								</p>';
					
		},
					
        
        initSidebar: function ( sidebar ) {
				
				var pl = this;
				pl.sidebar = sidebar;
				
				
				
				
				sidebar.addPanel( {

					id       : pl.nsClass( 'sidebar-panel-class' ),
					title    : 'Dynamic Fields',
					content  : pl.getDynamicFields(),
					expanded : false,
					activeOn : true,
					
					onInit: function () {
						
						var dynamicFieldPanelID = '#' + pl.nsClass( 'sidebar-panel-class' ) + ' a';
						
						
						
						this.content.find('a').each(function(i,val) {
							
							//add the dynamic fields to the 
							pl.dynamicFields.push(this);
							
						})
						.mousedown(function() {
							
							//add the field to the editor.
							//first check to see if the boundary inside the editor has been selected.
							if(Aloha.Selection.rangeObject.startContainer)
							{
								Aloha.Selection.rangeObject.startContainer
								.insertData(Aloha.Selection.rangeObject.startOffset,this.text);	
							}
							
						
						});
										
					},

					onActivate: function ( effective ) {
						
					}

				});
				
				
				
				sidebar.addPanel( {
					
					id       : pl.nsClass( 'sidebar-otheroptions-class' ),
					title    : 'Other Options',
					content  : '<fieldset id="TemplateOptions"><legend>Other Options</legend><h3>Header/Footer</h3>\
								<input type="checkbox" id="options-header"' + (pl.header !== '' && pl.header != 'undefined' ? ' checked ' : ' disabled ') + ' name="options-header" />\
								<label for="options-header">Standard Header</label>\
								<br />\
								<input type="checkbox" id="options-footer"' + (pl.footer !== '' && pl.footer != 'undefined' ? ' checked ' : ' disabled ') + '" name="options-footer" />\
								<label for="options-footer">Standard Footer</label>\
								<h3>Auto Generation</h3><p>Generate document if cases are:</p>' + 
								pl.getEndorsementTypes() + 
								'<h3>Email as Attachment</h3>\
								<input type="checkbox" id="options-emailattachment" name="options-emailattachment" />\
								<label for="options-emailattachment">Prefer attachments</label></fieldset>',
					expanded : false,
					activeOn : true,
					hasHeader: (pl.header !== '' && pl.header != 'undefined'),
					hasFooter: (pl.footer !== '' && pl.footer != 'undefined'),
					headerClick : function(chkbox) {
						
						//get a snapshot of the content in the editable container.
						var snapshotContent = Aloha.editables[0].snapshotContent;
						
						if(pl.headerAjaxCall)
						{
							//this.console.info("adm","Ajax Call Initiated.");
							jQuery.post(pl.headerAjaxCall,"header=" + chkbox.checked, function(data) {
								
								//set the standardHeader 
								pl.standardHeader = chkbox.checked;
								
								
							})
							
						}
						
						
						if(chkbox.checked)
						{
							
							//check to see if header is shown.
							if(jQuery('#displayHeader').length < 1)
							{
								Aloha.editables[0].setContents(
								pl.getHeaderMarkup() + Aloha.editables[0].snapshotContent 
								);
								
								
								setInterval(
								    function () {
								        jQuery('#displayHeader').animate({maxWidth:'720px'}, 1000);
								
								    },
								    100
								);
								
								
							}
							
						}
						else
						{
							
							jQuery('#displayHeader').remove();	
								 
						}
								
					},
					footerClick: function(chkbox) {
						
						//get a snapshot of the content in the editable container.
						var snapshotContent = Aloha.editables[0].snapshotContent;
						
						if(pl.footerAjaxCall)
						{
							
							//console.info("adm","Ajax Call for footer initiated")
							jQuery.post(pl.headerAjaxCall,"footer=" + chkbox.checked, function(data) {
								
								//set the standardfooter
								pl.standardFooter = chkbox.checked;
								
								
								
							})
						}
						
						
						if(chkbox.checked)
						{
							
							if(!jQuery('#displayFooter').length < 1) {
								
								//the checkbox has been ticked
								Aloha.editables[0].setContents(
								Aloha.editables[0].snapshotContent + pl.getFooterMarkup
								);
								
							}
							
						}
						else
						{
							
							//remove the image.
							jQuery('#displayFooter').remove();
							
						}
							
					},
					
					onInit: function () {
						
						var thispanel = this;
						
						var headerCheckbox = thispanel.content.find('#options-header');
						var footerCheckbox = thispanel.content.find('#options-footer');
						//lets bind to the panel content.
						headerCheckbox.click(function() {
							
							thispanel.headerClick(this); 
						
						});
						
						
						//console.info('adm','footerCheckbox');
						footerCheckbox.click(function() {
							
							thispanel.footerClick(this); 
							
						});
						
						
						/*Aloha.ready(function() {
						*/	
							
							if(thispanel.hasHeader && pl.standardHeader == true) {
								
								headerCheckbox.checked = true;
								thispanel.headerClick(headerCheckbox);
									
							}
								
							//TODO: we have to DRY this - it's doing the same things at the moment. 
							///		there's more scope here to change both hedaer and footer functionality but at this time the extra code isn't necessary.
							if(thispanel.hasFooter && pl.standardFooter == true) {
								
								footerCheckbox.checked = true;
								thispanel.footerClick(footerCheckbox);
									
							}	
							
							
						//});
						
						
						
										
					},

					onActivate: function ( effective ) {
						
					}

				} );
				
				
				sidebar.subscribeToEvents();
				sidebar.show();
			},
        
        init: function () {
			
			var me = this;
            
            if ( typeof Aloha.settings.plugins != 'undefined' 
				&& typeof Aloha.settings.plugins.admdocuments != 'undefined' ) {
				me.settings = Aloha.settings.plugins.admdocuments;
				
			}
            
            
            Aloha.ready(function () {
				
				if(me.settings.mediaPath) {
					me.mediaPath = me.settings.mediaPath;
				}
				if(me.settings.sideBarContent) {
					me.sideBarContent = me.settings.sideBarContent;	
				}
				if(me.settings.header) {
					me.header = me.settings.header
				}
				if(me.settings.footer) {
					me.footer = me.settings.footer
				}
				if(me.settings.dynamicFields) {
					me.dynamicFields = me.settings.dynamicFields
				}
				if(me.settings.endorsementTypes) {
					me.endorsementTypes = me.settings.endorsementTypes
				}
				
				if(me.settings.headerAjaxCall)
				{
					me.headerAjaxCall = me.settings.headerAjaxCall
				}
				
				if(me.settings.footerAjaxCall)
				{
					me.footerAjaxCall = me.settings.footerAjaxCall
				}
				
				if(me.settings.standardHeader)
				{
					me.standardHeader = me.settings.standardHeader
				}
				
				if(me.settings.standardFooter)
				{
					me.standardFooter = me.settings.standardFooter
				}
				
				
				//initialize the sidebar	
				me.initSidebar( Aloha.Sidebar.right );	
				
				/*PubSub.sub('aloha.smart-content-changed',function(eventArgument) {
					
					//eventArgument.event
					alert(eventArgument);
					var props = [];
                        for (var prop in eventArgument)
                       {
                              
                              props.push(prop);
                       }
                                            
                       $( '#doc_name' ).html(props.join("," ));  

					
					});
				*/
					
					
    		});
    		
    		
    		
        }
    	
    
    });
	
});
