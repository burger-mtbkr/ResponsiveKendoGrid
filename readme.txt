/*
Author: Lóan Burger - http://burger.kiwi
Widget which can make a Kendo UI grid behave in a responsive manner.

Usage:			$('#GridId').responsiveGrid({ columnsToShow: [], mobileWidth: 860, idColumn: 'Id', tools: ['excel'] });
Option:			{	columnsToShow: [], // column property names of columns to display data for.					
					mobileWidth: 860, // width in pixels below this will go to the responsive view
					idColumn: '', // Primary key of the Grid model e.g. DeviceId, or UserId - whatever your using in the grid as the primary key
					tools: [] // toolbar items e.g. Excel export ['excel']
				},

Limitations:	This will not allow grid row selection where the selection is managed by checkboxes.  You should use Kendo's build-in row selection behaviour.


License:

Copyright 2017 Lóan Burger

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
