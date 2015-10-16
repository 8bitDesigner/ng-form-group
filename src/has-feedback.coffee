toArray = (arrayish) -> Array.prototype.slice.call arrayish

angular.module("ng-form-group")

.directive "hasFeedback", ->
  restrict: "C"
  compile: (el, attrs) ->
    toArray(el[0].querySelectorAll(".form-control")).forEach (input) ->
      input.setAttribute("has-feedback-watcher", "")

.directive "hasFeedbackWatcher", ($templateCache) ->
  require: "ngModel",
  link: (scope, input, attrs, ctrl) ->

    validIcon = attrs.validIcon || "glyphicon-ok"
    invalidIcon = attrs.invalidIcon || "glyphicon-remove"
    feedbackTemplate = $templateCache.get(attrs.feedbackTemplate) || "<span class=\"glyphicon {{feedbackIcon}} form-control-feedback\"></span>";

    feedbackIcon = (isGood = false) ->
      icon = if isGood then validIcon else invalidIcon
      feedbackTemplate.replace /{{feedbackIcon}}/, icon

    unref = scope.$watch ->
      return unless ctrl.$dirty

      # Strip the existing state
      toArray(input[0].parentElement.querySelectorAll(".form-control-feedback")).forEach (span) ->
        span.parentElement.removeChild(span)

      # Add any relevant icons
      if ctrl.$valid        then input.after(feedbackIcon(true))
      else if ctrl.$invalid then input.after(feedbackIcon(false))

    scope.$on "$destroy", unref

