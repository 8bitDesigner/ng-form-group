###
Listens to `.form-control`s inside a `.form-group` and updates the
`.form-group`'s class with `.has-error` or `.has-success` if the matching
controls are valid or invalid.
###
angular.module('ng-form-group', []).directive "formGroup", ->
  restrict: 'C'
  link: (scope, el, attrs) ->
    isConfigured = false
    inputs  = -> el.find(".form-control").toArray()
    isValid = (input) -> input.classList.contains('ng-valid')
    isDirty = (input) -> input.classList.contains('ng-dirty')
    isFocused = (input) -> angular.element(input).is(':focus')

    updateClasses = (myInputs) ->
      # Bail if we have no inputs
      return if myInputs.length is 0

      # Strip the existing state
      el.removeClass('has-error has-success')

      # If some inputs in this group are untouched, leave now
      return unless myInputs.every(isDirty)

      # Lastly, if every control is dirty, update our element with the right state
      if myInputs.every(isValid) then el.addClass("has-success")
      else                            el.addClass("has-error")

    # Update on blur
    el.on 'blur', '.form-control', ->
      updateClasses(inputs())

    # And update when the controller changes and our inputs aren't focused
    scope.$watch ->
      inputs().map((el) -> el.className).join(" ")
    , (newval, oldval) ->
      myInputs = inputs()
      if myInputs.some(isFocused)
        return
      else
        updateClasses(myInputs)

