describe("View", function()
{

  beforeEach(function()
  {
    coherent.dataModel = new coherent.KVO();
    loadFixtures("views/basic-view.html");
  });

  it("should attach to a node", function()
  {
    var view = new coherent.View('view');
    expect(view.node).toExist();
    expect(view.node).toHaveId('view');
  });

  describe("bindings", function()
  {

    beforeEach(function()
    {
      this.context = new coherent.KVO({
        html: "This <b>html</b> is wonderful.",
        text: "Bindings are supercool.",
        visible: false,
        data: "Foo"
      });
      coherent.dataModel.setValueForKey(this.context, "context");
    });

    it("should set & update html", function()
    {
      var updatedHTML = "Some new <i>HTML</i>.";
      var view;
      
      runsInEventLoop(function()
      {
        view= new coherent.View('view', {
            htmlBinding: 'context.html'
          });
        view.setupBindings();
        view.init();
        view.updateBindings();
      });
      
      runsInEventLoop(function()
      {
        expect(view.node).toHaveHtml(this.context.html);
        this.context.setValueForKey(updatedHTML, "html");
      });
      
      runs(function()
      {
        expect(view.node).toHaveHtml(updatedHTML);
      });
    });

    it("should set & update text", function()
    {
      var updatedText = "My new text";
      var view = new coherent.View('view', {
            textBinding: 'context.text'
          });
        
      runsInEventLoop(function()
      {
        view.setupBindings();
        view.init();
        view.updateBindings();
      });
      
      runsInEventLoop(function()
      {
        expect(view.node).toHaveText(this.context.text);
        this.context.setValueForKey(updatedText, "text");
      });
      
      runs(function()
      {
        expect(view.node).toHaveText(updatedText);
      });
      
    });

    it("should create binding for data attribute", function()
    {
      var view = new coherent.View('view', {
            dataSourceValueBinding: 'context.data'
          });
          
      runsInEventLoop(function()
      {
        view.setupBindings();
        view.init();
        view.updateBindings();
      });
      
      runs(function()
      {
        expect(view.bindings).toHaveProperty('dataSourceValue');
      });
    });

    it("should not create binding for data attribute with an invalid name", function()
    {
      var view = new coherent.View('view', {
            dataBinding: 'context.data',
            datazBinding: 'context.data'
          });
      view.setupBindings();
      view.init();
      view.updateBindings();
      expect(view.bindings).not.toHaveProperty('data');
      expect(view.bindings).not.toHaveProperty('dataz');
    });

    it("should set & update data bindings", function()
    {
      var updatedData = "dataValue";
      var view = new coherent.View('view', {
            dataSourceValueBinding: 'context.data'
          });
      
      runsInEventLoop(function()
      {
        view.setupBindings();
        view.init();
        view.updateBindings();
      });
      
      runsInEventLoop(function()
      {
        expect(view.node).toHaveAttr('data-source-value', 'Foo');
        this.context.setValueForKey(updatedData, "data");
      });
      
      runs(function()
      {
        expect(view.node).toHaveAttr('data-source-value', updatedData);
      });
      
    });
  });
});
