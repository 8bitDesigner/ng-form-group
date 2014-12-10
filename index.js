
/*
Listens to `.form-control`s inside a `.form-group` and updates the
`.form-group`'s class with `.has-error` or `.has-success` if the matching
controls are valid or invalid.
 */

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('ng-form-group', []).directive("formGroup", function() {
    var FormGroupController;
    return {
      restrict: 'C',
      require: 'formGroup',
      controller: FormGroupController = (function() {
        function FormGroupController($scope) {
          this.$scope = $scope;
          this.update = __bind(this.update, this);
          this.unwatchers = [];
          this.status = null;
          this.inputs = [];
          this.$scope.$on('$destroy', (function(_this) {
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
          }) ? 'success' : 'error';
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
          el.removeClass('has-error has-success');
          if (status) {
            return el.addClass("has-" + status);
          }
        });
        return scope.$on('$destroy', dereg);
      }
    };
  }).directive('formControl', function() {
    return {
      restrict: 'C',
      require: ['?ngModel', '?^formGroup'],
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
