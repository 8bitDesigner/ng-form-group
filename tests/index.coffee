describe 'The classy form-group directive', ->
  beforeEach ->
    module('ng-form-group')

  factory = (inner, otherClasses = '') ->
    el = undefined
    inject ($compile, $rootScope) ->
      el = $compile("<div id='foo' class='form-group #{otherClasses}'>#{inner}</div>")($rootScope)
      el.find('.form-control').trigger('blur')
      $rootScope.$digest()
    return el

  it "should set the inital state of the form-group", ->
    invalid = factory('<input class="form-control ng-dirty ng-invalid">')
    expect(invalid.hasClass('has-error')).toBe(true)
    expect(invalid.hasClass('has-success')).toBe(false)

    valid = factory('<input class="form-control ng-dirty ng-valid">')
    expect(valid.hasClass('has-error')).toBe(false)
    expect(valid.hasClass('has-success')).toBe(true)

  it "should update when the controls classes change", ->
    el = factory('<input class="form-control ng-pristine">')
    expect(el.hasClass('has-error')).toBe(false)
    expect(el.hasClass('has-success')).toBe(false)

    el.find('.form-control').removeClass('ng-pristine').addClass('ng-dirty ng-invalid')
    el.scope().$digest()

    expect(el.hasClass('has-error')).toBe(true)
    expect(el.hasClass('has-success')).toBe(false)

    el.find('.form-control').removeClass('ng-invalid').addClass('ng-valid')
    el.scope().$digest()

    expect(el.hasClass('has-error')).toBe(false)
    expect(el.hasClass('has-success')).toBe(true)

  it "should only set form-group state if its controls are dirty", ->
    invalid = factory('<input class="form-control ng-pristine ng-invalid">')
    expect(invalid.hasClass('has-error')).toBe(false)
    expect(invalid.hasClass('has-success')).toBe(false)

    valid = factory('<input class="form-control ng-pristine ng-valid">')
    expect(valid.hasClass('has-error')).toBe(false)
    expect(valid.hasClass('has-success')).toBe(false)

  it "should need every input to be dirty before adding classes", ->
    el = factory """
      <input type="radio" class="form-control ng-dirty ng-invalid">
      <input type="radio" class="form-control ng-pristine">
      <input type="radio" class="form-control ng-pristine">
    """

    expect(el.hasClass('has-error')).toBe(false)
    expect(el.hasClass('has-success')).toBe(false)

  it "should only need a single invalid form control to add the error class", ->
    el = factory """
      <input type="radio" class="form-control ng-dirty ng-invalid">
      <input type="radio" class="form-control ng-dirty ng-valid">
      <input type="radio" class="form-control ng-dirty ng-valid">
    """

    expect(el.hasClass('has-error')).toBe(true)
    expect(el.hasClass('has-success')).toBe(false)


  it "should only need all valid form controls to add the success class", ->
    el = factory """
      <input type="radio" class="form-control ng-dirty ng-valid">
      <input type="radio" class="form-control ng-dirty ng-valid">
      <input type="radio" class="form-control ng-dirty ng-valid">
    """

    expect(el.hasClass('has-error')).toBe(false)
    expect(el.hasClass('has-success')).toBe(true)

  it "shouldn't consider empty form groups valid", ->
    el = factory('')

    expect(el.hasClass('has-error')).toBe(false)
    expect(el.hasClass('has-success')).toBe(false)
