Marionette.TriggerEvent = function(source){
  source.trigger = _.bind(this.triggerMethod, source, source);
}

_.extend(Marionette.TriggerEvent.prototype, {

  triggerMethod: function(){
    var args = Array.prototype.slice.apply(arguments);
    var source = args.shift();

    var eventName = args[0];
    var segments = eventName.split(":");
    var segment, capLetter, methodName = "on";

    for (var i = 0; i < segments.length; i++){
      segment = segments[i];
      capLetter = segment.charAt(0).toUpperCase();
      methodName += capLetter + segment.slice(1);
    }

    Backbone.Events.trigger.apply(source, args);

    args.pop();
    source[methodName].apply(source, args);
  }

});
