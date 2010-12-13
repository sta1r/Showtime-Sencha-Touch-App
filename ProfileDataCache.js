Ext.ns("Showtime");

Showtime.ProfileDataCache = Ext.extend(Object, {
    
    constructor: function(course) {
       	this.data = [];
        this.requests = [];
        this.course = course;
        this.category = 'sweaters',
        this.textSearch = undefined
    },
    
    getItems: function(index, count, cb, scope) {
        if (this.hasData(index, count)) {
            if (cb) { cb.call(scope, this.data.slice(index, index+count)); }
        }
        else {
            if (cb) {
                this.requests.push({index: index, count: count, cb: cb, scope: scope});
            }
            
            if (!this.isQueued(index, count)) {
                this.queueData(index, count);
                Showtime.APIService.fetch(
                    {
                        min: index,
                        count: count
                    },
                    this.onDataReceive,
                    this
                    //function(success, result){console.log(result);}
                    //this.onDataReceive.createDelegate(this, [index, count], true)
                );
                /*SS.ShopStyleService.search(
                    {
                        cat: this.category,
                        fts: this.textSearch || undefined,
                        min: index,
                        count: count
                    },
                    this.onDataReceive.createDelegate(this, [index, count], true)
                );*/
            }
        }
    },
    
    hasData: function(index, count) {
        var data = this.data,
            max = index+count;
         
        
        if (this.totalItems != null) {
            //max = max.constrain(0, this.totalItems-1);
        }
        
        for (var i = index; i<max; i++) {
            if (data[i] == null || data[i] === true) {
                return false;
            }
        }
        return true;
    },
    
    addData: function(index, data) {
        var len = data.length,
            totLen = index+len;
        
        if (this.data.length < totLen) {
            this.data.length = totLen;
        }
        
        var args = data.slice(0);
        args.unshift(index, len);
        this.data.splice.apply(this.data, args);
    },
    
    queueData: function(index, count) {
        var data = this.data,
            max = index+count;
        for (var i = index; i<max; i++) {
            if (data[i] == null) {
                data[i] = true;
            }
        }
    },
    
    isQueued: function(index, count) {
        var data = this.data,
            max = index+count;
            
        if (this.totalItems != null) {
            max = max.constrain(0, this.totalItems-1);
        }
            
        for (var i = index; i<max; i++) {
            if (data[i] == null) {
                return false;
            }
        }
        return true;
    },
    
    onDataReceive: function(success, results, index, count) {
    	if (success) {
            //this.totalItems = results.totalCount;
    		this.totalItems = results.totalCount;
            this.addData(index, results.data.Profiles);
            this.fireCallbacks();         
        }
    },
    
    fireCallbacks: function() {
        var i = 0;
        while (i < this.requests.length) {
            var request = this.requests[i],
                index = request.index,
                count = request.count;
            if (this.hasData(index, count)) {
                request.cb.call(request.scope, this.data.slice(index, index+count));
                this.requests.splice(i, 1);
            }
            else {
                i++;
            }
        }
    },
    
    clearCallbacks: function() {
        this.requests = [];  
    },
    
    maxIndex: function() {
        return this.data.length-1;
    }
});