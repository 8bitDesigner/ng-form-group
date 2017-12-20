describe 'The classy form-group directive', ->
  beforeEach ->
    angular.mock.module('ng-form-group')

  factory = (inner, otherClasses = '') ->
    el = undefined
    inject ($compile, $rootScope) ->
      el = $compile("<form name='formCtrl' class='form-group #{otherClasses}'>#{inner}</form>")($rootScope)
      $rootScope.$digest()
    return [el, el.scope().formCtrl]

  it "update the form group's classes when the view value changes", ->
    [el, ctrl] = factory('<input name="input" ng-model="foo" required class="form-control">')

    expect(el.hasClass('has-error')).toBe(false)
    expect(el.hasClass('has-success')).toBe(false)

    ctrl.input.$setViewValue('oh hai')

    expect(el.hasClass('has-error')).toBe(false)
    expect(el.hasClass('has-success')).toBe(true)

    ctrl.input.$setViewValue('')

    expect(el.hasClass('has-error')).toBe(true)
    expect(el.hasClass('has-success')).toBe(false)

  it "should only apply classes when all inputs in a group are dirty", ->
    [el, ctrl] = factory """
      <input name="aInput" ng-model="foo" required class="form-control">
      <input name="bInput" ng-model="bar" required class="form-control">
    """

    ctrl.aInput.$setViewValue('oh hai')

    expect(el.hasClass('has-error')).toBe(false)
    expect(el.hasClass('has-success')).toBe(false)

    ctrl.bInput.$setViewValue('oh hai')

    expect(el.hasClass('has-error')).toBe(false)
    expect(el.hasClass('has-success')).toBe(true)

  it "should apply classes when the form is submitted - even if pristine", ->
    scope = undefined;
    inject ($rootScope) -> scope = $rootScope

    [el, ctrl] = factory """
        <input name="aInput" ng-model="foo" required class="form-control">
        <input name="bInput" ng-model="bar" required class="form-control">
    """

    ctrl.$setSubmitted();
    scope.$digest();

    expect(el.hasClass('has-error')).toBe(true)
    expect(el.hasClass('has-success')).toBe(false)

  it "should bypass elements with the class `form-group-without-feedback`", ->
    [el, ctrl] = factory('<input name="input" ng-model="foo" required class="form-control">', 'form-group-without-feedback')

    expect(el.hasClass('has-error')).toBe(false)
    expect(el.hasClass('has-success')).toBe(false)

    ctrl.input.$setViewValue('oh hai')

    expect(el.hasClass('has-error')).toBe(false)
    expect(el.hasClass('has-success')).toBe(false)

    ctrl.input.$setViewValue('')

    expect(el.hasClass('has-error')).toBe(false)
    expect(el.hasClass('has-success')).toBe(false)

  it "shouldn't throw an error if no form group controller is present", ->
    inject ($compile, $rootScope) ->
      el = $compile('<input name="input" ng-model="foo" required class="form-control">')($rootScope)
      $rootScope.$digest()

  it "shouldn't highlight labels in a form-group without form-contols", ->
    [el, ctrl] = factory("""
      <label class="control-label">Hai</label>
      <input name="input" ng-model="foo" min-length=2>
    """)

    expect(el.hasClass('has-error')).toBe(false)
    expect(el.hasClass('has-success')).toBe(false)

    ctrl.input.$setViewValue('oh hai')

    expect(el.hasClass('has-error')).toBe(false)
    expect(el.hasClass('has-success')).toBe(false)
