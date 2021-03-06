/*jsl:import test-helpers.js*/

Test.create('kvo-array', {

    setup: function()
    {
    },

    testNotificationCount: function(t)
    {
        var thing= new coherent.KVO();
        var objects= coherent.KVO.adaptTree([
                        {
                            name: 'foo'
                        },
                        {
                            name: 'bar'
                        },
                        {
                            name: 'goober'
                        },
                        {
                            name: 'baz'
                        }
                    ]);
        thing.setValueForKey(objects, 'objects');
        
        var observer= new TestObserver();
        
        thing.addObserverForKeyPath(observer, 'observeChange', 'objects.name');
        
        thing.setValueForKeyPath('zebra', 'objects.name');
        
        t.assertEqual(1, observer.count, "Incorrect number of change notifications <http://code.google.com/p/coherent/issues/detail?id=6>");
    },
    
    testSubArray: function(t)
    {
        var f= coherent.KVO.adaptTree({
            samples: [
                {
                    values: ['string1', 'string2', 'string3']
                },
                {
                    values: ['jkl', 'mno', 'pqr']
                }
            ]
        });
        var observer1= new TestObserver();
        var observer2= new TestObserver();
        
        f.addObserverForKeyPath(observer1, 'observeChange', 'samples');
        
        var obj= {
                    values: ['abc', 'def', 'ghi']
                };
        
        f.samples.addObject(coherent.KVO.adaptTree(obj));

        t.assertEqual(1, observer1.count, "Adding an object to samples");

        f.addObserverForKeyPath(observer2, 'observeChange', 'samples.values');
        
        f.samples[1].values.addObject('newstring');
        t.assertEqual(1, observer2.count, "Adding an object to samples[1].values");
    }

});
