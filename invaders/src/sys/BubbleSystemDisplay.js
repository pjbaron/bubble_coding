//
// BubbleSystemDisplay.js
//
// Pete Baron 2016
//




function BubbleSystemDisplay( _root )
{
	this.canvas = null;
	this.ctx = null;
	this.cursor = "default";

    // create a canvas (hijack the Bubble system to use Bubble components) into my this.canvas/this.ctx variables
    new Canvas();
    Signals.dispatch( "create_canvas", { width: window.width, height: window.height, owner: this } );

	// acquire a list of all bubbles and signals from the source
	this.signalList = new SignalList();
	this.signalList.findSignals( _root, Bubble );

	this.bubbles = [];
	this.wires = null;

	this.mouseDown = null;
	this.mouseUp = null;
	this.mouseMove = null;
	this.mouseDrag = null;

	this.data = null;
}


// return a new array with all duplicates removed, using .bubble, .from, and .key strings as the matching criteria
BubbleSystemDisplay.prototype.removeDuplicates = function( _list )
{
    var seen = {};
    var out = [];
    var j = 0;
    for(var i = 0, l = _list.length; i < l; i++)
    {
		var item = _list[i];
		var matchString = item.bubble + item.from + item.key;
		if (seen[matchString] !== true)
		{
			seen[matchString] = true;
			out[j++] = item;
		}
    }
    return out;
};


BubbleSystemDisplay.prototype.create = function()
{
	// pause the game while we draw the bubble graph
	pauseGame = true;

	var i, l, j, k;

	var bl = this.signalList.bubbleList;
	var ll = this.signalList.listenerList;
	var dl = this.removeDuplicates( this.signalList.dispatchList );

	// create a Wires handler for all the connections
	this.wires = new Wires();
	this.wires.create( this.canvas );

	var saved = localStorage.getItem("invaders");
	this.data = {};
	if ( saved )
	{
		try{
			this.data = JSON.parse( saved );
		}
		catch(err)
		{
			this.data = {};
		}
	}

	// create a list of bubbles (circles) to represent the Bubbles (game components)
	var x, y, b, name, bubble;

	for( i = 0, l = bl.length; i < l; i++ )
	{
		// SignalList.bubbleList objects have 'name', 'parent', and 'children' members
		bubble = bl[i];

		var isChild = false;
		var radiusx = 40;
		var radiusy = 38;

		if ( bubble.children && bubble.children.length > 0 )
		{
			console.log("parent = ", bubble.name);
			// this is a parent bubble, enclosing at least one child bubble
			radiusx = 60;
			radiusy = 56;
		}

		if ( bubble.parent )
		{
			console.log("child =", bubble.name);
			// this is a child bubble, enclosed by a parent bubble
			isChild = true;
			radiusx = 25;
			radiusy = 24;
		}

		name = bubble.name;
		if ( !this.data[name] )
		{
			this.data[name] = {};
			if ( isChild )
			{
				this.data[name].x = x = Math.floor( Math.random() * 2 * bubble.parent.radiusx - radiusx );
				this.data[name].y = y = Math.floor( Math.random() * 2 * bubble.parent.radiusy - radiusy );
			}
			else
			{
				this.data[name].x = x = Math.floor( Math.random() * (this.ctx.canvas.width - 2 * radiusx) + radiusx );
				this.data[name].y = y = Math.floor( Math.random() * (this.ctx.canvas.height - 2 * radiusy) + radiusy );
			}
		}
		else
		{
			if ( isChild )
			{
				x = Math.clamp( this.data[name].x, -radiusx, radiusx );
				y = Math.clamp( this.data[name].y, -radiusy, radiusy );
			}
			else
			{
				x = Math.clamp( this.data[name].x, radiusx, this.ctx.canvas.width - radiusx );
				y = Math.clamp( this.data[name].y, radiusy, this.ctx.canvas.height - radiusy );
			}
		}

		b = new BubbleDraw();
		b.create( x, y, radiusx, radiusy, bubble, [] );
		this.bubbles.push( b );

		// add the bubbles to the wires manager so it knows how to avoid them all
		this.wires.addBubble( b );

		// add a list of the functions to the BubbleDraw object for display
		// for( j = 0, k = ll.length; j < k; j++ )
		// {
		// }
	}

	localStorage.setItem("invaders", JSON.stringify( this.data ));

	// create links between all enclosed bubbles and their parents in the this.bubbles list
	for( i = 0, l = this.bubbles.length; i < l; i++ )
	{
		bubble = this.bubbles[i].bubble;
		var parent = bubble.parent;
		if ( parent )
		{
			// this bubble has a parent, find it and link it
			var parentBubble = this.findBubbleByName( parent.name );
			this.bubbles[i].parent = parentBubble;
		}
		var children = bubble.children;
		if ( children )
		{
			this.bubbles[i].children = [];
			// this bubble has children, find them and link them
			for( j = 0, k = children.length; j < k; j++ )
			{
				var child = children[j];
				var childBubble = this.findBubbleByName( child.name );
				this.bubbles[i].children.push( childBubble );
			}
		}
	}

	// add wires for all signal dispatch from their source bubble to all matching receiver nodes
	for( i = 0, l = dl.length; i < l; i++ )
	{
		var dispatch = dl[i];
		var fromBubble = this.findBubbleByName( dispatch.bubble );
		var toListeners = this.signalList.findListenersByKey( dispatch.key );
		for( j = 0, k = toListeners.length; j < k; j++ )
		{
			var toBubble = this.findBubbleByName( toListeners[j].bubble );
			var wire = this.wires.addWire( dispatch.key, fromBubble, 0, toBubble, Math.PI );

			// remember the wires leaving this bubble (if only to know where to place the next one...)
			if ( fromBubble.links.indexOfPropertyValue( "key", dispatch.key ) === -1 )
			{
				fromBubble.links.push( wire );
			}
		}
	}


	//
	// add mouse event listeners to the canvas
	//

	var _this = this;
	this.canvas.addEventListener( "mousedown",
		function( _evt )
		{
			_evt.preventDefault();
			_this.mouseDown = { x: _evt.offsetX, y: _evt.offsetY };
			_this.mouseUp = null;
		}, false );
	this.canvas.addEventListener( "mouseup",
		function( _evt )
		{
			_this.mouseUp = { x: _evt.offsetX, y: _evt.offsetY };
			_this.mouseDown = null;
		}, false );
	this.canvas.addEventListener( "mousemove",
		function( _evt )
		{
			_this.mouseMove = { x: _evt.offsetX, y: _evt.offsetY };
		}, false );
};


