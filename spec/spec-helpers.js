(function(){
  var objectToString= Object.prototype.toString;
  var PRIMITIVE_TYPES= [String, Number, RegExp, Boolean, Date];
  
  beforeEach(function() {
  
    this.addMatchers({
      toBeEmpty: function()
      {
        return (this.actual instanceof Array && this.actual.length==0);
      },
      
      toHaveProperty: function(prop)
      {
        return prop in this.actual;
      },
      toHaveMethod: function(prop)
      {
        return prop in this.actual && 'function'==typeof(this.actual[prop]);
      },
      toBeInstanceOf: function(type)
      {
        this.message= function(args)
        {
          return ["Expected", jasmine.pp(this.actual), (this.isNot?"not":""), "to be of type",
                  objectToString.call(type.prototype).slice(8,-1)].join(" ");
        }
        
        if (null==this.actual)
          return type==null;
          
        if (-1!==PRIMITIVE_TYPES.indexOf(this.actual.constructor))
          return this.actual.constructor==type;
        
        return this.actual instanceof type;
      }
    });
  });

})();

function CompletionSignal()
{
  function me()
  {
    return me.complete;
  }
  me.set= function(value)
  {
    me.complete= value;
  }
  return me;
}

var TestObserver= Class.create({

    constructor: function(minCountToComplete)
    {
        this.value= void(0);
        this.called= false;
        this.count= 0;
        this.minCountToComplete = (void(0)==minCountToComplete) ? 1 : minCountToComplete;
        this.complete = this.complete.bind(this);
    },
    
    observeChange: function(change, keyPath, context)
    {
        this.value= change.newValue;
        this.called= true;
        this.change= change;
        this.keyPath= keyPath;
        this.context= context;
        ++this.count;
    },
    
    reset: function()
    {
        this.value= undefined;
        this.called= false;
        this.change= null;
        this.keyPath= null;
        this.context= null;
        this.count= 0;
    },
    
    complete: function()
    {
      return this.count >= this.minCountToComplete;
    }
});

window.runsInEventLoop= function(fn)
{
  runs(function()
  {
    coherent.EventLoop.run(fn);
  });
}