
//helper function used to used to tell the user that their is a error or message that needs to be communicated
const handleJsonMessage = (message) =>{
    document.getElementById('jsonMessage').textContent = message;
}
const handleJsonMessageUp = (message) =>{
    document.getElementById('jsonMessageUpdate').textContent = message;
}
const updateUploadFile = async (e,handler) => {
    e.preventDefault();
    
    const response = await fetch(e.target.action,{
        method: 'POST',
        body: new FormData(e.target),
    });

    const result = await response.json();

    if (result.error) {
        handleJsonMessageUp(result.error);
    }

    if(handler){
        handler(result);
    }
    return false;
};

const uploadFile = async (e,handler) => {
    e.preventDefault();
    
    const response = await fetch(e.target.action,{
        method: 'POST',
        body: new FormData(e.target),
    });

    const result = await response.json();

    if (result.error) {
        handleJsonMessage(result.error);
    }

    if(handler){
        handler(result);
    }
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

    if (result.error) {
        handleJsonMessage(result.error);
    }

    if (result.redirect) {
        window.location = result.redirect;
    }

    if(handler){
        handler(result);
    }
};

const sendSub = async (url,data,handler) =>{

    console.log("Entered send sub");
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    console.log("exit send sub");

    const result = await response.json();

    if(handler){
        handler(result);
    }
    return false;
}

module.exports = {
    sendPost,
    uploadFile,
    sendSub,
    handleJsonMessage,
    updateUploadFile,
    handleJsonMessageUp,
}