//
// Signals.js
//
// 2016 Pete Baron
//


// NOTE: possibly adjust to use linked list to avoid array grow/shrink?  (Probably doesn't matter in JS)

// TODO: add one time listeners that auto-remove for e.g. "start_timer"
// TODO: split keys on '.' and allow listeners for XXXX.* to hear all XXXX.???? signals (e.g. "collider.*" hears "collider.add", "collider.remove")


Signals = {
	activeList: [],
	inactiveList: [],
	debug: false
};


// add a listener called _key, this listener will be called *after* all previously added listeners on the same key
// if a listener exists with that _key and _callback, it will be replaced
// dispatch with _key will call _callback with _context and pass _arg1 as the first argument
// if the _key already exists, different _callback values will all listen to dispatch for that _key, in the order they are added
// a _callback added with a key can be added again with a different key, either key dispatch will reach the callback function
Signals.add = function( _key, _callback, _context, _arg1, _activate )
{
	if ( !_callback )
	{
		// listeners must have something to call when dispatched
		return false;
	}

	if ( _activate )
	{
		if ( !Signals.activeList[ _key ] )
		{
			Signals.activeList[ _key ] = [];
		}

		Signals.activeList[ _key ].push(
		{
			callback: _callback,
			context: _context,
			arg1: _arg1
		} );
	}
	else
	{
		if ( !Signals.inactiveList[ _key ] )
		{
			Signals.inactiveList[ _key ] = [];
		}

		Signals.inactiveList[ _key ].push(
		{
			callback: _callback,
			context: _context,
			arg1: _arg1
		} );
	}

	if ( Signals.debug )
	{
		console.log( "Signals.add", (_activate ? "active":"inactive"), _key, _callback.name );
	}
};


// if _callback is undefined or null, activate all listeners for _key
Signals.activate = function( _key, _callback, _context )
{
	if ( Signals.inactiveList[ _key ] )
	{
		var il = Signals.inactiveList[ _key ];
		for ( var i = il.length - 1; i >= 0; --i )
		{
			var listener = il[i];
			if ( ( !_callback || listener.callback == _callback ) && 
				 ( !_context || listener.context == _context ) )
			{
				if ( !Signals.activeList[ _key ] )
				{
					Signals.activeList[ _key ] = [ listener ];
				}
				else
				{
					Signals.activeList[ _key ].push( listener );
				}
				Signals.inactiveList[ _key ].splice( i, 1 );
			}
		}
	}
};


// if _callback is undefined or null, deactivate all listeners for _key
Signals.deactivate = function( _key, _callback, _context )
{
	if ( Signals.activeList[ _key ] )
	{
		var al = Signals.activeList[ _key ];
		for ( var i = al.length - 1; i >= 0; --i )
		{
			var listener = al[i];
			if ( ( !_callback || listener.callback == _callback ) && 
				 ( !_context || listener.context == _context ) )
			{
				if ( !Signals.inactiveList[ _key ] )
				{
					Signals.inactiveList[ _key ] = [ listener ];
				}
				else
				{
					Signals.inactiveList[ _key ].push( listener );
				}
				Signals.activeList[ _key ].splice( i, 1 );
			}
		}
	}
};


// remove the single listener called _key with _callback
// if _callback is undefined or null, remove all listeners for _key
Signals.remove = function( _key, _callback, _context )
{
	if ( !_callback )
	{
		if ( Signals.debug )
		{
			console.log( "Signals.remove all of", _key );
		}
		if ( Signals.activeList[ _key ] )
		{
			delete Signals.activeList[ _key ];
		}
		if ( Signals.inactiveList[ _key ] )
		{
			delete Signals.inactiveList[ _key ];
		}
		return true;
	}

	var ret = false, i, l, listener;
	var al = Signals.activeList[ _key ];
	for ( i = 0, l = al.length; i < l; i++ )
	{
		listener = al[ i ];
		if ( listener.callback == _callback && 
			( !_context || listener.context == _context ))
		{
			if ( Signals.debug )
			{
				console.log( "Signals.remove", _key, _callback.name );
			}
			al.splice( i, 1 );
			ret = true;
			break;
		}
	}

	var il = Signals.inactiveList[ _key ];
	for ( i = 0, l = il.length; i < l; i++ )
	{
		listener = il[ i ];
		if ( listener.callback == _callback && 
			( !_context || listener.context == _context ))
		{
			if ( Signals.debug )
			{
				console.log( "Signals.remove", _key, _callback.name );
			}
			il.splice( i, 1 );
			ret = true;
			break;
		}
	}

	// _callback was specified but didn't belong to _key
	return ret;
};


// dispatch to all active listeners called _key, passing _arg2 as a second argument
Signals.dispatch = function( _key, _arg2 )
{
	// find all listeners called _key
	var tmp = Signals.activeList[ _key ];
	if ( !tmp || tmp.length === 0 )
	{
		// that _key is not defined
		return false;
	}

	if ( Signals.debug && _key !== "system_tick" && _key !== "game_tick" && _key !== "update" && _key !== "draw" )
	{
		console.log( "Signals.dispatch", _key );
	}

	var ret = false;
	var listeners = tmp.slice();

	// for all listeners found
	for ( var i = 0, l = listeners.length; i < l; i++)
	{
		var listener = listeners[ i ];
		// call the listener's callback
		listener.callback.call( listener.context, listener.arg1, _arg2 );
		ret = true;
	}

	return ret;
};


