
/*
Listens to `.form-control`s inside a `.form-group` and updates the
`.form-group`'s class with `.has-error` or `.has-success` if the matching
controls are valid or invalid.
 */

(function() {
  angular.module('ng-form-group', []).directive("formGroup", function() {
    return {
      restrict: 'C',
      link: function(scope, el, attrs) {
        var inputs, isConfigured, isDirty, isFocused, isValid, updateClasses;
        isConfigured = false;
        inputs = function() {
          return el.find(".form-control").toArray();
        };
        isValid = function(input) {
          return input.classList.contains('ng-valid');
        };
        isDirty = function(input) {
          return input.classList.contains('ng-dirty');
        };
        isFocused = function(input) {
          return angular.element(input).is(':focus');
        };
        updateClasses = function(myInputs) {
          if (myInputs.length === 0) {
            return;
          }
          el.removeClass('has-error has-success');
          if (!myInputs.every(isDirty)) {
            return;
          }
          if (myInputs.every(isValid)) {
            return el.addClass("has-success");
          } else {
            return el.addClass("has-error");
          }
        };
        el.on('blur', '.form-control', function() {
          return updateClasses(inputs());
        });
        return scope.$watch(function() {
          return inputs().map(function(el) {
            return el.className;
          }).join(" ");
        }, function(newval, oldval) {
          var myInputs;
          myInputs = inputs();
          if (myInputs.some(isFocused)) {

          } else {
            return updateClasses(myInputs);
          }
        });
      }
    };
  });

}).call(this);
