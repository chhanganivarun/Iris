

export let sizedImages = function( images ){

	var sizes = {
		small: false,
		medium: false,
		large: false,
		huge: false
	}

	if( images.length <= 0 ) return sizes;

	for( var i = 0; i < images.length; i++ ){

		// spotify-styled images
		if( typeof(images[i].height) !== 'undefined' ){
			if( images[i].height > 800 ){
				sizes.huge = images[i].url;
			}else if( images[i].height > 600 ){
				sizes.large = images[i].url;
			}else if( images[i].height > 280 ){
				sizes.medium = images[i].url;
			}else{
				sizes.small = images[i].url;
			}

		// lastfm-styled images
		}else if( typeof(images[i].size) !== 'undefined' ){
			switch( images[i].size ){
				case 'mega':
				case 'extralarge':
					sizes.huge = images[i]['#text']
					break
				case 'large':
					sizes.large = images[i]['#text']
					break
				case 'medium':
					sizes.medium = images[i]['#text']
					break
				case 'small':
					sizes.small = images[i]['#text']
					break
			}

		// Mopidy-Images styled images
		}else if( typeof(images[i]) == 'string' ){
			sizes.small = images[i]
		}
	}

	if( !sizes.medium )	sizes.medium = sizes.small;
	if( !sizes.large ) sizes.large = sizes.medium;
	if( !sizes.huge ) sizes.huge = sizes.large;
	
	return sizes;
}

export let generateGuid = function(){
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	});
}


export let getCurrentPusherConnection = function( connections, connectionid ){
	function isCurrentConnection(connection){
		return connection.connectionid == newProps.pusher.connectionid;
	}
	
	var currentConnection = newProps.pusher.connections.find(isCurrentConnection);
	if( !currentConnection ) return false;

	return currentConnection;
}




/**
 * Figure out a URI's source namespace
 * @param uri = string
 **/
export let uriSource = function( uri ){
    var exploded = uri.split(':');
    return exploded[0]
}

export let sourceIcon = function( uri ){
	var source = uriSource(uri)
	switch( source ){
		case 'local':
		case 'm3u':
			return 'folder'
			break
		default:
			return source
	}
}



/**
 * Get an element from a URI
 * @param element = string, the element we wish to extract
 * @param uri = string
 **/
export let getFromUri = function( element, uri ){
    var exploded = uri.split(':');

    if( element == 'mbid'){
        var index = exploded.indexOf('mbid')
        return exploded[index+1]
    }

    if( exploded[0] == 'spotify' ){
	    if( element == 'userid' && exploded[1] == 'user' ) return exploded[2];
	    if( element == 'playlistid' && exploded[3] == 'playlist' ) return exploded[4];
	    if( element == 'artistid' && exploded[1] == 'artist' ) return exploded[2];
	    if( element == 'albumid' && exploded[1] == 'album' ) return exploded[2];
	    if( element == 'trackid' && exploded[1] == 'track' ) return exploded[2];
	    return null;
	}

	return null
}

/**
 * Identify what kind of asset a URI is (playlist, album, etc)
 * @param uri = string
 * @return string
 **/
export let uriType = function( uri ){
    var exploded = uri.split(':');

    if( exploded[0] == 'spotify' ){
    	switch( exploded[1] ){
    		case 'track':
    			return 'track'
    			break;
    		case 'artist':
    			return 'artist'
    			break;
    		case 'album':
    			return 'album'
    			break;
    		case 'user':
    			if( exploded[3] == 'playlist' ) return 'playlist'
    			if( exploded.length == 3 ) return 'user'
    			return null
    			break;
    	}
    }

    return null;
}

/**
 * Merge duplicated items in an array
 *
 * @param list Array the unclean array
 * @param key string = the unique key (uri, tlid, etc)
 **/
export let mergeDuplicates = function(list, key){
	var clean_list = [];
	var keyed_list  = {};

	for( var i in list ){
		var item = list[i]
		if( item[key] in keyed_list ){
			item = Object.assign({}, keyed_list[item[key]], item)
		}
		keyed_list[item[key]] = item;
	}

	for( i in keyed_list ){
		clean_list.push(keyed_list[i]);
	}

	return clean_list;
}