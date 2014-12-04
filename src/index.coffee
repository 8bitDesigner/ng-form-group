###
Listens to `.form-control`s inside a `.form-group` and updates the
`.form-group`'s class with `.has-error` or `.has-success` if the matching
controls are valid or invalid.
###
angular.module('ng-form-group', []).directive "formGroup", ->
  restrict: 'C'
  link: (scope, el) ->
    isConfigured = false
    inputs  = -> el.find(".form-control").toArray()
    isValid = (input) -> input.classList.contains('ng-valid')
    isDirty = (input) -> input.classList.contains('ng-dirty')

    # If we're in a pre-configured state (someone else must know what
    # they're doing!), skip the first $watch pass
    if el.hasClass('has-success') or el.hasClass('has-error')
      isConfigured = true

    # Watch the string representation of every input's classname
    scope.$watch ->
      inputs().map((el) -> el.className).join(" ")
    , (newval, oldval) ->
      myInputs = inputs()

      # Bail if we have no inputs, or this is our first pass and we're preconfigured
      return if myInputs.length is 0
      return if (newval is oldval) and isConfigured

      # Strip the existing state
      el.removeClass('has-error has-success')

      # If some inputs in this group are untouched, leave now
      return unless myInputs.every(isDirty)

      # Lastly, if every control is dirty, update our element with the right state
      if myInputs.every(isValid) then el.addClass("has-success")
      else                            el.addClass("has-error")
