// Creating nessary global variables such as my helper function the csrf token and socket io instance
const helper = require('./helper.js');
let csrfToken;
var socket = io();

//Below all functions starting with "handler" are onsubmit handler functions that utalize our helper functions to send data to the server
const handlePassChange = (e) => {
    e.preventDefault();

    const pass = e.target.querySelector("#pass").value;
    const pass2 = e.target.querySelector("#pass2").value;
    const _csrf = e.target.querySelector("#_csrf").value;

    helper.sendPost(e.target.action, { pass, pass2, _csrf });

    return false;
}

const handleUpdatePost = (e) => {
    e.preventDefault();

    helper.updateUploadFile(e, loadPostFromMongoDB);
}

const handleMembership = (e) => {
    e.preventDefault();

    let _csrf = e.target.querySelector("#_csrf").value;

    helper.sendPost(e.target.action, { _csrf }, loadPostFromMongoDB);
}

//react element welcoming the user back
const UserInfo = (props) => {
    console.log(props.account);

    return (
        <div className='title'>Hello, {props.account.username}! Welcome Back to Gobble!</div>
    )
}

//This form will handle if the user changes their password
const ChangePassForm = (props) => {
    return (
        <form
            action="/updatePass"
            method="POST"
            name="signupForm"
            onSubmit={handlePassChange}
            className="changePass">

            <div className='has-text-centered'>
                <div className='title has-font-weight-bold' htmlFor="membershipStat">Change Password</div>
            </div>

            <label className='label' htmlFor="pass">Password: </label>
            <input className='input' id="pass" type="text" name="pass" placeholder="new password" />
            <label className='label' htmlFor="pass2">Password Retype: </label>
            <input className='input' id="pass2" type="text" name="pass2" placeholder="re-enter new password" />
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className='formSubmit button is-danger mt-2' type="submit" value="Change Password" />

            <div id='jsonMessage' className='subtitle has-text-weight-bold'>

            </div>

        </form>
    )
}

//Although similar to makers PostList in this case post are generated with forms that update your post
const PostList = (props) => {


    //handling if you've created no post
    if (props.posts.length === 0) {
        return (
            <div className='postList columns is-multiline'>
                <h3 className="No Post">No Post Submited!</h3>
            </div>
        )
    }

    const postNodes = props.posts.map(post => {

        //retieves the image of the post from the server from file models
        let imageSRC = post.image ? `/retrieve?_id=${post.image}` : "/assets/img/recipePlaceholder.png";

        // Will ensure that each user that has liked a post will be seperated by a comma
        let likedByString = '';
        for (let x = 0; x < post.likedBy.length; x++) {
            if ((x + 1) === (post.likedBy.length)) {
                likedByString += post.likedBy[x];
            }
            else {
                likedByString += `${post.likedBy[x]},`;
            }

        }

        if (likedByString === undefined || likedByString === null || likedByString === '') {
            likedByString = "No likes yet!"
        }

        
        return (
            <div key={post._id} className="post card card-equal-height column is-4">

                <div className='card-image'>
                    <figure className="image is-square">
                        <img src={imageSRC} alt="placeholder image" className="recipeImage" />
                    </figure>
                </div>

                <div className='card-content'>

                    <h3 className="dishName title has-text-centered"> {post.dishName} </h3>
                    <h3 className="dishNuritPlus subtitle has-text-centered"> Nutritional Plus: {post.nutri} </h3>
                    <h3 className="dishIngredients subtitle has-text-centered"> Ingerdients: {post.ingre} </h3>
                    <h3 className="likes subtitle has-text-centered" > Food Likes: {post.likes} </h3>
                    <h3 className="likedBy subtitle has-text-centered" > Who Liked The Post: {`${likedByString}`} </h3>
                    <input id="postID" type="hidden" name="postID" value={post._id} />
                </div>
                <PostUpdate post={post} csrf={props.csrf} />

            </div>
        )
    });

    return (
        <div className="postList columns is-multiline">
            {postNodes}
        </div>
    );
}
//This is a form created with post the user has made. allowing them to change post
const PostUpdate = (props) => {
    console.log("posting is here below")
    console.log(props)
    return (
        <div className='container box'>
            <form id="postForm"
                name="loginForm"
                onSubmit={handleUpdatePost}
                key={props.post._id}
                action="/editPost"
                method="POST"
                className="postForm has-text-centered is-centered"
                encType="multipart/form-data"
            >
                <label className="label" htmlFor="name">Dish Name </label>
                <input className="input" id="dishName" type="text" name="name" placeholder="New Dish Name" />

                <label className="label" htmlFor="plus">Nutritional Pluses </label>
                <input className="input" id="nutriPlus" type="text" name="plus" placeholder="New Nutritional Pluses" />

                <label className="label" htmlFor="ingre">Dish Ingredients: </label>
                <input className="input" id="dishIngre" type="text" name="ingre" placeholder="New Ingredients Pluses" />

                <label className="label" htmlFor="image">Dish Image: </label>
                <input className="input" type="file" name="image" id='image' />

                <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
                <input id="postID" type="hidden" name="postID" value={props.post._id} />

                <div id='jsonMessageUpdate' className='subtitle has-text-weight-bold'>

                </div>

                <input className='button is-danger column is-12 mt-2 makeDomoSubmit' type="submit" value="Update Post" />
            </form>
        </div>


    )

}

