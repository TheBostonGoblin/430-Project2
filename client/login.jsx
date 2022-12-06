const helper = require('./helper.js');

//helper functions handle login request
const handleLogin = (e) => {
    e.preventDefault();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector("#pass").value;
    const _csrf = e.target.querySelector("#_csrf").value;

    if (!username || !pass) {
        helper.handleJsonMessage('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, { username, pass, _csrf });

    return false;
}

//creates the login form
const LoginWindow = (props) => {
    return (
        <form id="loginForm"
            name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm is-centered"
        >

            <h1 className="column is-12 is-size-4 has-text-weight-bold">Login</h1>


            <label className="label" htmlFor="username">Username: </label>
            <input className="input" id="user" type="text" name="username" placeholder="Username" />
            <label className="label" htmlFor="pass">Password: </label>
            <input className="input mb-2" id="pass" type="password" name="pass" placeholder="Password" />
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className='formSubmit button is-primary is-centered' type="submit" value="Sign in" />
        </form>
    );
}

//inital function
const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(
        <LoginWindow csrf={data.csrfToken} />,
        document.querySelector('#content')
    );
};

window.onload = init;