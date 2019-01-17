// Bubble.js
//
// Pete Baron 2016
//
// Bubble base 
//



function Bubble()
{
}


function BubbleExtend( _class, _ctorSignal )
{
	_class.prototype = Object.create( Bubble.prototype );
	_class.prototype.constructor = _class;		// crash here? did you use a string instead of a class object?

	if ( _ctorSignal )
	{
		Signals.add( _ctorSignal, CreateClass, null, _class, true );
	}
}


function CreateClass( _class, _arg1 )
{
	new _class( _arg1 );
}


function BubbleEnclose( _class, _enclosedClass )
{
	// _class can enclose multiple child bubbles
	if ( !_class.prototype.childBubbles )
	{
		_class.prototype.childBubbles = [ _enclosedClass ];
	}
	else
	{
		_class.prototype.childBubbles.push( _enclosedClass );
	}

	// _enclosedClass can only be enclosed by one parent bubble
	_enclosedClass.prototype.parentBubble = _class;
}
