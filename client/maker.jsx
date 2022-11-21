const helper = require('./helper.js');
let csrfToken;
var socket = io();

const handleUpload = (e) => {
    e.preventDefault();
    helper.hideError();

    const file = e.target.querySelector('#sampleFile').files[0];
    const _csrf = e.target.querySelector('#_csrf').value;

    if (!file) {
        helper.handleError("All fields are required!");
        return false;
    }

    helper.sendPost(e.target.action, { file, _csrf });
    return false;

}
const handlePost = (e) => {
    e.preventDefault();
    helper.hideError();

    const dishName = e.target.querySelector('#dishName').value;
    const nutri = e.target.querySelector('#nutriPlus').value;
    const ingre = e.target.querySelector('#dishIngre').value;
    const image = e.target.querySelector('#image').value;
    const likes = e.target.querySelector('#likes').value;
    const likedBy = e.target.querySelector('#likedBy').value;
    const hasLiked = e.target.querySelector('#hasLiked').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if (!dishName || !nutri || !ingre || !image) {
        helper.handleError("All fields are required!");
        return false;
    }


    helper.sendPost(e.target.action, { dishName, nutri, ingre, image, likes, likedBy, hasLiked, _csrf }, loadDomosFromServer);
    return false;
}
const handleUpdateDomo = (e) => {
    e.preventDefault();
    helper.hideError();

    const domoID = e.target.querySelector("#domoId").value;
    const _csrf = e.target.querySelector("#_csrf").value;

    if (!domoID) {
        helper.handleError("unable to get domo Object");
        return false;
    }

    helper.sendPost(e.target.action, { domoID, _csrf }, loadDomosFromServer);
    return false;
}

const handleDeleteDomo = (e) => {
    e.preventDefault();
    helper.hideError();

    const domoID = e.target.querySelector("#domoId").value;
    const _csrf = e.target.querySelector("#_csrf").value;

    if (!domoID) {
        helper.handleError("unable to get domo Object");
        return false;
    }

    helper.sendPost(e.target.action, { domoID, _csrf }, loadDomosFromServer);
    return false;
}
const UploadForm = (props) => {
    return (<form
        id='uploadForm'
        onSubmit={handleUpload}
        action='/upload'
        method='POST'
        encType="multipart/form-data">
        <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
        <input id="sampleFile" type="file" name="sampleFile" />
        <input type='submit' value='Upload!' />
    </form>);
}
const DomoForm = (props) => {
    return (
        <div className="box">
            <form id="domoForm"
                name="loginForm"
                onSubmit={handlePost}
                action="/maker"
                method="POST"
                className="domoForm"
            >
                <label htmlFor="name">Dish Name: </label>
                <input id="dishName" type="text" name="name" placeholder="Domo Name" />

                <label htmlFor="plus">Nutritional Pluses: </label>
                <input id="nutriPlus" type="text" name="plus" />

                <label htmlFor="ingredients">Dish Ingredients: </label>
                <input id="dishIngre" type="text" name="ingredients" />

                <label htmlFor="image">Dish Image: </label>
                <input type="file" name="image" id='image' />

                <input type="hidden" name='likes' value={0} id='likes' />

                <input type="hidden" name='likedBy' id='likedBy' />

                <input type="hidden" name='hasliked' id='hasliked' value={false} />

                <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
                <input className='makeDomoSubmit' type="submit" value="Make Domo" />
            </form>
        </div>

    );
}

const DomoList = (props) => {
    if (props.domos.length === 0) {
        return (
            <div className='domoList columns is-multiline'>
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        )
    }

    console.log(props);
    const domoNodes = props.domos.map(domo => {
        return (
            <div key={domo._id} className="domo card card-equal-height column is-4">

                <div className='card-image'>
                    <figure className="image is-square ">
                        <img src="/assets/img/recipePlaceholder.png" alt="domo face" className="recipeImage" />
                    </figure>
                </div>

                <div className='card-content'>

                    <h3 className="dishName title has-text-centered"> {domo.dishName} </h3>
                    <h3 className="dishNuritPlus subtitle has-text-centered"> Nutritional Plus: {domo.nutri} </h3>
                    <h3 className="dishIngredients subtitle has-text-centered"> Ingerdients: {domo.ingre} </h3>
                    <h3 className="likes subtitle has-text-centered" > Food Likes: {domo.likes} </h3>
                    <h3 className="likedBy subtitle has-text-centered" > Who Liked The Post: {domo.likedBy} </h3>

                </div>

                <div className="card-footer columns">
                    <form
                        id="likeForm"
                        name="likeForm"
                        onSubmit={handleUpdateDomo}
                        action="/like"
                        method='POST'
                        className='likeForm column is-4'
                    >
                        <input id="_csrf" type="hidden" name="_csrf" value={csrfToken} />
                        <input id="domoId" type="hidden" name="domoId" value={domo._id} />
                        <input id="likeSubmit" className='likeSubmit button is-primary' type="submit" value="Like Post" disabled={domo.hasLiked} />
                    </form>

                    <form
                        id="unlikeForm"
                        name="unlikeForm"
                        onSubmit={handleUpdateDomo}
                        action="/unlike"
                        method='POST'
                        className='unlikeForm column is-4'
                    >
                        <input id="_csrf" type="hidden" name="_csrf" value={csrfToken} />
                        <input id="domoId" type="hidden" name="domoId" value={domo._id} />
                        <input id="likeSubmit" className='likeSubmit button is-warning' type="submit" value="UnLike Post" disabled={!domo.hasLiked} />
                    </form>

                    <form
                        id="deleteForm"
                        name="deleteForm"
                        onSubmit={handleDeleteDomo}
                        action="/delete"
                        method='POST'
                        className='deleteForm column is-4'
                    >
                        <input id="_csrf" type="hidden" name="_csrf" value={csrfToken} />
                        <input id="domoId" type="hidden" name="domoId" value={domo._id} />
                        <input className='deleteSubmit button is-danger' type="submit" value="Delete Domo" />
                    </form>
                </div>


            </div>
        )
    });

    return (
        <div className="domoList columns is-multiline">
            {domoNodes}
        </div>
    );
}

const loadDomosFromServer = async () => {
    const response = await fetch('/getAllPosts');
    const data = await response.json();

    ReactDOM.render(
        <DomoList domos={data.domos} />,
        document.querySelector("#domos")
    );
}

const init = async () => {

    console.log(`socket is : ${socket}`);
    const response = await fetch('/getToken');
    const data = await response.json();
    csrfToken = data.csrfToken;
    ReactDOM.render(
        <DomoForm csrf={data.csrfToken} />,
        document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <UploadForm csrf={data.csrfToken} />,
        document.querySelector("#imageUpload")
    )

    ReactDOM.render(
        <DomoList csrf={data.csrfToken} domos={[]} />,
        document.querySelector("#domos")
    )

    loadDomosFromServer();
}

window.onload = init;