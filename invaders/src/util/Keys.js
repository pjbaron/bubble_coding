//
// Pete Baron 2016
//
// listen to key press/release events and keep track of what has been pressed
//




function Keys()
{
	// static variables for global accessibility
	Keys.isPressed = null;
	Keys.edgeDown = null;
	Keys.edgeUp = null;

	this.preventDefault = false;

	this.reset();
	window.addEventListener( "keydown", this.keyDown, true );
	window.addEventListener( "keyup", this.keyUp, true );
}


BubbleExtend( Keys );


Keys.prototype.reset = function()
{
	Keys.isPressed = [];
	Keys.edgeDown = [];
	Keys.edgeUp = [];
	this.preventDefault = true;
};


Keys.prototype.keyDown = function( evt )
{
	if (this.preventDefault)
	{
		evt.preventDefault();
	}

	if (!Keys.isPressed[ evt.keyCode ])
	{
		Keys.edgeDown[ evt.keyCode ] = true;
		Signals.dispatch( "key_down", evt.keyCode );
		// console.log("keyDown ", evt.keyCode);
	}
	Keys.isPressed[ evt.keyCode ] = true;

	// TODO: testing... permit keycodes to pass through to system if CTRL is pressed (toggle)
	if (evt.keyCode === KeyCodes.ctrl)
	{
		this.preventDefault = !this.preventDefault;
		console.log("Keys.preventDefault is", this.preventDefault);
	}
};


Keys.prototype.keyUp = function( evt )
{
	if (this.preventDefault)
	{
		evt.preventDefault();
	}

	if (Keys.isPressed[ evt.keyCode ])
	{
		Keys.edgeUp[ evt.keyCode ] = true;
		Signals.dispatch( "key_up", evt.keyCode );
	}
	Keys.isPressed[ evt.keyCode ] = false;
};


KeyCodes =
{
	backspace : 8,
	tab : 9,
	enter : 13,
	shift : 16,
	ctrl : 17,
	alt : 18,
	pause : 19,
	caps_lock : 20,
	escape : 27,
	space_bar : 32,
	page_up : 33,
	page_down : 34,
	end : 35,
	home : 36,
	left_arrow : 37,
	up_arrow : 38,
	right_arrow : 39,
	down_arrow : 40,
	insert_key : 45,
	delete_key : 46,
	key_0 : 48,
	key_1 : 49,
	key_2 : 50,
	key_3 : 51,
	key_4 : 52,
	key_5 : 53,
	key_6 : 54,
	key_7 : 55,
	key_8 : 56,
	key_9 : 57,
 	key_a : 65,
 	key_b : 66,
 	key_c : 67,
 	key_d : 68,
 	key_e : 69,
 	key_f : 70,
 	key_g : 71,
 	key_h : 72,
 	key_i : 73,
 	key_j : 74,
 	key_k : 75,
 	key_l : 76,
 	key_m : 77,
 	key_n : 78,
 	key_o : 79,
 	key_p : 80,
 	key_q : 81,
 	key_r : 82,
 	key_s : 83,
 	key_t : 84,
 	key_u : 85,
 	key_v : 86,
 	key_w : 87,
 	key_x : 88,
 	key_y : 89,
 	key_z : 90,
	left_window_key : 91,
	right_window_key : 92,
	select_key : 93,
	numpad_0 : 96,
	numpad_1 : 97,
	numpad_2 : 98,
	numpad_3 : 99,
	numpad_4 : 100,
	numpad_5 : 101,
	numpad_6 : 102,
	numpad_7 : 103,
	numpad_8 : 104,
	numpad_9 : 105,
	multiply : 106,
	add : 107,
	subtract : 109,
	decimal_point : 110,
	divide : 111,
	f1 : 112,
	f2 : 113,
	f3 : 114,
	f4 : 115,
	f5 : 116,
	f6 : 117,
	f7 : 118,
	f8 : 119,
	f9 : 120,
	f10 : 121,
	f11 : 122,
	f12 : 123,
	num_lock : 144,
	scroll_lock : 145,
	semi_colon : 186,
	equal_sign : 187,
	comma : 188,
	dash : 189,
	period : 190,
	forward_slash : 191,
	grave_accent : 192,
	open_bracket : 219,
	back_slash : 220,
	close_braket : 221,
	single_quote : 222
};
