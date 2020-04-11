$("#homePage").hide()
$("#inboxPage").hide()
$("#profilePage").hide()
$("#friends").hide()
$("#explorePeople").hide()
var socket = io('http://localhost:8089/');

let markUps = {

    createCard: (img, status, name, postId, likes) => {
        let card = `
        <div class="homeCard">
        <div class="card" style="width: 49rem;">
        <img src="${img}" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${name}</h5>
            <p class="card-text">${status}.</p>
        </div>
        <div class="card-body">
        <button class="btn btn-secondary likeBtn" onclick="like(event)" value="${postId}" >${likes.length} Like</button>
        </div>
        <ul class="list-group list-group-flush commentBox"  id="${postId}">
            <li class="list-group-item"><b>Comments</b> </li>
        </ul>
        </div>
        <div class="input-group mb-3 commentInputBox" style="width: 49rem;" >
        <input type="text" class="form-control commentInput" placeholder="Write your comment here" >
        <div class="input-group-append">
            <button class="btn btn-outline-secondary commentBtn" id="cmt" onclick="comment(event)"  type="button" value="${postId}">Comment</button>
        </div>
        </div>
        </div>
        `
        return card
    },
    inbox: (friendName, friendId, friendDp) => {
        let friendInbox = `
        <div class="inboxCard">
            <div class="row ">
                <div class="col-sm mt-5">
                    <div class="card mb-3" style="max-width: 540px;min-height: 350px;">
                        <div class="row no-gutters">
                            <div class="col-md-4">
                                <img src="${friendDp}" class="card-img" alt="">
                            </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${friendName}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm mt-5">
                <div class="card mb-3 chat-messages" id="${friendName}" style="max-width: 540px;height: 300px;overflow: auto;">
                </div>
                <div class="input-group mb-3">
                <input type="text" class="form-control messageInput" placeholder="Enter your message here">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" onclick="sendMessage(event)" value="${friendId}">Send</button>
                </div>
            </div>
            </div>
        </div>
    </div>
        `
        return friendInbox
    },
    profile: (name, dp, city, email) => {
        let profile = `
        <div class="profileCard">
        <div class="card mb-3" style="max-width: 600px;min-height: 350px;" >
        <img src="${dp}" class="card-img-top" alt="">
        <div class="input-group">
        <div class="custom-file">
          <input type="file" name="fileName" class="custom-file-input " id="helios" >
          <label class="custom-file-label" for="inputGroupFile04">Its time to change your profile picture !</label>
        </div>
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" onclick="changeDp(event)"  type="button">Upload</button>
        </div>
      </div>
        <div class="card-body">
        <h5 class="card-title">${name} 
        </h5>
        <h5 class="card-title">Bio - I am a developer</h5>
        <p class="card-text">City - ${city}</p>
        <p class="card-text">Email - ${email}</p>
        </div>
        </div>
        </div>
        `
        return profile
    },
    friends: (dp, name, city) => {
        let friendProfile = `
        <div class="friendsCard">
        <div class="col mb-4">
        <div class="card h-100">
            <img src="${dp}" class="card-img-top" alt="">
            <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <p class="card-text">City : ${city}</p>
            </div>
        </div>
        </div>
        </div>
        `
        return friendProfile
    },
    explorePeople: (dp, name, city, relation, id) => {
        let people = `
        <div class="peopleCard">
        <div class="col mb-4">
        <div class="card">
            <img src="${dp}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <p class="card-text">City : ${city}</p>
                <button type="button" class="btn btn-info" onclick="request(event)" value="${id}">${relation}</button>
            </div>
        </div>
        </div>
        </div>
        `
        return people
    }
}

