import { login, logout ,signup} from '/script/login.js';

const front = document.getElementById('flip-card-btn-turn-to-back');
const back = document.getElementById('flip-card-btn-turn-to-front');
const frontClick = document.getElementById('flip-card-btn-turn-to-back');
const backClick = document.getElementById('flip-card-btn-turn-to-front');
const forms = document.querySelector('.login-form');
const userRegister = document.getElementById('register');

if (front) {
    front.style.visibility = 'visible';
}

if (back) {
    back.style.visibility = 'visible';
}

if (frontClick) {
    frontClick.onclick = function () {
        document.getElementById('flip-card').classList.toggle('do-flip');
    };
}

if (backClick) {
    backClick.onclick = function () {
        document.getElementById('flip-card').classList.toggle('do-flip');
    };
}

if (forms) {
    forms.addEventListener('submit', e => {
        e.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        console.log(email, password);
        login(email, password);
    })
}

if(userRegister){
    userRegister.addEventListener('submit', function(e){
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('re-password').value;

        signup(name, email, password, passwordConfirm);
    })
}