BubbleSystemDisplay.prototype.update = function(_arg1, _arg2)
{
	if ( showGame )
	{
		// return, bubble system doesn't need to draw if the game is being viewed
		this.canvas.style.visibility = 'hidden';
		return;
	}
	this.canvas.style.visibility = 'visible';

	// clicking to drag
	if ( this.mouseDown )
	{
		if ( !this.mouseDrag )
		{
			this.mouseDrag = this.findBubbleAt( this.mouseDown );
			if ( this.mouseDrag )
			{
				this.cursor = "pointer";
			}
		}
	}
	
	// releasing the drag
	if ( this.mouseUp )
	{
		if ( this.mouseDrag )
		{
			this.mouseDrag = null;
			this.cursor = "default";
			localStorage.setItem("invaders", JSON.stringify( this.data ));
		}
	}

	// dragging
	if ( this.mouseMove )
	{
		if ( this.mouseDrag && this.mouseDown )
		{
			var bubble = this.mouseDrag;
			var name = bubble.bubble.name;

			// calculate amount dragged and apply it to the bubble (preserve relative location of child bubbles)
			var loc = bubble.getLoc();
			var dx = this.mouseMove.x - loc.x;
			var dy = this.mouseMove.y - loc.y;
			this.data[name].x = this.mouseDrag.x += dx;
			this.data[name].y = this.mouseDrag.y += dy;
		}
	}

	// push the bubbles apart so they don't overlap each other
	this.pushApart();

	// draw everything
	this.draw();
};


