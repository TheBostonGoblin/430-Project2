const helper = require('./helper.js');

//helper function used to send data to the server
const handleSignup = (e) => {
    e.preventDefault();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector("#pass").value;
    const pass2 = e.target.querySelector("#pass2").value;
    const _csrf = e.target.querySelector("#_csrf").value;

    if (!username || !pass || !pass2) {
        helper.handleJsonMessage('All fields are required!');
        return false;
    }

    if (pass !== pass2) {
        helper.handleJsonMessage('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, { username, pass, pass2, _csrf });

    return false;
}

//signup form
const SignupWindow = (props) => {
    return (
        <form id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm is-centered "
        >
            <label className='label' htmlFor="username">Username: </label>
            <input className='input' id="user" type="text" name="username" placeholder="username" />
            <label className='label' htmlFor="pass">Password: </label>
            <input className='input' id="pass" type="password" name="pass" placeholder="password" />
            <label className='label' htmlFor="pass2">Re-enter Password: </label>
            <input className='input' id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className='button is-primary formSubmit mt-3' type="submit" value="Sign Up!" />
        </form>
    );
}

//init function used to load react elements
const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(
        <SignupWindow csrf={data.csrfToken} />,
        document.querySelector('#content')
    );
};

window.onload = init;