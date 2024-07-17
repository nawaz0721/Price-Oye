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
} from "../utils/utlils.js";

const addProduct = document.getElementById('addProduct');
const myProduct = document.getElementById('myProduct');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userDropdown = document.getElementById('userDropdown');
const userImage = document.getElementById('userImage');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const product_container = document.getElementById('product_container');
const cartnumber = document.getElementById('cartnumber');


logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log('logout success');
        window.location.href = "./index.html";
    }).catch((error) => {   
        console.log(error.message);  
    });
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is signed in");
        loginBtn.style.display = 'none';
        userImage.style.display = 'block';
        getMyProduct(user.uid);
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

async function getMyProduct(uid){
    try{
        const q = query(collection(db, 'Products'), where("createdBy", "==", uid));
        const querySnapshot = await getDocs(q);
        product_container.innerHTML = '';
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
            const product = doc.data();
            const cards = `<div class="product-card">
                <h2>${product.productCategory}</h2>
                <img src="${product.productImage}">
                <h3>${product.productName}</h3>
                <div class="add">
                    <p class="price">Rs ${product.productPrice}</p>
                    <button id="${doc.id}" class="btn">
                    ${(auth?.currentUser && product?.cart?.includes(auth?.currentUser.uid) ? "Carted" : "Add to Cart")}
                    </button> 
                </div>
            </div>`;
            product_container.innerHTML += cards;
        });
    }catch(err){
        alert(err.message);
    }
}
