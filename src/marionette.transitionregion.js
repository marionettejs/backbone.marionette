// Region 
// ------
//
// Dependencies does not change from the normal region but the code is more asynchronous in nature
// usage
//    app.addRegions({
//            content: {
//                selector: "#app_main_content",
//                regionType: Backbone.Marionette.TransitionRegion
//            }
//   
//        });
//     new transitions can be added by overridingtop 7 functions in a new class

Backbone.Marionette.TransitionRegion = Backbone.Marionette.Region.extend({
    addBaseAnimate: function (view) {
        var styles = {
            "-moz-transition": "margin-left .25s, margin-right .25s",
            "-webkit-transition": "margin-left .25s, margin-right .25s",
            "-o-transition": "margin-left .25s, margin-right .25s",
            "-ms-transition": "margin-left .25s, margin-right .25s",
            "transition": "margin-left .25s, margin-right .25s"
        };
        view.$el.css(styles);
    },
    addTransitionInit: function (view, region) {
        var styles = {
            "margin-left": (region.$el.width() * -1) + "px",
            "margin-right": (region.$el.width() * 1) + "px"
        };
        view.$el.css(styles);
    },
    removeTransitionInit: function (view) {
        var styles = {
            "margin-left": "",
            "margin-right": ""
        };
        view.$el.css(styles);
    },
    addTransitionIn: function (view) {
        var styles = {
            "margin-left": "0px",
            "margin-right": "0px"
        };
        view.$el.css(styles);
    },
    removeTransitionIn: function (view) {
        var styles = {
            "margin-left": "",
            "margin-right": ""
        };
        view.$el.css(styles);
    },
    addTransitionOut: function (view) {
        var styles = {
            "margin-left": (view.$el.parent().width() * 1) + "px",
            "margin-right": (view.$el.parent().width() * -1) + "px"
        };
        view.$el.css(styles);
    },
    removeTransitionOut: function (view) {
        var styles = {
            "margin-left": "",
            "margin-right": ""
        };
        view.$el.css(styles);
    },
    show: function (view) {
        var self = this;
        this.ensureEl();
        var isViewClosed = view.isClosed || _.isUndefined(view.$el) || this.currentView == undefined;
        var isDifferentView = view !== this.currentView;
        if (isDifferentView) {
            this.promiseClose(view).done(function () {
                self.addBaseAnimate(view);
                self.addTransitionInit(view, self);
                view.render();
                if (isDifferentView || isViewClosed) {
                    self.open(view);
                }
                self.currentView = view;
                view.$el.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {
                    view.$el.off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
                    self.removeTransitionInit(view);
                });
                setTimeout(function () {
                    self.addTransitionIn(view);
                }, 1);
                Marionette.triggerMethod.call(self, "show", view);
                Marionette.triggerMethod.call(view, "show");
            });
        }
    },
    promiseClose: function (view) {
        var self = this;
        var deferred = $.Deferred();
        if (!self.currentView || self.currentView.isClosed) {
            deferred.resolve();
            return deferred.promise();
        }
        var cView = this.currentView;
        cView.$el.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {
            cView.$el.off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
            self.removeTransitionOut(cView);
            self.close();
            deferred.resolve();
        });
        self.removeTransitionIn(cView);
        self.addTransitionOut(cView);
        if (!self.isTransitionSupported()) {
            self.removeTransitionOut(cView);
            self.close();
            deferred.resolve();
        }
        return deferred.promise();
    },
    isTransitionSupported: function () {
        var style;
        style = document.documentElement.style;
        return ((style.webkitTransition) !== undefined || (style.MozTransition) !== undefined || (style.OTransition) !== undefined || (style.MsTransition) !== undefined || (style.transition) !== undefined);
    }
});