$('.registerSubmit').on('click', async (e) => {
    e.preventDefault()
    let name = $('#registerName').val()
    let email = $('#registerEmail').val()
    let password = $('#registerPassword').val()
    let city = $('#registerCity').val()
    let dob = $('#registerDob').val()
    console.log(name, email, password, city, dob)
    let user = await fetch('http://127.0.0.1:8089/register', {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            city: city,
            dob: dob
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    user = await user.json()
    console.log(user)
    alert("You have been registered successfully, Please confirm your email to login .")
});

$(`.loginForm`).on("submit", async (e) => {
    e.preventDefault()
    let email = $('#loginEmail').val()
    let password = $('#loginPassword').val()
    let user = await fetch('http://127.0.0.1:8089/login', {
        method: 'POST',
        body: JSON.stringify({
            email: email,
            password: password
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    user = await user.json()
    console.log(user)
    if (user.message == "Invalid Credentials") {
        alert("Incorrect Credentials !!!");
        window.location.hash = ""
    }
    // else if(user.message == undefined){
    //     alert("Confirm your email !!!");
    //     window.location.hash = ""
    // }
    else {
        window.location.hash = "#homePage"
        window.localStorage.setItem("token", user.token);
        window.localStorage.setItem("id", user._id);
        window.localStorage.setItem("user", JSON.stringify(user));
        let posts = await fetch('http://127.0.0.1:8089/getAllPosts', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${window.localStorage.token}`
            }
        })
        posts = await posts.json()
        console.log(posts)
        if (posts.length > 0) {
            let postBox = $(".postBox");
            $(".homeCard").remove()
            posts.forEach(post => {
                postBox.append(markUps.createCard(post.imgPath, post.status, post.user.name, post._id, post.likes))
                let comments = post.comments;
                comments.forEach((comment) => {
                    if (comment.user._id === user._id) {
                        $(`#${post._id}`).append(`<li class="list-group-item" id="${comment.user.name}"><strong>${comment.user.name}</strong>  ${comment.comment}
                        <div class="btn-group" role="group" aria-label="Basic example" style="float: right;">
                        <button type="button"  onclick="editComment(event)" class="btn btn-secondary" value="${comment._id}">Edit Comment</button>
                        <button type="button"  onclick="deleteComment(event)" class="btn btn-secondary" value="${comment._id}">Delete Comment</button>
                        </div> 
                        </li>`)
                    } else {
                        $(`#${post._id}`).append(`<li class="list-group-item"><strong>${comment.user.name}</strong>  ${comment.comment}</li>`)
                    }
                })
            })
        }
    }
    socket.emit("userJoin", { userId: user._id, socketId: socket.id })

})

$(".inbox").on("click", async (e) => {
    e.preventDefault()
    window.location.hash = "#inbox";
    let messages = await fetch('http://127.0.0.1:8089/getInbox', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${window.localStorage.token}`
        }
    })
    let inboxResponse = await messages.json()
    console.log(inboxResponse.length)
    console.log(inboxResponse)
    $(".inboxCard").remove()
    let inboxBox = $(".inboxBox")
    if (inboxResponse.length == 0) {
        console.log("helo")
        let user = JSON.parse(window.localStorage.user)
        user.friends.forEach(friend => {
            inboxBox.append(markUps.inbox(friend.name, friend._id, friend.profilePicture))
        })
    }
    else {
        inboxResponse.forEach(inbox => {
            inboxBox.append(markUps.inbox(inbox.friend.name, inbox.friend._id, inbox.friend.profilePicture))
            let convo = inbox.conversation;
            convo.forEach((conversation) => {
                document.getElementById(`${inbox.friend.name}`).insertAdjacentHTML("beforeend", `<p><b>${conversation.name}</b> ${conversation.message} <em>${conversation.time}</em></p>`)
            })
        })
    }
})

$(".myProfile").on("click", (e) => {
    e.preventDefault();
    window.location.hash = "#profile"
    let user = JSON.parse(window.localStorage.user)
    console.log(user)
    $(".profileCard").remove()
    $(".profileBox").append(markUps.profile(user.name, user.profilePicture, user.city, user.email))
})


$(".friends").on("click", (e) => {
    e.preventDefault();
    window.location.hash = "#friends"
    let user = JSON.parse(window.localStorage.user)
    let userFriends = user.friends;
    $(".friendsCard").remove()
    userFriends.forEach(friend => {
        $(".friendsBox").append(markUps.friends(friend.profilePicture, friend.name, friend.city))
    })
})

$(".explorePeople").on("click", async (e) => {
    e.preventDefault();
    window.location.hash = "#explorePeople";
    let users = await fetch('http://127.0.0.1:8089/getAllUsers', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${window.localStorage.token}`
        }
    })
    users = await users.json();
    $(".peopleCard").remove()
    users.forEach(user => {
        let sentCheck = () => {
            let final = null
            user.sentRequests.forEach((req) => {
                if (req._id === window.localStorage.id) {
                    final = true
                }
                else {
                    final = false
                }
            })
            return final
        }

        let receivedCheck = () => {
            let final = null
            user.receivedRequests.forEach((req) => {
                if (req._id === window.localStorage.id) {
                    final = true
                }
                else {
                    final = false
                }
            })
            return final
        }

        if (user._id == window.localStorage.id) {

        }
        else if (user.friends.includes(window.localStorage.id)) {
            let relation = "Friends"
            $(".userBox").append(markUps.explorePeople(user.profilePicture, user.name, user.city, relation, user._id))
        }
        else if (receivedCheck()) {
            let relation = "Sent"
            $(".userBox").append(markUps.explorePeople(user.profilePicture, user.name, user.city, relation, user._id))
        }
        else if (sentCheck()) {
            let relation = "Accept Request"
            $(".userBox").append(markUps.explorePeople(user.profilePicture, user.name, user.city, relation, user._id))
        }
        else {
            let relation = "Send Request"
            $(".userBox").append(markUps.explorePeople(user.profilePicture, user.name, user.city, relation, user._id))
        }


    })
})

