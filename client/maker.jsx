const helper = require('./helper.js');
let csrfToken;
var socket = io();

//helper function to handle uploading a post or creating a post
const handleUpload = (e) => {
    e.preventDefault();

    helper.uploadFile(e, loadPostsFromServer);
    return false;

}
//helper function for handling post updates in this case just likes
const handlePostUpdate = (e) => {
    e.preventDefault();

    const postID = e.target.querySelector("#postID").value;
    const _csrf = e.target.querySelector("#_csrf").value;

    if (!postID) {
        helper.handleJsonMessage("unable to get post Object");
        return false;
    }

    helper.sendPost(e.target.action, { postID, _csrf }, loadPostsFromServer);
    return false;
}

//handler function for delete post
const handlePostDelete = (e) => {
    e.preventDefault();

    const postID = e.target.querySelector("#postID").value;
    const _csrf = e.target.querySelector("#_csrf").value;

    if (!postID) {
        helper.handleJsonMessage("unable to get post Object");
        return false;
    }

    helper.sendPost(e.target.action, { postID, _csrf }, loadPostsFromServer);
    return false;
}

//form used to create post
const PostForm = (props) => {
    return (
        <div className="box">
            <form id="postForm"
                name="loginForm"
                onSubmit={handleUpload}
                action="/upload"
                method="POST"
                className="postForm"
                encType="multipart/form-data"
            >

                <section className='has-text-centered'>
                    <h1 className='title has-text-weight-bold'>Create Post Here!</h1>
                </section>
                <label className='label' htmlFor="name">Dish Name: </label>
                <input className='input' id="dishName" type="text" name="dishName" placeholder="Dish Name" />

                <label className='label' htmlFor="plus">Nutritional Pluses: </label>
                <input className='input' id="nutriPlus" type="text" name="plus" placeholder="Omega3's,Extra Vitamin C, etc..."/>

                <label className='label' htmlFor="ingre">Dish Ingredients: </label>
                <input className='input' id="dishIngre" type="text" name="ingre" placeholder="Apples,Lamb,Cumin..."/>

                <label className='label' htmlFor="image">Dish Image: </label>
                <input className='input' type="file" name="image" id='image' />

                <input type="hidden" name='likes' value={0} id='likes' />

                <input type="hidden" name='likedBy' id='likedBy' />

                <input type="hidden" name='hasliked' id='hasliked' value={false} />

                <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
                <input className='SubmitPostForm button is-info mt-2' type="submit" value="Make Post" />

                <section id="jsonMessage" className="column is-12 subtitle has-text-centered has-text-danger has-text-weight-bold"></section>
            </form>
        </div>

    );
}