//Used to create a form allowing the user to gain premium membership or not 
const ToggleMemebership = (props) => {

    let membershipButton;

    console.log("account below");
    console.log(props.account);
    if (props.account.membership === true) {
        membershipButton = <form
            action="/deMember"
            method="POST"
            name='actMemberForm'
            onSubmit={handleMembership}
            key="active"
            className='actMemberForm columns is-multiline is-centered'>

<div className='column is-12 has-text-centered'>
                <div className='title has-font-weight-bold' htmlFor="membershipStat">You are currently a Memeber! Hope you stick around but you can always cancel your membership below</div>
            </div>


            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input id='member' name='member' className='input button is-danger memberSubmit mt-2 column is-12' type="submit" value="Cancel Premium Membership" />
        </form>
    }
    else {

        membershipButton = <form
            action="/aMember"
            method="POST"
            onSubmit={handleMembership}
            name='deActMemberForm'
            key="deactive"
            className='deActMemberForm columns is-multiline is-centered'>

            <div className='column is-12 has-text-centered'>
                <div className='title has-font-weight-bold' htmlFor="membershipStat">You are currently not a member, Subscribe For a Premium Memebership today!</div>
            </div>



            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input id='member' name='member' className='input button is-primary memberSubmit mt-2 column is-12' type="submit" value="Gain Premium Membership" />
        </form>
    }
    return (
        <div id='memFormContainer'>
            {membershipButton}
        </div>

    )
}

//function often used by helpers to ensure the server updates after a form has been completed
const loadPostFromMongoDB = async () => {
    const response = await fetch('/getMyPost');
    const data = await response.json();

    const response2 = await fetch('/getAccount');
    const data2 = await response2.json();

    const responseCSRF = await fetch('/getToken');
    const dataCSRF = await responseCSRF.json();
    const csrfToken = dataCSRF.csrfToken;

    ReactDOM.render(
        <PostList posts={data.posts} csrf={csrfToken} />,
        document.querySelector("#posts")
    );

    ReactDOM.render(
        <UserInfo account={data2.account} />,
        document.querySelector(".welcome")
    );

    ReactDOM.render(
        <ChangePassForm csrf={csrfToken} account={data2.account} />,
        document.querySelector("#changePass")
    );

    ReactDOM.render(
        <ToggleMemebership csrf={csrfToken} account={data2.account} />,
        document.querySelector("#membership")
    )
}

//loads to inital react elements before its submited
const init = async () => {

    console.log(`socket is : ${socket}`);
    const response = await fetch('/getToken');
    const data = await response.json();
    csrfToken = data.csrfToken;

    ReactDOM.render(
        <UserInfo csrf={data.csrfToken} account={[]} />,
        document.querySelector(".welcome")
    )
    //testingUser
    ReactDOM.render(
        <PostList csrf={data.csrfToken} posts={[]} />,
        document.querySelector("#posts")
    )

    ReactDOM.render(
        <ChangePassForm csrf={csrfToken} account={[]} />,
        document.querySelector("#changePass")
    );

    ReactDOM.render(
        <ToggleMemebership csrf={csrfToken} account={[]} />,
        document.querySelector("#membership")
    )

    loadPostFromMongoDB();
}


window.onload = init;