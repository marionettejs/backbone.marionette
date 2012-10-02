Marionette.TriggerEvent = function(source){
  this._source = source;
}

_.extend(Marionette.TriggerEvent.prototype, {

  trigger: function(){
    var eventName = arguments[0];
    var segments = eventName.split(":");
    var segment, capLetter, methodName = "on";

    for (var i = 0; i < segments.length; i++){
      segment = segments[i];
      capLetter = segment.charAt(0).toUpperCase();
      methodName += capLetter + segment.slice(1);
    }

    var args = Array.prototype.slice.apply(arguments);
    args.pop();

    this._source.trigger.apply(this._source, arguments);
    this._source[methodName].apply(this._source, args);
  }

});
