var http = require('https');
var querystring = require('querystring');

var Shopify = {
    API_KEY: '',
    PASSWORD: '',
    
    authHeader: function() {
        if (!this._authHeader) {
            this._authHeader = 'Basic ' + (new Buffer(this.API_KEY + ':' + this.PASSWORD, 'ascii').toString('base64'));
        }
        
        return this._authHeader;
    }
};

// SHOP

var Shop = Shopify.Shop = function(subdomain) {
    if (!Shopify.API_KEY || !Shopify.PASSWORD) {
        throw 'Please provide a Shopify API key and password.';
    }
    
    this.url = subdomain + '.myshopify.com';
};

(function() {
    this.request = function(method, path, data, callback, unserialize) {
        var options = {
            host: this.url,
            path: '/admin/' + path + '.json',
            port: 443,
            method: method.toUpperCase(),
            headers: {'Authorization': Shopify.authHeader()}
        };
        
        if (data && options.method === 'GET') {
            options.path += '?' + querystring.stringify(data);
        }
        
        var req = http.request(options, function(res) {
            res.setEncoding('utf8');
            
            var data = "";
            res.on('data', function(chunk) {
                data += chunk;
            });
            
            res.on('end', function() {
                data = JSON.parse(data);
                unserialize && (data = unserialize(data));
                
                callback && callback(null, data);
            })
        });
        
        req.on('error', function(error) {
            callback && callback(error);
        });
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    };
    
    this.orders = function(options, callback) {
        callback = callback || options;
        options = options === callback || !options ? {} : options;
        
        this.request('get', 'orders', options, callback, function(data) {
            var orders = data.orders;
            var results = [];
            
            for (var i = -1, count = orders.length; ++i < count;) {
                results.push(new Order(this, orders[i]));
            }
            
            return results;
        }.bind(this));
    };
    
    this.products = function(options, callback) {
        callback = callback || options;
        options = options === callback || !options ? {} : options;
        
        this.request('get', 'products', options, callback, function(data) {
            var products = data.products;
            var results = [];
            
            for (var i = -1, count = products.length; ++i < count;) {
                results.push(new Product(this, products[i]));
            }
            
            return results;
        }.bind(this));
    };
}).call(Shop.prototype);

// ORDER

var Order = Shopify.Order = function(shop, data) {
    if (!shop instanceof Shop)
        throw 'Requires Shop';
    
    for (var key in data)
        this[key] = data[key];
};

(function() {
    
}).call(Order.prototype);

// PRODUCT

var Product = Shopify.Product = function(shop, data) {
    if (!shop instanceof Shop)
        throw 'Requires Shop';
    
    for (var key in data)
        this[key] = data[key];
};

(function() {
    
}).call(Product.prototype);

// Exports

exports.Shopify = Shopify;
