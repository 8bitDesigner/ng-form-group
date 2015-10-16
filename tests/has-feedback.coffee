describe 'The informative has-feedback directive', ->
  toArray = (arrayish) ->
    Array.prototype.slice.call arrayish

  find = (el, target) ->
    toArray el[0].querySelectorAll(target)

  beforeEach ->
    module('ng-form-group')

  factory = (inner) ->
    el = undefined
    inject ($compile, $rootScope) ->
      el = $compile("<form name='formCtrl' class='form-group has-feedback'>#{inner}</form>")($rootScope)
      $rootScope.$digest()
    return [el, el.scope().formCtrl]

  it "should only add one feedback icon per input", ->
    [el, ctrl] = factory('<input name="input" ng-model="foo" required class="form-control">')
    expect(find(el, '.form-control-feedback').length).toBe(0)

    ctrl.input.$setViewValue('testing')
    expect(find(el, '.form-control-feedback').length).toBe(1)

  it "should add an 'ok' icon for valid models", ->
    [el, ctrl] = factory('<input name="input" ng-model="foo" required class="form-control">')
    ctrl.input.$setViewValue('testing')

    expect(find(el, '.glyphicon-ok').length).toBe(1)
    expect(find(el, '.glyphicon-remove').length).toBe(0)

  it "should add a 'remove' icon for invalid models", ->
    [el, ctrl] = factory('<input name="input" ng-model="foo" required class="form-control">')
    ctrl.input.$setViewValue('1000')
    ctrl.input.$setViewValue('')

    expect(find(el, '.glyphicon-ok').length).toBe(0)
    expect(find(el, '.glyphicon-remove').length).toBe(1)

  it "should allow the use of custom feedback icons", ->
    [el, ctrl] = factory('<input name="input" ng-model="foo" required class="form-control" valid-icon="ohai" invalid-icon="kbai">')
    ctrl.input.$setViewValue('1000')
    ctrl.input.$setViewValue('')

    expect(find(el, '.glyphicon-ok').length).toBe(0)
    expect(find(el, '.glyphicon-remove').length).toBe(0)
    expect(find(el, '.kbai').length).toBe(1)

  it "should allow the use of custom feedback templates", ->
    inject ($templateCache) ->
      $templateCache.put 'custom-feedback.html', '<div class="form-control-feedback custom-feedback"></div>'
    [el, ctrl] = factory('<input name="input" ng-model="foo" required class="form-control" valid-icon="ohai" invalid-icon="kbai" feedback-template="custom-feedback.html">')

    # [el, ctrl] = factory('<input name="input" ng-model="foo" required class="form-control" feedback-template="custom-feedback.html"/>')
    ctrl.input.$setViewValue('1000')
    ctrl.input.$setViewValue('')

    expect(find(el, '.custom-feedback').length).toBe(1)
    expect(find(el, '.glyphicon-ok').length).toBe(0)
    expect(find(el, '.glyphicon-remove').length).toBe(0)