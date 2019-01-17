//
// SignalList.js
//
// Pete Baron 2016
//





function SignalList()
{
	this.listenerList = [];
	this.dispatchList = [];
	this.bubbleList = [];
}


SignalList.prototype.findSignals = function( _ctx, _bubble )
{
	// find all the _bubble type objects on _ctx

	for ( var f in _ctx )
	{
		if ( _ctx.hasOwnProperty( f ) )
		{
			if ( _ctx[ f ] && ( !_bubble || (_ctx[ f ].prototype instanceof _bubble) ) )
			{
				//if ( showChildren || !_ctx[f].prototype.parentBubble )
				//console.log( "\n", _bubble.name, f );
				this.findAllFunctions( f, _ctx[f] );
				obj = { name: f, parent: _ctx[f].prototype.parentBubble, children: _ctx[f].prototype.childBubbles };
				this.bubbleList.push( obj );
			}
		}
	}
};


SignalList.prototype.findAllFunctions = function( _bubbleName, _func )
{
	// find all functions in the _func object
	var proto = _func.prototype;
	for ( var f in proto )
	{
		if ( proto.hasOwnProperty( f ) )
		{
			if ( f != "parentBubble" && f != "childBubbles" && proto[ f ] )
			{
				this.findSignalsInFunction( _bubbleName, f, proto[ f ].toString() );
			}
		}
	}
};


// example lines to be parsed
// Signals.add( "bullet_fired", this.shotCounter, this, null, true );
// Signals.dispatch( "update", this );
SignalList.prototype.findSignalsInFunction = function( _bubbleName, _name, _funcString )
{
	// find all Signals commands in the _funcString (a function converted to a string)

	//console.log( "function: ", _name );

	var params, key, called, arg1;
	var obj;

	var lines = _funcString.split("\n");
	for(var i = 0, l = lines.length; i < l; i++)
	{
		// TODO: check it's not in a /* comment or a string...
		// (scan from start of _funcString down, the function itself can't be or it wouldn't show up)

		// get the line, remove leading and trailing whitespace
		var line = lines[i].trim();

		// detect comment at start of line
		if ( line.substr(0, 2) != "//" )
		{
			var s = line.search("Signals.add");
			if ( s != -1 )
			{
				params = line.split(',');                       // split the line using commas
				key = params[0].split("\"")[1];                 // pull out the first quoted string
				if ( !key )
				{
					key = params[0].split("\'")[1];             // (single quotes maybe?)
				}
				called = params[1].split( "this." )[1];         // get 2nd param and cut off this.
				key = key.trim();                               // trim off leading/trailing white-space
				called = called.trim();
				obj = { bubble: _bubbleName, from: _name, key: key, call: called };
				this.listenerList.push( obj );
				console.log( "Signals.add", obj );
			}
			
			s = lines[i].search("Signals.dispatch");
			if ( s != -1 )
			{
				params = line.split(',');                       // split the line using commas
				key = params[0].split("\"")[1];                 // pull out the first quoted string
				if ( !key )
				{
					key = params[0].split("\'")[1];             // (single quotes maybe?)
				}
				if ( params[1] )
				{
					arg1 = params[1].match(/(\w+\.\w+)\b/g);                // get 2nd param if it's XXX.YYY
					if ( !arg1 )
					{
						arg1 = params[1].match(/(\w+)\b/g);                 // get 2nd param if it's just XXX
					}
				}
				else
				{
					arg1 = ["null"];
				}
				obj = { bubble: _bubbleName, from: _name, key: key, arg1: arg1[0] };
				this.dispatchList.push( obj );
				console.log( "Signals.dispatch ", obj );
			}
		}
	}
};


// SignalList.prototype.findBubbleByName = function( _name )
// {
//     for( var i = 0, l = this.bubbleList.length; i < l; i++ )
//     {
//         if ( this.bubbleList[i].name == _name )
//         {
//             return this.bubbleList[i];
//         }
//     }
//     return null;
// };


SignalList.prototype.findListenersByKey = function( _key )
{
	var list = [];
	for( var i = 0, l = this.listenerList.length; i < l; i++ )
	{
		if ( this.listenerList[i].key == _key )
		{
			list.push( this.listenerList[i] );
		}
	}
	return list;
};
