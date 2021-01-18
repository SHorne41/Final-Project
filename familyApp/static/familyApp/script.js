document.addEventListener('DOMContentLoaded', function() {

    //Add event listeners for buttons in navigation menu
    document.querySelector('#profile_tab').addEventListener('click', () => load_view('profile'));
    document.querySelector('#calendar_view').addEventListener('click', () => load_view('calendar'));
    document.querySelector('#chores_view').addEventListener('click', () => load_view('chores'));
    document.querySelector('#chat_view').addEventListener('click', () => load_view('chat'));
    document.querySelector('#sync_feature').addEventListener('click', () => sync_calendar());

    //Load the calendar view by default
    load_view('calendar');

});

//When the user creates a new list in the chores pane; create a TodoList instance on the server
function create_list(){
    //Retrieve list title from the modal, send to server to create new list object
    let title = document.getElementById("newListForm").elements["Title"].value;

    //Make API call to attempt to create list
    fetch("/createList", {
        method: "POST",
        body: JSON.stringify({
            name: title,
        })
    })
    .then(response => response.json().then(data => ({status: response.status, body: data})))
    .then(result =>{
        //If there was already a list with the name supplied in this request, generate error
        if (result["status"] == 409){
            alert("A list with that title has already been created. Please select a new title and try again");
            //Remove modal from the screen; quit the function
            $("#addListModal").modal('toggle');
            return;
        }
        //If the server created the list, however, assign the title of the new list to 'lists' so a sticky note can be created
        else if (result["status"] == 201){
            //Remove modal from the screen; create the sticky note
            $("#addListModal").modal('toggle');

            let lists = [];
            let newList = {};
            newList['name'] = title;
            lists.push(newList);
            generate_sticky(lists);
        }
    });
}

//When the user creates a new chore on one of their lists, create an instance of the chore on the server
function create_item(){
    //Retrieve list title from the modal, send to server to create new list object
    let title = document.getElementById("newItemForm").elements["Title"].value;
}

function createModal (modalName, formName, formFunction){

	//Use argument to create names
	let modalLabelName = modalName + "Label";
	let formReturnFunction = "return " + formFunction;

	//Containing div
	let modal = document.createElement('div');
	modal.classList.add("modal", "fade");
	modal.id = modalName;
	modal.setAttribute("tableindex", "-1");
	modal.setAttribute("role", "dialog");
	modal.setAttribute("aria-labelledby", modalLabelName);
	modal.setAttribute("aria-hidden", "true");

	//Inner Div (dialog)
	let modalDialog = document.createElement('div');
	modalDialog.classList.add("modal-dialog");
	modalDialog.setAttribute("role", "document");

	//Inner Div (content)
	let modalContent = document.createElement('div');
	modalContent.classList.add("modal-content");

	//Inner-most div (header)
	let modalHeader = document.createElement('div');
	modalHeader.classList.add("modal-header");

	//Header content
	let modalTitle = document.createElement("h5");
	modalTitle.classList.add("modal-title");
	modalTitle.id = modalLabelName;
	modalTitle.innerHTML = "Create a New List";
	//Header close button
	let modalClose = document.createElement("button");
	modalClose.classList.add("close");
	modalClose.setAttribute("data-dismiss", "modal");
	modalClose.setAttribute("aria-label", "Close");
	//Header span
	let modalCloseSpan = document.createElement("span");
	modalCloseSpan.setAttribute("aria-hidden", "true");
	modalCloseSpan.innerHTML = "&times;";

	//Body content
	let modalBody = document.createElement("div");

	let newForm = document.createElement("form");
	newForm.id = formName;
	newForm.setAttribute("onsubmit", formReturnFunction);
	//function to stop page from reloading when the form is submitted
	function handleForm(event) {event.preventDefault();}
	newForm.addEventListener('submit', handleForm);

	let title = document.createElement("input");
	title.setAttribute("type", "text");
	title.required = true;
	title.placeholder = "Insert Title Here...";
	title.name = "Title";

	let createButton = document.createElement("button");
	createButton.setAttribute("type", "submit");
	createButton.setAttribute("form", formName);
	createButton.classList.add("btn", "btn-primary");
	createButton.innerHTML = "Create";

	//Append all elements to their appropriate containers
    newForm.appendChild(title);
    newForm.appendChild(createButton);
    modalBody.appendChild(newForm);

    modalHeader.appendChild(modalTitle);
    modalClose.appendChild(modalCloseSpan);
    modalHeader.appendChild(modalClose);

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);

    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);

    return modal;

}

