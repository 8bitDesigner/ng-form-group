(function() {
  angular.module("ng-form-group", []);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module("ng-form-group").directive("formGroup", function() {
    var FormGroupController;
    return {
      restrict: "C",
      require: "formGroup",
      controller: FormGroupController = (function() {
        function FormGroupController($scope) {
          this.$scope = $scope;
          this.update = __bind(this.update, this);
          this.unwatchers = [];
          this.status = null;
          this.inputs = [];
          this.$scope.$on("$destroy", (function(_this) {
            return function() {
              return _this.unwatchers.each(function(fn) {
                return fn();
              });
            };
          })(this));
        }

        FormGroupController.prototype.update = function() {
          if (!this.inputs.every(function(i) {
            return i.$dirty;
          })) {
            return;
          }
          return this.status = this.inputs.every(function(i) {
            return i.$valid;
          }) ? "success" : "error";
        };

        FormGroupController.prototype.addInput = function(ctrl) {
          this.inputs.push(ctrl);
          return this.unwatchers.push(ctrl.$viewChangeListeners.push(this.update));
        };

        return FormGroupController;

      })(),
      link: function(scope, el, attrs, ctrl) {
        var dereg;
        dereg = scope.$watch((function() {
          return ctrl.status;
        }), function(status) {
          el.removeClass("has-error has-success");
          if (status) {
            return el.addClass("has-" + status);
          }
        });
        return scope.$on('$destroy', dereg);
      }
    };
  }).directive("formControl", function() {
    return {
      restrict: "C",
      require: ["?ngModel", "?^formGroup"],
      link: function(scope, input, attrs, ctrls) {
        var formGroupCtrl, ngModelCtrl;
        ngModelCtrl = ctrls[0], formGroupCtrl = ctrls[1];
        if (ngModelCtrl && formGroupCtrl) {
          return formGroupCtrl.addInput(ngModelCtrl);
        }
      }
    };
  });

}).call(this);

(function() {
  var toArray;

  toArray = function(arrayish) {
    return Array.prototype.slice.call(arrayish);
  };

  angular.module("ng-form-group").directive("hasFeedback", function() {
    return {
      restrict: "C",
      compile: function(el, attrs) {
        return toArray(el[0].querySelectorAll(".form-control")).forEach(function(input) {
          return input.setAttribute("has-feedback-watcher", "");
        });
      }
    };
  }).directive("hasFeedbackWatcher", function() {
    return {
      require: "ngModel",
      link: function(scope, input, attrs, ctrl) {
        var dereg, feedbackIcon;
        feedbackIcon = function(isGood) {
          var icon;
          if (isGood == null) {
            isGood = false;
          }
          icon = isGood ? "glyphicon-ok" : "glyphicon-remove";
          return "<span class=\"glyphicon " + icon + " form-control-feedback\"></span>";
        };
        dereg = ctrl.$viewChangeListeners.push(function() {
          if (!ctrl.$dirty) {
            return;
          }
          toArray(input[0].parentElement.querySelectorAll(".form-control-feedback")).forEach(function(span) {
            return span.parentElement.removeChild(span);
          });
          if (ctrl.$valid) {
            return input.after(feedbackIcon(true));
          } else if (ctrl.$invalid) {
            return input.after(feedbackIcon(false));
          }
        });
        return scope.$on("$destroy", dereg);
      }
    };
  });

}).call(this);