BubbleSystemDisplay.prototype.draw = function( _arg1, _ctx )
{
	var i, l;

    // clear the canvas, animation is continuous
    this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
    this.ctx.fillStyle = "#010";
    this.ctx.fillRect( 0, 0, this.canvas.width, this.canvas.height );

	this.ctx.strokeStyle ="#ffffff";
	this.ctx.lineWidth = 2;
	this.ctx.textAlign = "center";

	for( i = 0, l = this.bubbles.length; i < l; i++ )
	{
		var bubble = this.bubbles[i];
		//if ( showChildren || !bubble.parent )
		{
			this.bubbles[i].draw( this.ctx );
		}
	}

	// draw all the wires
	// TODO: consider making wires a member of BubbleDraw (or a logical class backing it)
	if ( this.wires )
	{
		this.wires.draw( this.ctx, this.canvas );
	}

	if ( this.cursor !== document.body.style.cursor )
	{
		var _this = this;
		setTimeout( function() {
		    document.body.style.cursor = _this.cursor;
		    // document.body.scrollLeft = 1;
		    // document.body.scrollLeft = 0;
		}, 50);
	}
};


BubbleSystemDisplay.prototype.pushApart = function()
{
	var i, l, j;

	// move overlapping bubbles apart
	for( i = 0, l = this.bubbles.length; i < l - 1; i++ )
	{
		var b1 = this.bubbles[i];
		var loc1 = b1.getLoc();

		for( j = i + 1; j < l; j++ )
		{
			var b2 = this.bubbles[j];
			var loc2 = b2.getLoc();

			// parents are allowed to overlap their children
			if (b1.parent != b2 && b2.parent != b1)
			{
				var dx = loc1.x - loc2.x;
				var dy = loc1.y - loc2.y;
				var d = Math.sqrt(dx * dx + dy * dy);
				if ( d < b1.radiusx + b2.radiusy )
				{
					var vx = 2 * dx / d;
					var vy = 2 * dy / d;
					b1.x += Math.sgn0(vx);
					b1.y += Math.sgn0(vy);
					b2.x -= Math.sgn0(vx);
					b2.y -= Math.sgn0(vy);
					this.edges(b1);
					this.edges(b2);
				}
			}
		}
	}
};


BubbleSystemDisplay.prototype.findBubbleByName = function( _name )
{
    for( var i = 0, l = this.bubbles.length; i < l; i++ )
    {
    	var b = this.bubbles[i];
        if ( b.bubble.name == _name )
        {
            return b;
        }
    }
    return null;
};


BubbleSystemDisplay.prototype.findBubbleAt = function( _point )
{
	for( var i = 0, l = this.bubbles.length; i < l; i++ )
	{
		var b = this.bubbles[i];
		var loc = b.getLoc();
		var r2 = b.radiusx * b.radiusy;		// TODO: change to pointInEllipse check, this is a horrible approximation!
		var dx = loc.x - _point.x;
		var dy = loc.y - _point.y;
		var d2 = dx * dx + dy * dy;
		if ( d2 < r2 )
		{
			return b;
		}
	}
	return null;
};


BubbleSystemDisplay.prototype.edges = function( _bubble )
{
	// don't get pushed off edges
	var loc = _bubble.getLoc();
	if (loc.x < _bubble.radiusx)
		_bubble.x += _bubble.radiusx - loc.x;
	if (loc.x >= this.canvas.width - _bubble.radiusx)
		_bubble.x -= loc.x - (this.canvas.width - _bubble.radiusx - 1);
	if (loc.y < _bubble.radiusy)
		_bubble.y += _bubble.radiusy - loc.y;
	if (loc.y >= this.canvas.height - _bubble.radiusy)
		_bubble.y -= loc.y - (this.canvas.height - _bubble.radiusy - 1);
};


BubbleSystemDisplay.prototype.distance = function( _bubble1, _bubble2 )
{
	var loc1 = _bubble1.getLoc();
	var loc2 = _bubble2.getLoc();
	var dx = loc1.x - loc2.x;
	var dy = loc1.y - loc2.y;
	var d2 = dx * dx + dy * dy;
	return Math.sqrt(d2);
};

