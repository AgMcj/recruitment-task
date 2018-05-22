if ( !am )
	var am = {};

am.table = function ( container, data, rowsPerPage, currentPage, paginationContainer ) {
	this._rowsPerPage = rowsPerPage;
	this._container = container;
	this._currentData = [];
	this._currentPage = currentPage;
	for ( let i = rowsPerPage * ( currentPage - 1 ); i < currentPage * rowsPerPage; i++ ) {
		if ( data[i] )
			this._currentData.push( data[i] );
	}
	var numberOfPages = Math.ceil( data.length / rowsPerPage );
	paginationContainer.innerHTML = this._createPaginationHtml( numberOfPages, paginationContainer );

	this._createTable();
}

am.table.prototype = {
	_currentPage: null,
	_container: null,
	_rowsPerPage: null,
	_currentData: null,
	_pagination: null,
	_startTableHtmlCode: '<table class="table table-striped ">' +
		'<thead><tr>' +
		'<th sort-type="int" scope="col">iD<span class="fa fa-sort-up fa-stack-1x"></span><span class="fa fa-sort-down"></span></th>' +
		'<th sort-type="string" scope="col">First Name<span class="fa fa-sort-up fa-stack-1x"></span><span class="fa fa-sort-down"></span></th>' +
		'<th sort-type="string" scope="col">Last Name<span class="fa fa-sort-up fa-stack-1x"></span><span class="fa fa-sort-down"></span></th>' +
		'<th sort-type="date" scope="col">Birth Date<span class="fa fa-sort-up fa-stack-1x"></span><span class="fa fa-sort-down "></span></th>' +
		'<th sort-type="string" scope="col">Company<span class="fa fa-sort-up fa-stack-1x"></span><span class="fa fa-sort-down "></span></th>' +
		'<th sort-type="int" scope="col">Note<span class="fa fa-sort-up fa-stack-1x"></span><span class="fa fa-sort-down"></span></th>' +
		'</tr></thead>' +
		'<tbody>',
	_createdHtml: "",
	_createTable: function () {
		this._createTableHtml( this._currentData );
		this._container.innerHTML = this._createdHtml;
		var that = this;
		var elementsToSortAsc = this._container.getElementsByClassName( "fa-sort-up" );
		for ( let i = 0; i < elementsToSortAsc.length; i++ ) {
			elementsToSortAsc[i].addEventListener( "click", function ( event ) { that._sortAsc( event ) } );
		}
		var elementsToSortDesc = this._container.getElementsByClassName( "fa-sort-down" );
		for ( let i = 0; i < elementsToSortDesc.length; i++ ) {
			elementsToSortDesc[i].addEventListener( "click", function ( event ) { that._sortDesc( event ) } );
		}
	},
	_createTableHtml: function ( data ) {
		this._createdHtml = this._startTableHtmlCode;
		for ( let i = 0; i < this._rowsPerPage; i++ ) {
			if ( data[i] ) {
				this._createdHtml += "<tr>";
				for ( var key in data[i] ) {
					if ( key == "id" )
						this._createdHtml += '<th scope="row">' + data[i][key] + '</th>';
					else
						this._createdHtml += '<td>' + data[i][key] + '</td>';
				}
				this._createdHtml += '</tr>';
			}
		}
		this._createdHtml += '</tbody></table>';
	},
	_createPaginationHtml: function ( numberOfPages, paginationContainer ) {
		var paginationHtml = '<a ' + ( this._currentPage > 1 ? ( "href='?page=" + ( this._currentPage - 1 ) + "'" ) : "disabled" ) + ' class="active" >&lt; back</a>';
		for ( let i = 1; i <= numberOfPages; i++ ) {
			if ( i == this._currentPage )
				paginationHtml += '<a disabled class="active">' + i + '</a>';
			else
				paginationHtml += '<a href="?page=' + i + '">' + i + '</a>';
		}
		paginationHtml += '<a ' + ( this._currentPage < numberOfPages ? ( "href='?page=" + ( this._currentPage + 1 ) + "'" ) : "disabled" ) + ' class="active">next &gt;</a>';
		return paginationHtml;
	},
	_sortAsc: function ( event ) {
		var that = this;
		function sortByKey( key ) {
			return function ( a, b ) {
				return a[key] < b[key] ? -1 : 1;
			}
		}

		function sortDateByKey( key ) {
			return function ( a, b ) {
				var date1 = that._makeISODate( a[key] );
				var date2 = that._makeISODate( b[key] );
				return date1 < date2 ? -1 : 1;
			}
		}

		var index = Array.prototype.indexOf.call( event.currentTarget.parentElement.parentElement.children, event.currentTarget.parentElement );
		var sortType = event.currentTarget.parentElement.attributes["sort-type"].value;
		var key = Object.keys( this._currentData[0] )[index];

		this._currentData.sort( sortByKey( key ) );
		if ( sortType == "date" ) {
			this._currentData.sort( sortDateByKey( key ) );
		}
		this._createTable();
	},
	_sortDesc: function ( event ) {
		var that = this;
		function sortByKey( key ) {
			return function ( a, b ) {
				return a[key] > b[key] ? -1 : 1;
			}
		}

		function sortDateByKey( key ) {
			return function ( a, b ) {
				var date1 = that._makeISODate( a[key] );
				var date2 = that._makeISODate( b[key] );
				return date1 > date2 ? -1 : 1;
			}
		}

		var index = Array.prototype.indexOf.call( event.currentTarget.parentElement.parentElement.children, event.currentTarget.parentElement );
		var sortType = event.currentTarget.parentElement.attributes["sort-type"].value;
		var key = Object.keys( this._currentData[0] )[index];

		this._currentData.sort( sortByKey( key ) );
		if ( sortType == "date" ) {
			this._currentData.sort( sortDateByKey( key ) );
		}
		this._createTable();
	},
	_makeISODate( stringDate ) {
		var dateAndTime1 = stringDate.split( " " );
		var DMY1 = dateAndTime1[0].split( "." );
		var HM1 = dateAndTime1[1].split( ":" );
		return new Date( DMY1[2], DMY1[1] - 1, DMY1[0], HM1[0], HM1[1], 0, 0 ).toISOString();
	}
}