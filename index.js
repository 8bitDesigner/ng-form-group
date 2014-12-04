
/*
Listens to `.form-control`s inside a `.form-group` and updates the
`.form-group`'s class with `.has-error` or `.has-success` if the matching
controls are valid or invalid.
 */

(function() {
  angular.module('ng-form-group', []).directive("formGroup", function() {
    return {
      restrict: 'C',
      link: function(scope, el) {
        var inputs, isConfigured, isDirty, isValid;
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
        if (el.hasClass('has-success') || el.hasClass('has-error')) {
          isConfigured = true;
        }
        return scope.$watch(function() {
          return inputs().map(function(el) {
            return el.className;
          }).join(" ");
        }, function(newval, oldval) {
          var myInputs;
          myInputs = inputs();
          if (myInputs.length === 0) {
            return;
          }
          if ((newval === oldval) && isConfigured) {
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
        });
      }
    };
  });

}).call(this);
