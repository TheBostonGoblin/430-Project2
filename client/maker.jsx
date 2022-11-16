const helper = require('./helper.js');
let csrfToken;
const handleDomo = (e) =>{
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const level = e.target.querySelector('#domoLevel').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if(!name || !age || !level){
        helper.handleError("All fields are required!");
        return false;
    }


    helper.sendPost(e.target.action, {name,age,level,_csrf}, loadDomosFromServer);
    return false;
}
const handleUpdateDomo = (e) =>{
    e.preventDefault();
    helper.hideError();

    const domoID = e.target.querySelector("#domoId").value;
    const _csrf = e.target.querySelector("#_csrf").value;

    if(!domoID){
        helper.handleError("unable to get domo Object");
        return false;
    }

    helper.sendPost(e.target.action, {domoID,_csrf}, loadDomosFromServer);
    return false;
}

const handleDeleteDomo = (e) =>{
    e.preventDefault();
    helper.hideError();

    const domoID = e.target.querySelector("#domoId").value;
    const _csrf = e.target.querySelector("#_csrf").value;

    if(!domoID){
        helper.handleError("unable to get domo Object");
        return false;
    }

    helper.sendPost(e.target.action, {domoID,_csrf}, loadDomosFromServer);
    return false;
}

const DomoForm = (props) =>{
    return (
        <form id="domoForm"
            name="loginForm"
            onSubmit={handleDomo}
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />

            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" name="age" min="0"/>

            <label htmlFor="level">Level: </label>
            <input id="domoLevel" type="number" name="level" min="0" max="100"/>

            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className='makeDomoSubmit' type="submit" value="Make Domo" />
        </form>
    );
}

const DomoList = (props) => {
    if(props.domos.length === 0){
        return(
            <div className='domoList'>
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        )
    }

    const domoNodes = props.domos.map(domo =>{
        return(
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
                <h3 className="domoName"> Name: {domo.name} </h3>
                <h3 className="domoAge"> Age: {domo.age} </h3>
                <h3 className="domoLevel" > Level: {domo.level} </h3>
                <form 
                id="levelForm" 
                name="levelForm"
                onSubmit={handleUpdateDomo}
                action="/levelUp"
                method='POST'
                className='levelForm'
                >
                    <input id="_csrf" type="hidden" name="_csrf" value={csrfToken} />
                    <input id="domoId" type="hidden" name="domoId" value={domo._id} />
                    <input className='levelUpSubmit' type="submit" value="Level Up Domo" />
                </form>

                <form 
                id="deleteForm" 
                name="deleteForm"
                onSubmit={handleDeleteDomo}
                action="/delete"
                method='POST'
                className='deleteForm'
                >
                    <input id="_csrf" type="hidden" name="_csrf" value={csrfToken} />
                    <input id="domoId" type="hidden" name="domoId" value={domo._id} />
                    <input className='deleteSubmit' type="submit" value="Delete Domo" />
                </form>
            </div>
        )
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
}

const loadDomosFromServer = async () => {
    const response = await fetch('/getDomos');
    const data = await response.json();

    ReactDOM.render(
        <DomoList domos={data.domos} />,
        document.querySelector("#domos")
    );
}

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();
    csrfToken = data.csrfToken;
    ReactDOM.render(
        <DomoForm csrf={data.csrfToken} />,
        document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoList csrf={data.csrfToken} domos={[]} />,
        document.querySelector("#domos")
    )

    loadDomosFromServer();
}

window.onload = init;