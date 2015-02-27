Building large web applications using [Backbone.js][backbone] can be hard.  Backbone is a great tool, but it's designed to be minimalist and useful in a wide variety of situations.  As a result, you get less guidance and support from the tool as you scale up than you do from more opinionated frameworks like [Angular][angular] and [Ember][ember].  When a Backbone application grows, maintaining it requires adding structure, either through a custom set of conventions and components, or based on somebody elses framework.  There are a lot of different Backbone frameworks out there, but we think you'll enjoy using [Marionette.js][marionette].  

###  Decisions, Decisions

Developing with Backbone is an exercise in decision making.  Backbone provides you with a minimalist set of Models and Collections that essentially serve as light wrappers around JavaScript objects synced over Ajax. It provides you lightweight Views that associate an object with a DOM node and some data.  It provides a router that associates URLs with function, and it provides helpers for managing events between all of these options.  That leaves Backbone developers with many questions to answer.

- **How do you render Views?** - By default, Backbone's render method does nothing. To use it, you need to fill in your own rendering function.  That could use a templating system like Underscore templates or Handlebars, jQuery manipulation of the DOM, or simple string inserts with `.innerHTML()`.  You could use the same method for every View, or mix it up and use different methods for different Views. 
- **How do you manage relationships between objects?** - By default Backbone provides a way to manage sets of Models as a Collection, but it doesn't have any built-in utilities for handling nested Models or Collections.  And if you want to nest your Views you're completely on your own.  You can have a View manage it's child Views, have a single object that manages all Views, or let each View manage itself.
- **How do your Views communicate between each other?** - Views will often need to communicate with each other.  If for instance one View needs to change the contents of another area of the page, it could do so directly through jQuery, could get a direct reference to a View managing that area and call a function on it, change a Model that another View listens to, adjust a URL that a router listens to, or fire an event that another View could respond to. Apps can use some combination of all of these methods.
- **How do you avoid repeating yourself?** - If you're not careful, Backbone can involve a lot of boilerplate.  Taking the naive approach, you could end up writing rendering code, View management code and event management code over and over again in every View.  If you try to get around that using inheritance, you can end up with brittle designs that require you to make calls down to a Views prototype when you want View specific code.  Avoiding that type of repetition and the maintenance overhead it brings is a challenge.
- **How do you manage a View's life-cycle??** - What code is responsible for rendering a View?  Does it render itself on creation?  Or is it the responsibility of the object creating it?  Does it get attached to the DOM immediately on render? Or is that a separate step?  When the View is removed from the DOM or deleted, how do you handle any cleanup that is needed?
- **How do you structure your application?** - How do you get your app started?  Do you have a central object that starts everything, or is it more distributed?  If you do centralize, do you use the router to start things, or provide some other object for managing your code?
- **How do you prevent memory leaks?** - If your application is a [Single Page Application][spa] or it contains long lasting interactive sections, another issue that you may need to deal with is memory leaks.  It can be easy to create "zombie Views" in Backbone if you're not attentive to the need to unregister events attached to a View after you're done with it.

That's just a small sample of the type of decision making that you have to make for a Backbone project.  Those questions signify flexibility, but they also represent mental overhead.  If you're like me, you see these common problems and think that you can get better results relying on a shared solution that leverages the experience of the community.  

### What does Marionette Give You?

Marionette is an attempt to provide this type of shared solution, capturing Backbone best practices as a set of components and design patterns.  So what value does it provide?  Marionette gives you:

- **A Standardized Rendering process** - Marionette takes an opinionated stand on how Views should be rendered.  Without any additional configuration, it will take a template that you specify with a View's template property, compile it with Underscore's templating function and pass it a model or collection.  If you need to pass it other data, or want to use a different template library, Marionette provides hooks to customize that process in a [DRY][dry] way.
- **A consistent View lifecycle** - Marionette defines a consistent View life cycle where Views are initialized, rendered, shown, refreshed, and destroyed.  Each of these events has events and callbacks associated it, and any common boilerplate associated with them is handled behind the scenes. 
- **The ability to define and manage complex layouts** - Marionette provides region objects that define portions of the DOM that can display and swap out Views.  Combined with utilities to manage child views, you can easily create deeply nested View structures with Marionette while minimizing complexity.
- **A central event bus with semantic events to simplify communication between Views** - Marionette includes Backbone.Wreqr or Backbone Radio as an event bus to allow communication between Views without explicitly coupling them.  
- **Helpers to help you write DRY Code** - In addition to centralizing the rendering and view management code, Marionette provides hooks to allow you to abstract away details of the DOM and events in your View code, and a mechanism to pull common ui operations out into separate reusable objects
- **Helpers to avoid "Zombie Views" and memory leaks** - Marionette's lifecycle includes an explicit destroy phase that cleans up many common sources of memory leaks, and provides a hook for you to take care of the rest
- **A central Application object to initialize your application** - Using Marionette, you're able to specify a set of initializers that run any code that needs to be executed before your application starts, providing a clear structure and starting point to your app.

That's not the complete feature set, but it is the essential sales pitch. The important thing to understand is that Marionette provides a framework for building Backbone apps that builds on established practices from the Backbone community.  If you're building a Backbone application and want to focus on the problems that are specific to your application, Marionette is a great way to move past common issues and focus on what's unique to you.

*This explanation is adapted from a blog post by a Marionette community member.  You can find the original post [here][caseformn] *


[marionette]:http://marionettejs.com/
[backbone]: http://backbonejs.org/
[ember]: http://emberjs.com/
[angular]:https://angularjs.org/
[spa]:http://en.wikipedia.org/wiki/Single-page_application
[dry]:http://en.wikipedia.org/wiki/Don%27t_repeat_yourself
[caseformn]: http://benmccormick.org/2014/12/02/the-case-for-marionette-js/
