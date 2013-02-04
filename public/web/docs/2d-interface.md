# Create a 2D Interface

-------------------
You can add two dimensional components to a user's *view* via html.  These components can interact with the *model* state (update it and be updated from it).

The first step is to create an html file that matches the name of your application's vwf.yaml file.  For example, if your application is titled *application*.vwf.yaml, create a file in the same directory named *application*.vwf.html.  When your application loads, the framework automatically looks for an html file by this name.

Inside that file, you can place any valid html, but you must obey two rules:

- Your html must have the style attribute "position:absolute" to show up in front of the 3D scene.  Sorry.  You can achieve this by wrapping everything in a div with that attribute or assign that attribute to everything in a css file.
- Name any css files something **other** than *index.css*.  VWF uses an *index.css* file already, and it will ignore yours by that same name.

*Note* - The loader strips out header and body tags and inserts your content directly into a nameless, classless div in the VWF index.html page (view your app's page source to see what we mean). Including header and body tags is helpful for testing as a standalone webpage, but not required for VWF. 

-------------------

**Monitor and Change the Simulation State**

The view (html) can access the model (yaml) through the vwf_view.kernel object. Thus, the html can watch what happens within the simulation and make changes to it such as setting properties, calling methods, and firing events. 

The [vwf.api.kernel](jsdoc/symbols/vwf.api.kernel.html) in the [system API](system.html) contains the list of kernel calls that can be made from the html.

The following sections show some examples.

-------------------

**Set Properties**

To set a property on an object, we first find a reference to that object and then set the property.  Like so:

	var nodeId = vwf_view.find( ... );
	vwf_view.kernel.setProperty( nodeId, "property1", value );

Explanations of the parameters can be found in the [find](query.html) and [setProperty](jsdoc/symbols/vwf.api.kernel.html#setProperty) documentation.  Note that the call to [find](query.html) returns immediately, but [setProperty](jsdoc/symbols/vwf.api.kernel.html#setProperty) and the other kernel calls in this recipe are asynchronous.  You can know when the property has been set by creating an event handler for the [satProperty](jsdoc/symbols/vwf.api.view.html#satProperty) event - more on that under [*Monitor the Model from HTML*](#monitor) - and yes ... we know that *sat* is not really the past tense of *set*.

-------------------

**Call Methods**

To call a model method from the view, we first find a reference to the object (in the same manner as above) and then call the method like so:

	vwf_view.kernel.callMethod( nodeId, "method1" );

Pass parameters to the method by passing an array of values as a third parameter: 

	vwf_view.kernel.callMethod( nodeId, "method1", [ parameter1, parameter2, etc ] );

Explanations of the parameters can be found in the [callMethod](jsdoc/symbols/vwf.api.kernel.html#callMethod)  API description.

-------------------

**Create Components**

Create a model component from the view like so:

	vwf_view.kernel.createChild( nodeId, "componentName", component, callback );

Explanations of the parameters can be found in the [createChild](jsdoc/symbols/vwf.api.kernel.html#createChild) API description.

-------------------

<a name="monitor">**Monitor the Model from HTML**</a>

The html can reflect changes to the simulation such as property updates, method calls, or events. The following example enables the html to catch property changes in the application. 

	vwf_view.satProperty = function (nodeId, propertyName, propertyValue) {
	  if ( nodeId == someSpecificNodeId ) {
	    switch ( propertyName ) {
	      case "mouseMode":
	        doSomething( propertyValue );
	        break;
        }
      }
	}

In this case, any time a property has been set, this function will check to see if the property was changed on a specific node, and if so, will check the name of the property. If it is the property we are looking for, we can write javascript to update the html state.

Similarly, the html can monitor other application updates, such as those listed below:

* Method called - vwf_view.calledMethod = function ...
* Event fired - vwf_view.firedEvent = function ...
* Node created - vwf_view.createdNode = function ...
* Node deleted - vwf_view.deletedNode = function ...

To learn more about these events, you can look at the system api for the [view](jsdoc/symbols/vwf.api.view.html).  Earlier we mentioned that calls to set a property and call a method are asynchronous.  If you would like to know when the action has completed, you may do so in [satProperty](jsdoc/symbols/vwf.api.view.html#satProperty)/[calledMethod](jsdoc/symbols/vwf.api.view.html#calledMethod)/etc.  However, remember that you will get calls into those event handlers for every property/method/etc that is set/called/etc.

-------------------
