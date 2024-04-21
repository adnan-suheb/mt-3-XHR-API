
let cl = console.log;

const postContainer = document.getElementById("postContainer");
const postForm = document.getElementById("postForm");
const titleControl = document.getElementById("title");
const bodyControl = document.getElementById("body");
const userIdControl = document.getElementById("userId");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const formRow = document.getElementById("formRow");
const loader = document.getElementById("loader");


const baseUrl = `https://jsonplaceholder.typicode.com/`;
const postUrl = `${baseUrl}/posts`;
const snacBarMsg = (title, icon, timer) => {
    swal.fire({
        title: title,
        icon: icon,
        timer: timer
    })
}

const submitUpdateToggle = () => {
    submitBtn.classList.toggle("d-none");
    updateBtn.classList.toggle("d-none");
}

const makeApiCall = (methodName, apiUrl, msgBody) => {
    let xhr = new XMLHttpRequest();
    xhr.open(methodName, apiUrl);
    xhr.send(JSON.stringify(msgBody));
    xhr.onload = function () {
        let res = JSON.parse(xhr.response);
        cl(res);
        if (methodName === "GET") {
            if (Array.isArray(res)) {
                // if response is array then templating
                templating(res.reverse());
            }
            else {
                setTimeout(() => {
                    // if response is single object then patch data
                    cl(res);
                    titleControl.value = res.title;
                    bodyControl.value = res.body;
                    userIdControl.value = res.userId;
                    submitUpdateToggle();
                    loader.classList.add("d-none");
                    document.getElementById("formRow").scrollIntoView();
                }, 1000);
            }
        } else if (methodName === "POST") {
            setTimeout(() => {
                // cl(res);
                // cl(msgBody)
                let card = document.createElement("div");
                card.className = "card mt-4";
                card.id = res.id;
                // cl(card)
                card.innerHTML = `<div class="card-header"><h3 class="mb-0">${msgBody.title}</h3></div>
                                <div class="card-body"><h3 class="mb-0">${msgBody.body}</h3></div>
                                <div class="card-footer">
                                    <button class="btn btn-outline-primary" onclick="onEdit(this)">Edit</button>
                                    <button class="btn btn-outline-danger float-right" onclick="onDelete(this)">Delete</button>
                                </div>`;
                postContainer.prepend(card);
                postForm.reset();
                loader.classList.add("d-none");
                snacBarMsg("New post created successfully!!!", "success", 2000);
            }, 2000);
        }
        else if (methodName === "PATCH") {
            setTimeout(() => {
                cl(res)
                cl(msgBody)
                let card = [...document.getElementById(res.id).children];
                // cl(card)
                card[0].innerHTML = `<h3 class="mb-0">${msgBody.title}</h3>`;
                card[1].innerHTML = `<h3 class="mb-0">${msgBody.body}</h3>`;
                postForm.reset();
                submitUpdateToggle();
                loader.classList.add("d-none");
                document.getElementById(res.id).scrollIntoView();
                snacBarMsg("Post updated successfully!!!", "success", 2000);

            }, 2000);
        } else if (methodName === "DELETE") {
            let id = localStorage.getItem("deleteId");
            document.getElementById(id).remove();
            loader.classList.add("d-none");
            snacBarMsg("Post deleted successfully!!", "success", 2000)
        }
    }
}
makeApiCall("GET", postUrl)

const templating = (arr) => {
    postContainer.innerHTML = arr.map(ele => {
        return `<div class="card mt-4" id="${ele.id}">
                    <div class="card-header"><h3 class="mb-0">${ele.title}</h3></div>
                    <div class="card-body"><h3 class="mb-0">${ele.body}</h3></div>
                    <div class="card-footer">
                        <button class="btn btn-outline-primary" onclick="onEdit(this)">Edit</button>
                        <button class="btn btn-outline-danger float-right" onclick="onDelete(this)">Delete</button>
                    </div>
                </div>`
    }).join('')
}

const onEdit = (ele) => {
    let editId = ele.closest(".card").id;
    localStorage.setItem("editId", editId);
    let editUrl = `${baseUrl}/posts/${editId}`;
    loader.classList.remove("d-none");
    makeApiCall("GET", editUrl);
}
const onUpdateBtn = () => {
    let updateId = localStorage.getItem("editId");
    let updateUrl = `${baseUrl}/posts/${updateId}`;
    let updateObj = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value
    };
    loader.classList.remove("d-none");
    makeApiCall("PATCH", updateUrl, updateObj);
}

const onDelete = (ele) => {
    let deleteId = ele.closest(".card").id;
    localStorage.setItem("deleteId", deleteId);
    let deleteUrl = `${baseUrl}/posts/${deleteId}`;
    Swal.fire({
        title: "Are you sure, You want to delete this Post?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        
        if (result.isConfirmed) {
            loader.classList.remove("d-none");
            makeApiCall("DELETE", deleteUrl);
        }        
    });
    loader.classList.add("d-none");

}


const onpostFormSubmit = (eve) => {
    eve.preventDefault();
    let newPost = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value
        // missing id will get form api call
    }
    cl(newPost);
    loader.classList.remove("d-none");
    makeApiCall("POST", postUrl, newPost);
}


postForm.addEventListener("submit", onpostFormSubmit);
updateBtn.addEventListener("click", onUpdateBtn);







