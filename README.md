# bubble_coding
Signal driven GUI program representation.

Pete Baron (c)2017-2019
MIT License with attribution.



Purpose:

I have long visualised many programming tasks as a set of nested components with communication paths between them.  This is an attempt to turn that visualisation into a development tool.
When making games in particular there are certain types of task that come up very regularly which can be fiddly to handle.  e.g. the game control cycle, or complex menu systems.  Putting these into bubbles, then wiring them together with signals enables a simple visual representation with the possibility of reordering simply by dragging the wires around.

Important note: it is not my intention to replace textual code representation with a graphical replacement, every such attempt I have used has been unwieldy, slow to develop in and has offered only a poor representation of the logic.  I believe that at a function level there is (currently) no more efficient representation of program logic than a good textual coding language.  This project is an attempt to aid visualisation of high level code structure, to offer tools to simplify the creation and modification of that structure, and eventually to assist in debugging the programs by enabling visualisation of data transmission between the code components.



Useage:

You'll need to deploy it remotely, or set up a local server to run it locally.  Wamp Server is what I currently use for development.
Fire up the index.html in /invaders, you will see the bubble graph for the Invaders game.
At first glance the mess of bubbles and wires seems overwhelming.  Click and drag any bubble to move it around, order the work-space in a logical manner for your own ease of interpretation.  Notice that some bubbles are linked (e.g. bombs+bomb) which indicates a hierarchical relationship between them (BubbleEnclose( bombs, bomb )).

Press key 's' to switch between the bubble view and the game in operation.

Some bubbles represent utility features:
- Ticker is a system timer, you will see a wire labelled "start_timer" going into the top of this bubble, and a wire labelled "game_tick" leaving the bottom.
- Keys is the keyboard input system, this has no input wires, output wires are key_up and key_down for this project.
- Canvas is the display system, it has only one input labelled "create_canvas" from "space_invaders".  It registers itself automatically as 'canvas' and 'ctx' on the signal owner.

All other bubbles represent game objects except for "space_invaders" which is a standard format template for projects with timer driven update and draw bubbles.

I generally prefer to have system bubbles at the top, then the program controller "space_invaders", then arrange the program components in arcs below their parent or a source of a controlling signal.  This visually represents a program hierarchy whilst taking advantage of the 2D layout options available to this system.

Note: the bubble layout should save automatically into localStorage every time you make a change, although there may be a bug or a fitting issue with screen resizing - sometimes my layout is lost.



TODO:
- link to a web editor which opens the corresponding file when a bubble is selected, either as a split pane or with a zoom-in effect to show the code 'inside' the bubble
- modify web editor to recognise the bubble coding tags (BubbleExtend( name ), BubbleEnclose( name, name )) and hide them or display them in links as appropriate
- improve the example code structure, as a consequence of developing the example in parallel to the bubble system there are many dubious design decisions in Invaders
- add a debugging system where it is possible to see the signals being activated and their values, step into the functions, inspect variables, etc
- experiment with a 'jog' dial (like AV editors use) to rewind/play/fast forwards the debugger.  I believe that recording Signals and Bubble states before each one arrives might be enough to permit the rewind feature which would be particularly useful when debugging
- add controls to hide wires by pattern matching and useful toggles, (e.g. all "update"/"draw" wires on/off/thin-links, all util or system wires, etc)
- enable bends in wire for manual layout
- create automatic layout system for wires and bubbles that minimises cross-over and tries to represent the classes in a top-down hierarchy layout
- improve representation of linked bubbles (e.g. bombs+bomb, houses+house, invaders+invader) to show non-signal hierarchical relationships.  The original idea was to spawn an additional bubble inside the parent each time a new game item is created, this is clearly impractical when there could be thousands of child objects (I note that this didn't stop Unity from listing them all though).  Perhaps a representative bubble with a count indicator, and some way to reference/search the child list to find the particular one you are interested in, along with play-space debugging features where selecting the visual representation will allow the controlling bubble to be viewed and altered.
- frequently used features as 'stock' bubbles (templates) to reduce time spent on repetitive coding.  e.g. bombs, houses, invaders are all very simple list managers with some specific features to customise them for purpose.  In this case I imagine a 'list manager' bubble which can enclose the additional features And the child bubbles created.
- test the system with a more complex example including multi-level menus (check that they can be reordered by wire manipulations as envisaged originally).  Also more complex relationships between objects than simple parent/child - check that the signals can be used for all such, and that the representation doesn't become hopelessly involved.
- find a better way to handle bubbles like 'space invader' or 'collider' which connect to virtually every game object bubble, these highly connected objects make the layout very ugly to look at and hard to interpret at a glance.  Perhaps some sort of 'bus' which allows multiple wires to join at a nexus, or maybe just having good wire hiding features will be enough.



Contents:
```bash
.
├── invaders - top level folder for a bubble coding example project, the Invaders game
│    ├── image - art in .PNG format
│    ├── sfx - audio in .WAV format
│    ├── src - JavaScript for the environment and the demo
│    ├── game - the game files coded and marked-up for bubble coding
│    ├── lib - libraries used by the game and/or system
│    └── sys - the bubble coding system files including GUI display and the bubble implementation
└─────── util - useful static classes for building games or bubbles
```
