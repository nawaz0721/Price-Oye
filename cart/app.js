import{
    auth,
    signOut,
    onAuthStateChanged,
    db,
    doc,
    getDoc,
    getDocs,
    collection,
    query,
    where,
    arrayRemove,
    arrayUnion,
    updateDoc,
} from "../utils/utlils.js";

const addProduct = document.getElementById('addProduct');
const myProduct = document.getElementById('myProduct');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userDropdown = document.getElementById('userDropdown');
const userImage = document.getElementById('userImage');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const cartContainer = document.getElementById('cart_container');

logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log('logout success');
        window.location.href = "../index.html";
    }).catch((error) => {   
        console.log(error.message);  
    });
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is signed in");
        loginBtn.style.display = 'none';
        userImage.style.display = 'block';
        showCartedProduct(user.uid)
        getCartedProducts(user.uid);
        getUserInfo(user.uid);
    } else {
        console.log("User is signed out");
        loginBtn.style.display = 'block';
        userImage.style.display = 'none';
        userDropdown.style.display = 'none';
    }
});

loginBtn.addEventListener('click', ()=>{
    window.location.href = "../login/index.html";
})

async function getCartedProducts(uid) {
    try {
        const q = query(collection(db, 'Products'), where("cart", "array-contains", uid));
        const querySnapshot = await getDocs(q);
        cartContainer.innerHTML = '';
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
            const product = doc.data();
            const card = `<div class="product-card">
                <h2>${product.productCategory}</h2>
                <img src="${product.productImage}">
                <h3>${product.productName}</h3>
                <div class="add">
                    <p class="price">Rs ${product.productPrice}</p>
                    <button id="${doc.id}" class="btn">${product.cart ? "Remove from Cart" : "Add to Cart"}</button>
                </div>
            </div>`;
            cartContainer.innerHTML += card;
        });
        showCartedProduct();
    } catch (err) {
        console.log(err.message);
    }
}

function showCartedProduct() {
    const cartedProductButtons = document.querySelectorAll('.btn');
    cartedProductButtons.forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            const productId = e.target.id;
            const productRef = doc(db, 'Products', productId);
            const productDoc = await getDoc(productRef);
            const userId = auth.currentUser.uid;

            if (productDoc.exists()) {
                const product = productDoc.data();

                if (product.cart && product.cart.includes(userId)) {
                    // Remove from cart
                    await updateDoc(productRef, {
                        cart: arrayRemove(userId),
                        quantity: product.quantity - 1 // Decrease quantity
                    });
                    btn.textContent = "Add to Cart";
                    // Update quantity display if needed
                } else {
                    // Add to cart
                    await updateDoc(productRef, {
                        cart: arrayUnion(userId),
                        quantity: product.quantity + 1 // Increase quantity
                    });
                    btn.textContent = "Remove from Cart";
                }
            }
        });
    });
}


