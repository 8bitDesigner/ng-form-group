toArray = (arrayish) -> Array.prototype.slice.call arrayish

angular.module("ng-form-group")

.directive "hasFeedback", ->
  restrict: "C"
  compile: (el, attrs) ->
    toArray(el[0].querySelectorAll(".form-control")).forEach (input) ->
      input.setAttribute("has-feedback-watcher", "")

.directive "hasFeedbackWatcher", ->
  require: "ngModel",
  link: (scope, input, attrs, ctrl) ->
    feedbackIcon = (isGood = false) ->
      icon = if isGood then "glyphicon-ok" else "glyphicon-remove"
      "<span class=\"glyphicon #{icon} form-control-feedback\"></span>"

    unref = scope.$watch ->
      # Strip the existing state
      toArray(input[0].parentElement.querySelectorAll(".form-control-feedback")).forEach (span) ->
        span.parentElement.removeChild(span)

      return unless ctrl.$dirty

      # Add any relevant icons
      if ctrl.$valid        then input.after(feedbackIcon(true))
      else if ctrl.$invalid then input.after(feedbackIcon(false))

    scope.$on "$destroy", unref

