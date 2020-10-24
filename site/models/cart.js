function newCart(cart) {
    var items = cart.items || {};
    var totalItems = cart.totalItems || 0;
    var totalPrice = cart.totalPrice || 0;

    return { add, remove, getItems, getCart, getTotalPrice };
    
    function add(item, id) {
        if (item.stock > 0) {
            var cartItem = items[id];
            if (!cartItem) {
                cartItem = items[id] = { item: item, quantity: 0, price: 0 };
            }
            cartItem.quantity++;
            cartItem.price = cartItem.item.price * cartItem.quantity;
            totalItems++;
            totalPrice += cartItem.item.price;
        }
    }

    function remove(id) {
        totalItems -= items[id].quantity;
        totalPrice -= items[id].price;
        delete items[id];
    }

    function getItems() {
        var arr = [];
        for (var id in items) {
            arr.push(items[id]);
        }
        return arr;
    }

    function getCart() {
        return { items, totalItems, totalPrice };
    }

    function getTotalPrice() {
        return totalPrice;
    }
}

module.exports = newCart;