$(".logout").on("click", async (e) => {
    e.preventDefault();
    window.location.hash = "#signUp"
    await fetch('http://127.0.0.1:8089/logout', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${window.localStorage.token}`
        }
    })
})

$(".home").on("click", () => {
    window.location.hash = "#homePage"
})



let like = async (event) => {
    let postId = event.target.value
    let likeResponse = await fetch(`http://127.0.0.1:8089/likeUnlikePost/${postId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${window.localStorage.token}`
        }
    })
    let jsonLikeResponse = await likeResponse.json();
    document.querySelector(".likeBtn").innerHTML = `${jsonLikeResponse.likeLength} Like`
}

let comment = async (event) => {
    let comnt = $(".commentInput").val()
    document.querySelector(".commentInput").value = ""
    if (comnt.length > 0) {
        let postId = event.target.value
        let commentResponse = await fetch(`http://127.0.0.1:8089/createComment/${postId}`, {
            method: 'POST',
            body: JSON.stringify({
                comment: comnt
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${window.localStorage.token}`
            }
        })
        let jsonResponse = await commentResponse.json()
        $(`#${postId}`).append(`<li class="list-group-item " id="${jsonResponse.name}" ><strong>${jsonResponse.name}</strong>  ${jsonResponse.comment.comment}
        <div class="btn-group" role="group" aria-label="Basic example" style="float: right;">
        <button type="button" onclick="editComment(event)" class="btn btn-secondary" value="${jsonResponse.comment._id}">Edit Comment</button>
        <button type="button" onclick="deleteComment(event)" class="btn btn-secondary" value="${jsonResponse.comment._id}">Delete Comment</button>
        </div> 
        </li>
        `)
    }
}

let sendMessage = async (event) => {
    let message = $(".messageInput").val()
    document.querySelector(".messageInput").value = ""
    let mszdiv = event.target.parentNode.parentNode.parentNode.firstElementChild.id
    console.log(mszdiv)
    let friendId = event.target.value
    if (message.length > 0) {
        let messageResponse = await fetch(`http://127.0.0.1:8089/sendMessage/${friendId}`, {
            method: 'POST',
            body: JSON.stringify({
                message
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${window.localStorage.token}`
            }
        })
        let jsonResponse = await messageResponse.json()
        document.getElementById(`${mszdiv}`).insertAdjacentHTML("beforeend", `<p><b>${jsonResponse.name}</b> ${message} <em>${jsonResponse.time}</em></p>`)
        socket.emit("message", {
            friendId: friendId,
            name: jsonResponse.name,
            message: message,
            time: jsonResponse.time
        })
    }
}


let editComment = async (event) => {
    let commentId = event.target.value
    let comment = $(".commentInput").val()
    event.target.parentNode.parentNode.replaceWith("<h2>New heading</h2>")
    let editResponse = await fetch(`http://127.0.0.1:8089/updateComment/${commentId}`, {
        method: 'PUT',
        body: JSON.stringify({
            comment
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${window.localStorage.token}`
        }
    })

}


let deleteComment = async (event) => {
    let commentId = event.target.value
    let comment = $(".commentInput").val()
    event.target.parentNode.parentNode.remove()
    let delResponse = await fetch(`http://127.0.0.1:8089/deleteComment/${commentId}`, {
        method: 'POST',
        body: JSON.stringify({
            comment
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${window.localStorage.token}`
        }
    })
    delResponse = delResponse.json()
    console.log(delResponse)
}

let request = async (event) => {
    let userId = event.target.value;
    let text = event.target.innerHTML;

    if (text == "Send Request") {
        let requestResponse = await fetch(`http://127.0.0.1:8089/sendRequest/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${window.localStorage.token}`
            }
        })
        requestResponse = await requestResponse.json()
        event.target.innerHTML = "Sent"
    }
    if (text == "Accept Request") {
        let requestResponse = await fetch(`http://127.0.0.1:8089/acceptRequest/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${window.localStorage.token}`
            }
        })
        requestResponse = await requestResponse.json()
        console.log(requestResponse)
        event.target.innerHTML = "Friends"
    }
}


let changeDp = async (event) => {
    // let file = document.querySelector("#helios")


    // let formData = new FormData();
    // console.log(formData)
    // formData.append("fileName",file)
    // let imgResponse = await fetch(`http://127.0.0.1:8089/uploadProfilePicture`, {
    //     method: 'POST',
    //     body: {
    //         formData
    //     },
    //     headers: {
    //         'Authorization': `${window.localStorage.token}`
    //     }
    // })
    // imgResponse = await imgResponse.json()
    // console.log(imgResponse)
}

let deactivate = async () => {
    let password = window.prompt("Types 'YES' to delete account !!!");
    if (password == "YES") {
        let response = await fetch(`http://127.0.0.1:8089/deleteAccount`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${window.localStorage.token}`
            }
        })
        response = await response.json();
        window.location.hash = "#signUp"
    }

}



socket.on("sendMessage", (data) => {
    const chatMessages = document.querySelector('.chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
    document.getElementById(`${data.name}`).insertAdjacentHTML("beforeend", `<p><b>${data.name}</b> ${data.message} <em>${data.time}</em></p>`)
})


$(document).ready(function () {
    window.addEventListener("hashchange", (event) => {

        if (location.hash == "#signUp") {
            $("#signUpPage").show()
            $("#homePage").hide()
            $("#inboxPage").hide()
            $("#profilePage").hide()
            $("#friends").hide()
            $("#explorePeople").hide()
        }
        else if (location.hash == "#homePage") {
            $("#signUpPage").hide()
            $("#homePage").show()
            $("#inboxPage").hide()
            $("#profilePage").hide()
            $("#friends").hide()
            $("#explorePeople").hide()

        }
        else if (location.hash == "#inbox") {
            $("#signUpPage").hide()
            $("#homePage").hide()
            $("#inboxPage").show()
            $("#profilePage").hide()
            $("#friends").hide()
            $("#explorePeople").hide()

        }
        else if (location.hash == "#profile") {
            $("#signUpPage").hide()
            $("#homePage").hide()
            $("#inboxPage").hide()
            $("#profilePage").show()
            $("#friends").hide()
            $("#explorePeople").hide()

        }
        else if (location.hash == "#friends") {
            $("#signUpPage").hide()
            $("#homePage").hide()
            $("#inboxPage").hide()
            $("#profilePage").hide()
            $("#friends").show()
            $("#explorePeople").hide()

        }
        else if (location.hash == "#explorePeople") {
            $("#signUpPage").hide()
            $("#homePage").hide()
            $("#inboxPage").hide()
            $("#profilePage").hide()
            $("#friends").hide()
            $("#explorePeople").show()

        }

    })
})

