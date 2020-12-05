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

function create_list(){
    //Retrieve list title from the modal, send to server to create new list onbject
    let title = document.getElementById("newListForm").elements["newListTitle"].value;
    console.log(title);
    alert(title);
    $("#addListModal").modal('toggle');
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

        /*
        Create the modal for adding lists
        */
        //Containing div
        let addListModal = document.createElement('div');
        addListModal.classList.add("modal", "fade");
        addListModal.id = "addListModal";
        addListModal.setAttribute("tableindex", "-1");
        addListModal.setAttribute("role", "dialog");
        addListModal.setAttribute("aria-labelledby", "addListModalLabel");
        addListModal.setAttribute("aria-hidden", "true");

        //Inner Div (dialog)
        let addListModalDialog = document.createElement('div');
        addListModalDialog.classList.add("modal-dialog");
        addListModalDialog.setAttribute("role", "document");

        //Inner Div (content)
        let addListModalContent = document.createElement('div');
        addListModalContent.classList.add("modal-content");

        //Inner-most div (header)
        let addListModalHeader = document.createElement('div');
        addListModalHeader.classList.add("modal-header");

        //Header content
        let modalTitle = document.createElement("h5");
        modalTitle.classList.add("modal-title");
        modalTitle.id = "addListModalLabel";
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
        let listForm = document.createElement("form");
        listForm.id = "newListForm";
        listForm.setAttribute("onsubmit", "return create_list()");
        let listTitle = document.createElement("input");
        listTitle.setAttribute("type", "text");
        listTitle.required = true;
        listTitle.placeholder = "Insert Title Here...";
        listTitle.name = "newListTitle";

        let createListButton = document.createElement("button");
        createListButton.setAttribute("type", "submit");
        createListButton.setAttribute("form", "newListForm");
        createListButton.classList.add("btn", "btn-primary");
        createListButton.innerHTML = "Create List";

        //Append all elements to their appropriate containers
        listForm.appendChild(listTitle);
        listForm.appendChild(createListButton);
        modalBody.appendChild(listForm);


        addListModalHeader.appendChild(modalTitle);
        modalClose.appendChild(modalCloseSpan);
        addListModalHeader.appendChild(modalClose);

        addListModalContent.appendChild(addListModalHeader);
        addListModalContent.appendChild(modalBody);

        addListModalDialog.appendChild(addListModalContent);
        addListModal.appendChild(addListModalDialog);

        //Create the "Add list" button
        let addListButton = document.createElement('button');
        addListButton.innerHTML = "+";
        addListButton.classList.add("btn", "btn-link");
        addListButton.setAttribute("data-toggle", "modal");
        addListButton.setAttribute("data-target", "#addListModal");

        choresDiv.appendChild(addListButton);
        choresDiv.appendChild(addListModal);

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
