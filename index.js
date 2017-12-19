(function() {
  angular.module("ng-form-group", []);

}).call(this);

(function() {
  var FormGroupController,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  FormGroupController = (function() {
    function FormGroupController($scope) {
      this.$scope = $scope;
      this.update = bind(this.update, this);
      this.status = null;
      this.disabled = false;
      this.inputs = [];
      this.$scope.$watch(this.update);
    }

    FormGroupController.prototype.setParentForm = function(ctrl) {
      return this.ngFormCtrl = ctrl;
    };

    FormGroupController.prototype.canValidate = function() {
      var inputsReady;
      inputsReady = this.inputs.every(function(i) {
        return i.$dirty && !i.$pending;
      });
      if (this.ngFormCtrl) {
        return this.ngFormCtrl.$submitted || inputsReady;
      } else {
        return inputsReady;
      }
    };

    FormGroupController.prototype.update = function() {
      if (this.disabled === false && this.canValidate()) {
        return this.status = (this.inputs.every(function(i) {
          return i.$valid;
        })) ? "success" : "error";
      } else {
        return this.status = null;
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
      require: ["formGroup", "?^form"],
      controller: 'FormGroupController',
      link: function(scope, el, attrs, ctrls) {
        var ctrl, ngFormCtrl;
        ctrl = ctrls[0], ngFormCtrl = ctrls[1];
        if (ctrl.inputs.length === 0) {
          ctrl.disabled = true;
          return;
        }
        if (ngFormCtrl) {
          ctrl.setParentForm(ngFormCtrl);
        }
        scope.$watch((function() {
          return el.hasClass('form-group-without-feedback');
        }), function(value) {
          return ctrl.disabled = value;
        });
        return scope.$watch((function() {
          return ctrl.status;
        }), function(status) {
          el.removeClass("has-error has-success");
          if (status) {
            return el.addClass("has-" + status);
          }
        });
      }
    };
  }).directive("formControl", function() {
    return {
      restrict: "C",
      require: ["?ngModel", "?^formGroup"],
      link: function(scope, input, attrs, ctrls) {
        var formGroupCtrl, ngModelCtrl;
        ngModelCtrl = ctrls[0], formGroupCtrl = ctrls[1];
        if (!formGroupCtrl || formGroupCtrl.disabled) {
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
          toArray(input[0].parentElement.querySelectorAll(".form-control-feedback")).forEach(function(span) {
            return span.parentElement.removeChild(span);
          });
          if (!ctrl.$dirty) {
            return;
          }
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