//function used to load all in addition other forms for liking,and deleting post
const PostList = (props) => {
    if (props.posts.length === 0) {
        return (
            <div className='postList columns is-multiline'>
                <h3 className="emptyDomo">No one has posted anything</h3>
            </div>
        )
    }

    const postNodes = props.posts.map(post => {
        const imageSRC = post.image ? `/retrieve?_id=${post.image}` : "/assets/img/recipePlaceholder.png"

        let likedByString = '';

        for(let x = 0 ;x < post.likedBy.length;x++){
            if((x+1) === (post.likedBy.length)){
                likedByString += post.likedBy[x];
            }
            else{
                likedByString += `${post.likedBy[x]},`;
            }
            
        }

        if(likedByString === undefined || likedByString === null || likedByString === ''){
            likedByString = "No likes yet!"
        }

        
        let deleteForm;
        if(props.account.username ===  post.whoCreated){
            deleteForm = <form
                            id="deleteForm"
                            name="deleteForm"
                            onSubmit={handlePostDelete}
                            action="/delete"
                            method='POST'
                            className='deleteForm column is-6'
                        >
                            <input id="_csrf" type="hidden" name="_csrf" value={csrfToken} />
                            <input id="postID" type="hidden" name="postID" value={post._id} />
                            <input className='deleteSubmit button is-danger' type="submit" value="Delete Post" />
                        </form>
        }
        else{

        }

        let likeButton;
        //first checks if the user has liked the post or not than it determines if the user owns the post and wether or not a delete form is also nessary
        if (post.hasLiked) {

            //if the delete form exist than adjust the buttons width accordingly before creating the form
            if(deleteForm){
                likeButton = <form
                id="unlikeForm"
                name="unlikeForm"
                onSubmit={handlePostUpdate}
                action="/unlike"
                method='POST'
                className='unlikeForm column is-6'
            >
                <input id="_csrf" type="hidden" name="_csrf" value={csrfToken} />
                <input id="postID" type="hidden" name="postID" value={post._id} />
                <input id="likeSubmit" className='likeSubmit button is-warning' type="submit" value="UnLike Post" />
            </form>
            }
            else{
                likeButton = <form
                id="unlikeForm"
                name="unlikeForm"
                onSubmit={handlePostUpdate}
                action="/unlike"
                method='POST'
                className='unlikeForm column is-12'
            >
                <input id="_csrf" type="hidden" name="_csrf" value={csrfToken} />
                <input id="postID" type="hidden" name="postID" value={post._id} />
                <input id="likeSubmit" className='likeSubmit button is-warning' type="submit" value="UnLike Post" />
            </form>
            }
            
        }
        else {
            if(deleteForm){
            likeButton = <form
                id="likeForm"
                name="likeForm"
                onSubmit={handlePostUpdate}
                action="/like"
                method='POST'
                className='likeForm column is-6'
            >
                <input id="_csrf" type="hidden" name="_csrf" value={csrfToken} />
                <input id="postID" type="hidden" name="postID" value={post._id} />
                <input id="likeSubmit" className='likeSubmit button is-primary' type="submit" value="Like Post" />
            </form>
            }
            else{
                likeButton = <form
                id="likeForm"
                name="likeForm"
                onSubmit={handlePostUpdate}
                action="/like"
                method='POST'
                className='likeForm column is-12'
            >
                <input id="_csrf" type="hidden" name="_csrf" value={csrfToken} />
                <input id="postID" type="hidden" name="postID" value={post._id} />
                <input id="likeSubmit" className='likeSubmit button is-primary' type="submit" value="Like Post" />
            </form>
            }
        }

        //returns the approprate post depending on the user
        return (
            <div key={post._id} className="post container column is-4 is-info p-0">
                <div  className="card card-equal-height is-info m-2 p-2">

                    <div className='card-image'>
                        <figure className="image is-square">
                            <img src={imageSRC} alt="placeholder pic" className="recipeImage" />
                        </figure>
                    </div>

                    <div className='card-content'>


                        <h3 className="createdBy title has-text-centered"> By:{post.whoCreated} </h3>
                        <h3 className="dishName title has-text-centered"> {post.dishName} </h3>
                        <h3 className="dishNuritPlus subtitle has-text-centered"> Nutritional Plus: {post.nutri} </h3>
                        <h3 className="dishIngredients subtitle has-text-centered"> Ingerdients: {post.ingre} </h3>
                        <h3 className="likes subtitle has-text-centered" > Food Likes: {post.likes} </h3>
                        <h3 className="likedBy subtitle has-text-centered" > Who Liked The Post: {`${likedByString}`} </h3>

                    </div>

                    <div className="columns">

                        {likeButton}
                        {deleteForm}
                    </div>


                </div>
            </div>
        )
    });

    //loads the posts
    return (
        <div className="postList columns is-multiline">
            {postNodes}
        </div>
    );
}

//renders the post from the server
const loadPostsFromServer = async () => {
    const response = await fetch('/getAllPosts');
    const data = await response.json();
    const response2 = await fetch('/getAccount');
    const data2 = await response2.json();

    ReactDOM.render(
        <PostList csrf={data.csrfToken} posts={data.posts} account={data2.account} />,
        document.querySelector("#posts")
    );

}

//intial function. loading into the react code
const init = async () => {

    //fetching data form the server for rendering forms and react components
    const response = await fetch('/getToken');
    const data = await response.json();

    const response2 = await fetch('/getAccount');
    const data2 = await response2.json();
    csrfToken = data.csrfToken;


    ReactDOM.render(
        <PostForm csrf={data.csrfToken}/>,
        document.querySelector("#createPosts")
    );

    ReactDOM.render(
        <PostList csrf={data.csrfToken} posts={[]} account={data2.account}/>,
        document.querySelector("#posts")
    )

    loadPostsFromServer();
}

window.onload = init;