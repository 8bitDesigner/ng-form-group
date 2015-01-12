class FormGroupController
  constructor: (@$scope) ->
    @status = null
    @disabled = false
    @inputs = []

    unref = @$scope.$watch(@update)
    @$scope.$on "$destroy", unref

  update: =>
    return unless @inputs.every (i) -> i.$dirty
    @status = if (@inputs.every (i) -> i.$valid) then "success" else "error"
    @$scope.$digest() unless @$scope.$$phase

  addInput: (ctrl) ->
    @inputs.push(ctrl)


angular.module("ng-form-group")

.controller 'FormGroupController', ['$scope', FormGroupController]

.directive "formGroup", ->
  restrict: "C"
  require: "formGroup"
  controller: 'FormGroupController'
  link: (scope, el, attrs, ctrl) ->
    if el.hasClass('form-group-without-feedback')
      ctrl.disabled = true
      return

    dereg = scope.$watch (-> ctrl.status), (status) ->
      el.removeClass("has-error has-success")
      el.addClass("has-#{status}") if status

    scope.$on '$destroy', dereg

.directive "formControl", ->
  restrict: "C"
  require: ["?ngModel", "?^formGroup"]
  link: (scope, input, attrs, ctrls) ->
    [ngModelCtrl, formGroupCtrl] = ctrls
    return if formGroupCtrl.disabled
    formGroupCtrl.addInput(ngModelCtrl) if ngModelCtrl and formGroupCtrl

