describe 'The classy form-group directive', ->
  beforeEach ->
    module('ng-form-group')

  setValid = (inputCtrl, valid = false) ->
    inputCtrl.$setDirty()
    inputCtrl.$setValidity('required', valid)
    inputCtrl.$setViewValue('')

  factory = (inner, otherClasses = '') ->
    el = undefined
    inject ($compile, $rootScope) ->
      el = $compile("<form name='formCtrl' class='form-group #{otherClasses}'>#{inner}</form>")($rootScope)
      $rootScope.$digest()
    return [el, el.scope().formCtrl]

  it "should set the inital state of the form-group", ->
    [el, ctrl] = factory('<input name="input" ng-model="foo" class="form-control">')

    setValid(ctrl.input, false)

    expect(el.hasClass('has-error')).toBe(true)
    expect(el.hasClass('has-success')).toBe(false)

  it "should set the inital state of the form-group, even if invalid", ->
    [el, ctrl] = factory('<input name="input" ng-model="foo" class="form-control">')

    setValid(ctrl.input, true)

    expect(el.hasClass('has-error')).toBe(false)
    expect(el.hasClass('has-success')).toBe(true)

  it "should only set form-group state if its controls are dirty", ->
    [el, ctrl] = factory('<input name="input" ng-model="foo" class="form-control">')

    ctrl.input.$setValidity('required', true)
    ctrl.input.$setDirty(false)

    expect(el.hasClass('has-error')).toBe(false)
    expect(el.hasClass('has-success')).toBe(false)

  it "shouldn't consider empty form groups valid", ->
    [el, ctrl] = factory('')

    expect(el.hasClass('has-error')).toBe(false)
    expect(el.hasClass('has-success')).toBe(false)

