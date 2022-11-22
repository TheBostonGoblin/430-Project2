// const socket = io();

// const handleSocket = () =>{

// }
const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('domoMessage').classList.remove('hidden');
};


const uploadFile = async (e,handler) => {
    e.preventDefault();

    // dishName : dishName,
    //     nutri: nutri,
    //     ingre: ingre,
    //     likes: likes,
    //     likedBy: likedBy,
    //     hasLiked: hasLiked,
    //     csrf: _csrf

    const response = await fetch(e.target.action,{
        method: 'POST',
        body: new FormData(e.target),
    });

    const result = await response.json();

    if(handler){
        handler(result);
    }
    console.log(result);
    return false;
};

const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    document.getElementById('domoMessage').classList.add('hidden');

    if (result.error) {
        handleError(result.error);
    }

    if (result.redirect) {
        window.location = result.redirect;
    }

    if(handler){
        handler(result);
    }
};

const hideError = () =>{
    document.querySelector("#domoMessage").classList.add('hidden');
}
module.exports = {
    handleError,
    sendPost,
    hideError,
    uploadFile
}