const helper = require('./helper.js');
let csrfToken;
var socket = io();
const UserInfo = (props) =>{

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
    const response = await fetch('/getMyPost');
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
        <DomoList csrf={data.csrfToken} domos={[]} />,
        document.querySelector("#domos")
    )

    loadDomosFromServer();
}


window.onload = init;