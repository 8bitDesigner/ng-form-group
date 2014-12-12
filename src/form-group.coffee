class FormGroupController
  constructor: (@$scope) ->
    @unwatchers = []
    @status = null
    @inputs = []
    @$scope.$on "$destroy", => @unwatchers.each (fn) -> fn()

  update: =>
    return unless @inputs.every (i) -> i.$dirty
    @status = if (@inputs.every (i) -> i.$valid) then "success" else "error"
    @$scope.$digest()

  addInput: (ctrl) ->
    @inputs.push(ctrl)
    @unwatchers.push ctrl.$viewChangeListeners.push @update


angular.module("ng-form-group")

.controller 'FormGroupController', ['$scope', FormGroupController]

.directive "formGroup", ->
  restrict: "C"
  require: "formGroup"
  controller: 'FormGroupController'
  link: (scope, el, attrs, ctrl) ->
    dereg = scope.$watch (-> ctrl.status), (status) ->
      el.removeClass("has-error has-success")
      el.addClass("has-#{status}") if status

    scope.$on '$destroy', dereg

.directive "formControl", ->
  restrict: "C"
  require: ["?ngModel", "?^formGroup"]
  link: (scope, input, attrs, ctrls) ->
    [ngModelCtrl, formGroupCtrl] = ctrls
    formGroupCtrl.addInput(ngModelCtrl) if ngModelCtrl and formGroupCtrl