function generate_sticky(lists){
    //Create the sticky notes; append to the choresDiv
    let listContainer = document.querySelector("#listContainer");

    for (i = 0; i < lists.length; i ++){

        //Create items that make up sticky note
         let newSticky = document.createElement("div");
         let stickyHeader = document.createElement("div");
         let stickyTitle = document.createElement("h3");
         let stickyContent = document.createElement("div");
         let stickyList = document.createElement("ul");
         let addItemButton = document.createElement("button");

         //Create modal to be used to add item to the list
         let addItemModal = createModal("addItemModal", "newItemForm", "create_item()");

         //Add properties to newly created items
         newSticky.classList.add("stickyNotes");
         stickyHeader.classList.add("stickyHeader");
         stickyTitle.innerHTML = lists[i].name;

         addItemButton.innerHTML = "+";
         addItemButton.classList.add("btn");
         addItemButton.classList.add ("modalAddButton");
         addItemButton.setAttribute("data-toggle", "modal");
         addItemButton.setAttribute("data-target", "#addItemModal");

         //Append title/add item buttons to header
         stickyHeader.appendChild(stickyTitle);
         stickyHeader.appendChild(addItemButton);
         stickyHeader.appendChild(addItemModal);

         //Append list (even if empty) to stickyContent
         stickyContent.appendChild(stickyList);

         //Append header/content to sticky note
         newSticky.appendChild(stickyHeader);
         newSticky.appendChild(stickyContent);

         //Append sticky note to the Notes container
         listContainer.appendChild(newSticky);
    }
}

/*
    Used when the user navigates to the chores pane. Retrieves all of their to-do lists, then calls on generate_sticky() to diplay lists
*/
function retrieve_lists(){
    fetch("/getLists", {
        method: "GET"
    })
    .then(response => response.json())
    .then(lists => {
        generate_sticky(lists);
    });
}

function retrieve_messages(scroll){

    /*Extract the number of messages currently displayed on the user's screen
    Will be used as the "mostRecentID" server-side when extracting the next batch of messages*/
    let messageCount = document.querySelector("#allMessages").childElementCount;

    fetch("/getMessages", {
        method: "POST",
        body: JSON.stringify({
            messageCount: messageCount,
        })
    })
    .then(response => response.json().then(data => ({status: response.status, body: data})))
    .then(messages => {

        //Check to see if there are any messages left to display
        if (messages["status"] == 201){     //There are messages returned from the fetch call
            //Only clear the content if the user is navigating to the chat from another window
            console.log(messages["status"]);
            if (!scroll){
                //Clear any content that may have been there previously
                let chatArea = document.querySelector("#allMessages");
                chatArea.innerHTML = '';
            }

            //Call on the create_bubble method to create the message bubbles
            create_bubble(messages["body"], scroll);
        }
    });
}

function create_bubble(messages, scroll){

    let chatArea = document.querySelector("#allMessages");
    let user_id = JSON.parse(document.getElementById("user_id").textContent);
    let scrollMessages = [];

    for (let i = 0; i < messages.length; i ++){
        //Create divs for each message to be displayed in
        let bubble = document.createElement('div');
        bubble.classList.add("messageBubble");
        let content = document.createElement('p');
        let messageHeader = document.createElement('h5');

        //Determine position of bubble based on sender
        if (user_id === messages[i].sender_id){
            bubble.classList.add("rightBubble");
        } else {
            bubble.classList.add("leftBubble");
        }

        //Populate elements
        content.innerHTML = messages[i].content;
        messageHeader.innerHTML = messages[i].timestamp + " " + messages[i].sender + " says: ";
        bubble.appendChild(messageHeader);
        bubble.appendChild(content);

        //If the user scroll to the top, add to the array
        if (scroll){
            scrollMessages[i] = bubble;
        //Otherwise, append it to the bottom
        } else {
            //Append bubble to chatDiv
            chatArea.appendChild(bubble);
            //Show messages from the bottom (newest) first. Scroll up to see older messages.
            chatArea.scrollTop = chatArea.scrollHeight;
        }
    }

    //Required, otherwise insertBefore will have the messages in reverse order
    if (scroll){
        let previousScrollHeight = chatArea.scrollHeight;
        for (let i = scrollMessages.length - 1; i > 0; i --){
            chatArea.insertBefore(scrollMessages[i], chatArea.firstChild);
        }
        chatArea.scrollTop = chatArea.scrollHeight - previousScrollHeight;     //Stops scrollbar from jumping to the top once the messages have been appended
    }
}

