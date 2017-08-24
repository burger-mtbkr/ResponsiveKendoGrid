/*
Author: Loan Burger - http://burger.kiwi
Widget which can make a Kendo UI grid behave in a responsive manner.

Usage:			$('#GridId').responsiveGrid({ columnsToShow: [], mobileWidth: 860, idColumn: 'Id', tools: ['excel'] });
Option:			{	columnsToShow: [], // column property names of columns to display data for.					
					mobileWidth: 860, // width in pixels below this will go to the responsive view
					idColumn: '', // Primary key of the Grid model e.g. DeviceId, or UserId - whatever your using in the grid as the primary key
					tools: [] // toolbar items e.g. Excel export ['excel']
				},

Limitations:	This will not allow grid row selection where the selection is managed by checkboxes.  You should use Kendo's build-in row selection behaviour.

License:

Copyright 2017 Loan Burger

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

$(function ()
{
	if (!$.widget)
	{
		throw Error('Requires JQuery Widget Factory');
	}

	$.widget("bh.responsiveGrid",
		{
			// default options
			options:
			{				
				columnsToShow: [],			
				mobileWidth: 860,// width in pixels below this will go to the responsive view
				idColumn: '',//'Id',					
				tools: []//['excel']
			},

			_grid: null,

			_gridColumns:[],

			_mobileTemplate: null,

			_mobileAltRowTemplate: null,		
		
			// the constructor
			_create: function ()
			{
				try
				{
					// Add class for theming
					var self = this;
					self.element.addClass('bh-responsive-grid');				

					if (!self.options.idColumn || self.options.columnsToShow.length < 1)
					{
						throw Error('Requires the primary key of the model to be specified as well as the columns to be used');
					}

					self._grid = (self.element).data('kendoGrid');
					if (self._grid)
					{
						self._gridColumns = self._grid.columns;					

						// build the mobiel templates for the grid
						self._buildTemplates();

						var doit;
						window.onresize = function ()
						{
							clearTimeout(doit);
							doit = setTimeout(function ()
							{
								self._goResponsive(self);
							}, 500);
						};

						// go responsive imeedately to validate if we need to resize or now.
						self._goResponsive(self);
					}			
				}
				catch (e)
				{
					alert(e);
				}
			},
			
			_goResponsive: function (self)
			{				
				if (window.innerWidth < self.options.mobileWidth)
				{
					self._showMobileGrid();
				}
				else
				{
					self._showFullGrid();
				}
				self._grid.refresh();
			},

			_buildTemplates: function ()
			{
				var self = this;

				self._mobileTemplate = '<tr data-uid="#: ' + self.options.idColumn + ' #"> <td><div>';
				self._mobileAltRowTemplate = '<tr class="k-alt" data-uid="#: ' + self.options.idColumn + ' #"><td><div>';

				var shownColumnCount = 0;

				for (var i in self.options.columnsToShow)
				{
					// iff we have added the max column counts in the template then exit.
					if (self.options.columnsToShow.length >= shownColumnCount)
					{
						var column = self.options.columnsToShow[i];											

						for (var j = 0; j < self._gridColumns.length; j++)
						{
							var kendoGridColumn = self._gridColumns[j];
							if (!kendoGridColumn.field)
							{
								continue;
							}

							if (column == kendoGridColumn.field)
							{
								if (kendoGridColumn.format)
								{
									// cleanup format
									var format = kendoGridColumn.format.replace('{0:', '').replace('}', '');

									// Handle date column formats - TODO may need to add more format options... {0:dd MMM yyyy}
									if (kendoGridColumn.format == '{0:dd MMM yyyy HH:mm:ss}' || kendoGridColumn.format == '{0:dd MMM yyyy}' || kendoGridColumn.format.indexOf('yyyy') > -1)
									{
										self._mobileTemplate += '<span><b>' + kendoGridColumn.title + ': #: kendo.toString(kendo.parseDate(' + kendoGridColumn.field + '), "' + format + '") #</b></span></br>';
										self._mobileAltRowTemplate += '<span><b>' + kendoGridColumn.title + ': #: kendo.toString(kendo.parseDate(' + kendoGridColumn.field + '), "' + format + '") #</b></span></br>';
									}
									else
									{
										// Maybe add a format for currency... 
										self._mobileTemplate += '<span><b>' + kendoGridColumn.title + ': #: kendo.toString(' + kendoGridColumn.field + ', "' + format + '") #</b></span></br>';
										self._mobileAltRowTemplate += '<span><b>' + kendoGridColumn.title + ': #: kendo.toString(' + kendoGridColumn.field + ', "' + format + '") #</b></span></br>';
									}
								}
								else
								{
									self._mobileTemplate += '<span><b>' + kendoGridColumn.title + ':</b> #if(typeof ' + kendoGridColumn.field + ' !== null && ' + kendoGridColumn.field + ' !== "" && typeof ' + kendoGridColumn.field + ' !== undefined) {##=' + kendoGridColumn.field + '##}else if( ' + kendoGridColumn.field + ' == false) {##=' + kendoGridColumn.field + '##} # </span ></br > ';
									self._mobileAltRowTemplate += '<span><b>' + kendoGridColumn.title + ':</b> #if(typeof ' + kendoGridColumn.field + ' !== null && ' + kendoGridColumn.field + ' !== "" && typeof ' + kendoGridColumn.field + ' !== undefined) {##=' + kendoGridColumn.field + '##}else if( ' + kendoGridColumn.field + ' == false) {##=' + kendoGridColumn.field + '##} # </span ></br > ';


									// Option 1:
									//self._mobileTemplate += '<span><b>' + kendoGridColumn.title + ':</b> #if(typeof ' + kendoGridColumn.field + ' !== null && ' + kendoGridColumn.field + ' !== "" && typeof ' + kendoGridColumn.field + ' !== undefined) {##=' + kendoGridColumn.field + '##}else if( ' + kendoGridColumn.field + ' == false) {##=' + kendoGridColumn.field + '##} # </span ></br > ';

									// Option 2
									//self._mobileAltRowTemplate += '<span><b>' + kendoGridColumn.title + ':</b> #= (' + kendoGridColumn.field + ' != null && typeof ' + kendoGridColumn.field + ' != undefined) ? ' + kendoGridColumn.field + ' : "" #</span></br>';
								}
							}
						}

						column.showResponsive = true;
						shownColumnCount++;
					}
					else
					{
						self._mobileTemplate += '</div></td></tr>';
						self._mobileAltRowTemplate += '</div></td></tr>';
						break;
					}					
				}
			},

			_DEPRICATED_buildTemplates: function ()
			{
				var self = this;

				self._mobileTemplate = '<tr data-uid="#: ' + self.options.idColumn + ' #"> <td><div>';
				self._mobileAltRowTemplate = '<tr class="k-alt" data-uid="#: ' + self.options.idColumn + ' #"><td><div>';

				var shownColumnCount = 0;
				for (var i = 0; i < self._gridColumns.length; i++)
				{
					var kendoGridColumn = self._gridColumns[i];

					if (!kendoGridColumn.field || kendoGridColumn.hidden)
					{
						continue;
					}

					// iff we have added the max column counts in the template then exit.
					if (shownColumnCount < self.options.columnsToShow.length)
					{
						if (shownColumnCount === 0)
						{
							kendoGridColumn.isHeader = true;
						}

						for (var j in self.options.columnsToShow)
						{
							var c = self.options.columnsToShow[j];
							if (c == kendoGridColumn.field)
							{
								if (kendoGridColumn.format)
								{
									// cleanup format
									var format = kendoGridColumn.format.replace('{0:', '').replace('}', '');

									// Handle date column formats - TODO may need to add more format options... {0:dd MMM yyyy}
									if (kendoGridColumn.format == '{0:dd MMM yyyy HH:mm:ss}' || kendoGridColumn.format == '{0:dd MMM yyyy}' || kendoGridColumn.format.indexOf('yyyy') > -1)
									{
										self._mobileTemplate += '<span><b>' + kendoGridColumn.title + ': #: kendo.toString(kendo.parseDate(' + kendoGridColumn.field + '), "' + format + '") #</b></span></br>';
										self._mobileAltRowTemplate += '<span><b>' + kendoGridColumn.title + ': #: kendo.toString(kendo.parseDate(' + kendoGridColumn.field + '), "' + format + '") #</b></span></br>';
									}
									else
									{
										// Maybe add a format for currency... 
										self._mobileTemplate += '<span><b>' + kendoGridColumn.title + ': #: kendo.toString(' + kendoGridColumn.field + ', "' + format + '") #</b></span></br>';
										self._mobileAltRowTemplate += '<span><b>' + kendoGridColumn.title + ': #: kendo.toString(' + kendoGridColumn.field + ', "' + format + '") #</b></span></br>';
									}
								}
								else
								{
									self._mobileTemplate += '<span><b>' + kendoGridColumn.title + ':</b> #if(' + kendoGridColumn.field + ' != null && ' + kendoGridColumn.field + ' != "" && ' + kendoGridColumn.field + ' != undefined) {##=' + kendoGridColumn.field + '##} # </span ></br > ';
									self._mobileAltRowTemplate += '<span><b>' + kendoGridColumn.title + ':</b> #if(' + kendoGridColumn.field + ' != null && ' + kendoGridColumn.field + ' != "" && ' + kendoGridColumn.field + ' != undefined) {##=' + kendoGridColumn.field + '##} # </span ></br > ';


									// Option 1:
									//self._mobileTemplate += '<span><b>' + kendoGridColumn.title + ':</b> #if(' + kendoGridColumn.field + ' != null && ' + kendoGridColumn.field + ' != "" && ' + kendoGridColumn.field + ' != undefined) {##=' + kendoGridColumn.field + '##} # </span ></br > ';

									// Option 2
									//self._mobileAltRowTemplate += '<span><b>' + kendoGridColumn.title + ':</b> #= (' + kendoGridColumn.field + ' != null && typeof ' + kendoGridColumn.field + ' != undefined) ? ' + kendoGridColumn.field + ' : "" #</span></br>';
								}
							}
						}

						kendoGridColumn.showResponsive = true;
					}
					else
					{
						self._mobileTemplate += '</div></td></tr>';
						self._mobileAltRowTemplate += '</div></td></tr>';
						break;
					}

					shownColumnCount++;
				}
			},

			_showMobileGrid: function ()
			{
				var self = this;
				if (self._grid.options.rowTemplate !== self._mobileTemplate)
				{
					for (var i = 0; i < self._gridColumns.length; i++)
					{
						var c = self._gridColumns[i];

						if (c.showResponsive)
						{
							if (c.isHeader)
							{
								continue;
							}
							self._grid.hideColumn(c.field);
						}					
					}

					if (self.options.tools && self.options.tools.length > 0)
					{
						self._grid.options.toolbar = [];
						self._grid.setOptions('toolbar', []);
					}

					// Switch remplates
					self._grid.options.rowTemplate = self._mobileTemplate;
					self._grid.options.altRowTemplate = self._mobileAltRowTemplate;
					self._grid.setOptions('rowTemplate', self._mobileTemplate);
					self._grid.setOptions('altRowTemplate', self._mobileAltRowTemplate);

					$('#'+self.element[0].id + ' .k-grid-header').hide();
				}			
			},

			_showFullGrid:function()
			{
				var self = this;
				if (self._grid.options.rowTemplate !== '')
				{
					for (var i = 0; i < self._gridColumns.length; i++)
					{
						var c = self._gridColumns[i];

						if (c.showResponsive)
						{
							self._grid.showColumn(c.field);
						}
					}

					// Switch remplates
					self._grid.options.rowTemplate = '';
					self._grid.setOptions('rowTemplate', '');
					self._grid.options.altRowTemplate = '';
					self._grid.setOptions('altRowTemplate', '');


					if (self.options.tools && self.options.tools.length > 0)
					{
						self._grid.options.toolbar = self.options.tools;
						self._grid.setOptions('toolbar', self.options.tools)						
					}

					$('#'+self.element[0].id + ' .k-grid-header').show();
				}
			},

			_destroy: function ()
			{

			},		

			_refresh: function ()
			{
				
			},

			_setOptions: function ()
			{
				this._superApply(arguments);
				this._refresh();
			},

			_setOption: function (key, value)
			{
				this._super(key, value);
			}
		
		});
});

