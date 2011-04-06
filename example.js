var Shopify = require('./shopify').Shopify;

Shopify.API_KEY = 'YOUR_API_KEY';
Shopify.PASSWORD = 'YOUR_API_PASSWORD';

var shop = new Shopify.Shop('nicksmall');
shop.orders(function(err, orders) {
    console.log(orders[0].name, orders[0].line_items);
});
