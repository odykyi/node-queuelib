var Q = require('../');
var test = require('tape');

test('terminate test while in forEach', function(t) {
  t.plan(1);  
  var queue = new Q;
  var list = [];
  queue.forEach(['a','b','c','d'],function(val,idx,lib) {
    list.push(val);
    if (idx == 2) {
      lib.terminate();
      return
    } else 
      lib.done();    
  }, function() {
    console.log("ALL DONE");
    t.deepEqual(list,['a','b','c'])
  })
})

test.skip('terminate test while in series', function (t) {
    var queue = new Q;
    var list = [];

    t.plan(2);
    queue.series([
        function(lib) {
            setTimeout(function() {
                list.push(1);
                lib.done();
            },100);
        },
        function(lib) {
            setTimeout(function() {
                list.push(2);
                lib.terminate();
            },100);
        },
        function(lib) {
            setTimeout(function() {
                list.push(3);
                lib.done();
            },100);
        }
    ]);
    queue.pushAsync(function(lib) {
        list.push(1);
        lib.done();
    });
    queue.pushAsync(function(lib) {
        t.deepEqual(list,[1,2,1]);
        lib.done();
    }); 
    queue.series([
        function(lib) {
            list.push(2);
            lib.done();
        },
        function(lib,id) {
            t.deepEqual(list,[1,2,1,2]);
            lib.terminate();
        },
        function(lib) {
            t.fail('YOU SHOULD NEVER SEE THIS MESSAGE');
        }
    ]);
});
