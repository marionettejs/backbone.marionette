# Marionette.Behavior

A `Behavior` is an encapsulated `View` interaction layer that can be mixed into any `view`. `Behaviors` allow you to blackbox `View` specific interactions into portable logical chunks, keeping your `views` simple and your code DRY. 


## The Motivation

As you build more and more complex views you will find that your `view` becomes less about displaying model data, and more about interactions. 

These interactions tend to be chunks of logic that you want to use in multiple views.  
> Behaviors provide you with a pluggable proxy layer for your views. 
 

## Using

#### Let's start with a basic view and abstract behaviors
  
```js
var MyView = Marionette.ItemView.extend({
	ui: {
		"close": ".close-btn"
	},
	
	events: {
	  "click @ui.close": "warnBeforeClose"  
	},
	
	warnBeforeClose: function() {
	  alert("you are closing all your data is now gone!");
	  this.close();
	},
	
	onShow: function() {
	   this.$('.tooltip').tooltip({
	     text: "what a nice mouse you have"
	   });
	}
});
```

Interaction points such as tooltips and warning messages are generic concepts. There is no need to recode them within your views. They are prime for abstraction into a higher level non-coupled concept. That my friend is exactly what `Behaviors` are for.

```js
var MyView = Marionette.ItemView.extend({
	behaviors: {
		CloseWarn: {
			message: "you are closing all your data is now gone!"
		},
		ToolTip: {
			text: "what a nice mouse you have"
		}
	}
});
```

Now Let's create the `CloseWarn` behavior.

```js
var CloseWarn = Marionette.Behavior.extend({
	// you can set default options
	// just like you can in your Backbone Models
	defaults: {
		"message": "you are closing!"
	},
	
	events: {
		"click @ui.close": "warnBeforeClose"
	},
	
	warnBeforeClose: function() {
	  alert(this.options.message);
		// every Behavior has a hook into the 
		// view that it is attached to
	  this.view.close();	
	}	
});
```

And onto the `Tooltip` behavior.

```js
var ToolTip = Marionette.Behavior.extend({
	onShow: function() {
		// this.$ is another example of something
		// that is exposed to each behavior instance
  		this.$('.tooltip').tooltip({
	     	text: this.options.text
  		});		
	}		
});
```
