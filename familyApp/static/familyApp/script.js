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
        //Create any and all elements to be displayed and append them to the container
        let success = document.createElement('p');
        success.innerHTML = "Here's where all the chores will be displayed.";
        choresDiv.appendChild(success);

    } else if (view === 'chat'){
        //Select the chat container, set its display, and erase any previous content
        let chatDiv = document.querySelector("[data-content='chat']")
        chatDiv.style.display = 'block';
        chatDiv.innerHTML = '';

        //Create any and all elements to be displayed, then append them to the container

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

        //Messages to be displayed in the chatArea
        let chatMessage = document.createElement('p');
        chatMessage.innerHTML = "All the messages";

        //messageContainer ("row div"; seperates message container from chat container)
        let messageContainer = document.createElement('div');
        messageContainer.className = "row h-25";
        messageContainer.id = "messageContainer";

        //messageArea ("col div"; where the messages will be typed)
        let message = document.createElement('p');
        message.innerHTML = "Where all the messages will be typed";

        //sendArea ("col div"; where the 'Send' button will be located)

        /*
        Append items to corresponding containers
        */
        //Chat elements
        chatArea.appendChild(chatMessage);
        chatContainer.appendChild(chatArea);

        //Message elements
        messageContainer.appendChild(message);

        //chatDiv elements
        chatDiv.appendChild(chatContainer);
        chatDiv.appendChild(messageContainer);
 
    }
}
