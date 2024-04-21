// Function to toggle sidebar
document.getElementById('cartIcon').addEventListener('click', function(event) {
    event.preventDefault();
    var sidebar = document.getElementById('sidebar');
    var closeIcon = document.getElementById('closeIcon');
    sidebar.classList.toggle('open');
    toggleScroll();

    if (sidebar.classList.contains('open')) {
        closeIcon.addEventListener('click', closeSidebar);
        window.removeEventListener('click', closeSidebarOutside);
        document.querySelectorAll('a:not(#closeIcon)').forEach(function(link) {
            link.addEventListener('click', function(event) {
                event.stopPropagation();
            });
        });
    } else {
        window.addEventListener('click', closeSidebarOutside);
        document.querySelectorAll('a:not(#closeIcon)').forEach(function(link) {
            link.removeEventListener('click', function(event) {
                event.stopPropagation();
            });
        });
    }
});

// Function to close sidebar
function closeSidebar(event) {
    event.preventDefault();
    var sidebar = document.getElementById('sidebar');
    var closeIcon = document.getElementById('closeIcon');
    sidebar.classList.remove('open');
    toggleScroll();
    closeIcon.removeEventListener('click', closeSidebar);
    window.addEventListener('click', closeSidebarOutside);
}

// Function to close the sidebar when clicking outside it
function closeSidebarOutside(event) {
    var sidebar = document.getElementById('sidebar');
    var cartIcon = document.getElementById('cartIcon');
    if (!sidebar.contains(event.target) && event.target !== cartIcon) {
        closeSidebar(event);
    }
}

// Function to toggle scroll behavior
function toggleScroll() {
    var body = document.body;
    if (body.style.overflow === 'hidden') {
        body.style.overflow = '';
    } else {
        body.style.overflow = 'hidden';
    }
}

// Function to add item to the cart
function addToCart(item) {
    var cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');

    var productDetails = document.createElement('div');
    productDetails.classList.add('product-details');

    var productName = document.createElement('span');
    productName.textContent = item;
    productName.classList.add('product-name');
    productDetails.appendChild(productName);

    var productPrice = document.createElement('span');
    productPrice.textContent = '$23.9';
    productPrice.classList.add('product-price');
    productDetails.appendChild(productPrice);

    var counter = document.createElement('div');
    counter.classList.add('counter');
    counter.innerHTML = `
        <button class="decrementBtn">-</button>
        <span class="itemCount">1</span>
        <button class="incrementBtn">+</button>
    `;
    productDetails.appendChild(counter);

    cartItem.appendChild(productDetails);

    var deleteBtn = document.createElement('button');
    deleteBtn.classList.add('deleteBtn');
    deleteBtn.textContent = 'Delete';
    cartItem.appendChild(deleteBtn);

    var cartCount = document.getElementById('cartCount');
    var count = parseInt(cartCount.textContent);
    cartCount.textContent = count + 1;

    var decrementBtn = counter.querySelector('.decrementBtn');
    var incrementBtn = counter.querySelector('.incrementBtn');

    decrementBtn.addEventListener('click', function() {
        var itemCount = counter.querySelector('.itemCount');
        var count = parseInt(itemCount.textContent);
        if (count > 1) {
            itemCount.textContent = count - 1;
        } else {
            cartItem.remove();
            updateCartCount();
        }
    });
    
    incrementBtn.addEventListener('click', function() {
        var itemCount = counter.querySelector('.itemCount');
        var count = parseInt(itemCount.textContent);
        itemCount.textContent = count + 1;
    });

    deleteBtn.addEventListener('click', function() {
        cartItem.remove();
        updateCartCount();
    });

    return cartItem;
}

// Attach click event listeners to all "Add to Cart" buttons
document.querySelectorAll('.card-btns').forEach(function(button) {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        var item = this.closest('.card').querySelector('.card-text').innerText.trim();
        var cartItem = addToCart(item);
        var cartContainer = document.getElementById('cartContainer');
        cartContainer.appendChild(cartItem);
    });
});
