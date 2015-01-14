(function() {
  angular.module("ng-form-group", []);

}).call(this);

(function() {
  var FormGroupController,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  FormGroupController = (function() {
    function FormGroupController($scope) {
      var unref;
      this.$scope = $scope;
      this.update = __bind(this.update, this);
      this.status = null;
      this.disabled = false;
      this.inputs = [];
      unref = this.$scope.$watch(this.update);
      this.$scope.$on("$destroy", unref);
    }

    FormGroupController.prototype.update = function() {
      this.status = null;
      if (!this.inputs.every(function(i) {
        return i.$dirty;
      })) {
        return;
      }
      this.status = this.inputs.every(function(i) {
        return i.$valid;
      }) ? "success" : "error";
      if (!this.$scope.$$phase) {
        return this.$scope.$digest();
      }
    };

    FormGroupController.prototype.addInput = function(ctrl) {
      return this.inputs.push(ctrl);
    };

    return FormGroupController;

  })();

  angular.module("ng-form-group").controller('FormGroupController', ['$scope', FormGroupController]).directive("formGroup", function() {
    return {
      restrict: "C",
      require: "formGroup",
      controller: 'FormGroupController',
      link: function(scope, el, attrs, ctrl) {
        var dereg;
        if (el.hasClass('form-group-without-feedback')) {
          ctrl.disabled = true;
          return;
        }
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
        if (formGroupCtrl.disabled) {
          return;
        }
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
        var feedbackIcon, unref;
        feedbackIcon = function(isGood) {
          var icon;
          if (isGood == null) {
            isGood = false;
          }
          icon = isGood ? "glyphicon-ok" : "glyphicon-remove";
          return "<span class=\"glyphicon " + icon + " form-control-feedback\"></span>";
        };
        unref = scope.$watch(function() {
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
        return scope.$on("$destroy", unref);
      }
    };
  });

}).call(this);