function send_message(){
    //Create a new Form element and append the content of the typingArea
    let messageData = new FormData ();
    let content = document.querySelector("#typingArea").value;
    messageData.append('content', content);

    //Pass the form to the server
    fetch('/send', {
        method: "POST",
        body: messageData,
    })
    .then(response => response.json())
    .then(result => {
        create_bubble(result, false);
        let typingArea = document.querySelector("#typingArea");
        typingArea.value = "";
    });
}

function load_view(view){
    //Hide all content-areas. Then, using if block, display the one we need
    let divs = document.querySelectorAll("[data-content]");
    for (i = 0; i < divs.length; i ++){
        divs[i].style.display = 'none';
    }

    if (view === 'profile') {
        let profileDiv = document.querySelector("[data-content='profile']")
        profileDiv.style.display = 'block';
        profileDiv.innerHTML = '';
        let success = document.createElement('p');
        success.innerHTML = "Viewing the profile page.";
        profileDiv.appendChild(success);

    } else if (view === 'calendar'){
        let calendarDiv = document.querySelector("[data-content='calendar']")
        calendarDiv.style.display = 'block';
        calendarDiv.innerHTML = '';
        let success = document.createElement('p');
        success.innerHTML = "Currently viewing the calendar.";
        calendarDiv.appendChild(success);

    } else if (view === 'chores'){
        //Select the chores container, set its display, and erase any previous content
        let choresDiv = document.querySelector("[data-content='chores']")
        choresDiv.style.display = 'block';
        choresDiv.innerHTML = '';

        /*
        Create any and all elements to be displayed and append them to the container
        */

        //Create the containers for the choresDiv
        let listContainer = document.createElement('div');
        listContainer.style.display = 'grid';
        listContainer.id = "listContainer";

        //Create the Menu bar for the chores pane
        let choresMenu = document.createElement('div');
        choresMenu.id = "choresMenu";

        let menuTitle = document.createElement('h1');
        menuTitle.innerHTML = "To Do Lists";
        menuTitle.id = "menuTitle";

        choresMenu.appendChild(menuTitle);

        let addListModal = createModal("addListModal", "newListForm", "create_list()");

        //Create the "Add list" button
        let addListButton = document.createElement('button');
        addListButton.innerHTML = "Add New List";
        addListButton.classList.add("btn");
        addListButton.classList.add("modalAddButton");
        addListButton.setAttribute("data-toggle", "modal");
        addListButton.setAttribute("data-target", "#addListModal");

        choresMenu.appendChild(addListButton);
        choresMenu.appendChild(addListModal);

        choresDiv.appendChild(choresMenu);
        choresDiv.appendChild(listContainer);

        retrieve_lists();

    } else if (view === 'chat'){
        //Select the chat container, set its display, and erase any previous content
        let chatDiv = document.querySelector("[data-content='chat']")
        chatDiv.style.display = 'block';
        chatDiv.innerHTML = '';

        /*
        Create any and all elements to be displayed, then append them to the container
        */
        //chatContainer ("row div"; seperates chat container from message container)
        let chatContainer = document.createElement('div');
        chatContainer.className = "row h-75";
        chatContainer.id="chatContainer";

        //chatArea ("col div"; contains all chat elements)
        let chatArea = document.createElement('div');
        chatArea.class = "col-8";
        chatArea.id = "allMessages";

        //messageContainer ("row div"; seperates message container from chat container)
        let messageContainer = document.createElement('div');
        messageContainer.className = "row h-25";
        messageContainer.id = "messageContainer";

        //messageArea ("col div"; where the messages will be typed)
        let typingArea = document.createElement('textArea');
        typingArea.id = "typingArea";
        typingArea.placeholder = "Say something..."
        typingArea.cols = '100';
        typingArea.rows = '5';

        //sendArea ("col div"; where the 'Send' button will be located)
        let sendButton = document.createElement('input');
        sendButton.type = "button";
        sendButton.value = "Send";
        sendButton.id = "sendButton";
        sendButton.addEventListener('click', () => send_message());


        /*
        Append items to corresponding containers
        */
        //Chat elements
        chatContainer.appendChild(chatArea);

        //Message elements
        messageContainer.appendChild(typingArea);
        messageContainer.appendChild(sendButton);

        //chatDiv elements
        chatDiv.appendChild(chatContainer);
        chatDiv.appendChild(messageContainer);
        retrieve_messages(false);

        //Infinite scroll

        chatArea.onscroll = function(){
            if (chatArea.scrollTop == 0){
                retrieve_messages(true);
            }
        };
    }
}
