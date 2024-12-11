const orders = JSON.parse(localStorage.getItem('orders')) || {};
const currentUser = localStorage.getItem('user');
console.log(currentUser); 
if (currentUser && orders[currentUser]) {
    const orderList = document.getElementById('order-list');
    orders[currentUser].forEach(order => {
        const li = document.createElement('li');
        li.textContent = order;
        orderList.appendChild(li);
    });
} else if (!currentUser) {
    window.location.href = 'login.html';
}

document.getElementById('username').textContent = currentUser;

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
});
function displayOrders(){
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const ordersContainer = document.getElementById('orders-list');
    console.log('orders.size: ',orders.length);//test how much order in account page

    if(orders.length==0){
        ordersContainer.innerHTML = '<p>No orders found. Start shopping now!</p>';
        return;
    }
    ordersContainer.innerHTML=``;
    //orders loop
    orders.forEach((order,index)=>{
        const orderCard=document.createElement('div');
        orderCard.classList.add('order-card');
        orderCard.setAttribute('data-index',index);//store index

        const user = order.currentUser;
        const date = new Date(order.orderDate).toLocaleDateString();

        
        orderCard.innerHTML=`
         <h2>Order by: ${user}</h2>
            <p>Order Date: ${date}</p>
        `;

        const orderItem=document.createElement('div');
        orderItem.classList.add('order-items');
        order.orderItems.forEach(item=>{
            const itemRow=document.createElement('div');
            itemRow.innerHTML=`
                <span>${item.productName} (x${item.quantity})</span>
                <span>$${item.totalPrice.toFixed(2)}</span>
            `
            orderItem.appendChild(itemRow);
        });
    
        orderCard.appendChild(orderItem);
        //cost
        const totalCost = document.createElement('p');
            totalCost.classList.add('total');
            totalCost.textContent = `Grand Total: $${order.grandTotal.toFixed(2)}`;
            orderCard.appendChild(totalCost);

        //cancel button
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel Order';
        cancelButton.classList.add('cancel-btn');
        cancelButton.addEventListener('click', () => {
            orders.splice(index, 1);// Remove the order from the array 
            localStorage.setItem('orders', JSON.stringify(orders)); // Update localStorage

            displayOrders();

            if(orders.length==0){
                ordersContainer.innerHTML = '<p>No orders found. Start shopping now!</p>';
                return;
            }
        });
        orderCard.appendChild(cancelButton);
        ordersContainer.appendChild(orderCard);

    });
}
displayOrders();