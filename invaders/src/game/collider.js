//
// collider.js
//
// Pete Baron 2016
//
// bubble to detect collisions between rectangular objects
// objects must have properties name,x,y,image where image has properties cellWide and cellHigh and x is the centre while y is the top
// name is appended to the collision signal when an overlap is detected "collision_<name>"
//


collider = function()
{
	this.list = [];
	this.changes = [];

	Signals.add( "update", this.update, this, null, true );
	Signals.add( "collider_add", this.add, this, null, true );
	Signals.add( "collider_remove", this.remove, this, null, true );
};


BubbleExtend( collider, "game_start" );


collider.prototype.overlap = function( _obj1, _obj2 )
{
	var w1 = _obj1.image.cellWide;
	var l1 = _obj1.x - w1 / 2;

	var w2 = _obj2.image.cellWide;
	var l2 = _obj2.x - w2 / 2;

	if ( l1 + w1 < l2 )
	{
		return false;
	}
	if ( l2 + w2 < l1 )
	{
		return false;
	}
	if ( _obj1.y + _obj1.image.cellHigh < _obj2.y )
	{
		return false;
	}
	if ( _obj2.y + _obj2.image.cellHigh < _obj1.y )
	{
		return false;
	}
	return true;
};


collider.prototype.update = function()
{
	if ( this.list )
	{
		// apply changes (add/remove) to the list
		this.applyChanges();

		// test all colliders against all others
		for( var i = this.list.length - 1; i >= 1; --i )
		{
			for( var j = i - 1; j >= 0; --j )
			{
				if ( this.overlap( this.list[i], this.list[j] ) )
				{
					Signals.dispatch( "collision", { who: this.list[i], what: this.list[j] } );
					Signals.dispatch( "collision", { who: this.list[j], what: this.list[i] } );
				}
			}
		}
	}
};


// apply any changes made to the collider list
collider.prototype.applyChanges = function()
{
	for( var i = this.changes.length - 1; i >= 0; --i )
	{
		if ( this.changes[i].add )
		{
			this.list.push( this.changes[i].add );
		}
		else if ( this.changes[i].remove )
		{
			var j = this.list.indexOf( this.changes[i].remove );
			if ( j != -1 )
			{
				this.list.splice( j, 1 );
			}
		}
	}
	this.changes = [];
};


collider.prototype.add = function( _arg1, _object )
{
	// no duplicates!
	var i = this.list.indexOf( _object );
	if ( i === -1 )
	{
		this.changes.push( { add: _object } );
	}
	else
	{
		console.log( "WARNING: collider.add attempted to add a repeat", _object.name, i );
	}
};


collider.prototype.remove = function( _arg1, _object )
{
	var i = this.list.indexOf( _object );
	if ( i !== -1 )
	{
		this.changes.push( { remove: _object } );
	}
	else
	{
		console.log( "WARNING: collider.remove attempted to remove an object that isn't in the list", _object.name );
	}
};


