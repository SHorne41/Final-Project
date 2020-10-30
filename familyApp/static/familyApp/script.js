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

        //Make the elements in the form visible
        let messageForm = document.querySelector("#messageDiv");
        messageForm.style = "display: inline-block";

        //messageForm (submits messageArea data to server)
        /*let messageForm = document.createElement('form');
        messageForm.method = "POST";
        messageForm.action = "/sendMessage"
        messageForm.id = "form1";*/

        //Get a csrf_token for the newly generated form
        /*document.getElementsByTagName("body")[0].onload = function (){
            generate_csrf_token("form1");
        };*/

        //typingArea; where the user types their messages (used as 'content' for messageForm)
        /*let typingArea = document.createElement('textArea');
        typingArea.id = "id_content";
        typingArea.name = "content";
        typingArea.placeholder = "Say something..."
        typingArea.cols = '125';
        typingArea.rows = '8';

        //sendButton; used to submit the data from typingArea to the server
        let sendButton = document.createElement('button');
        sendButton.type = "submit";
        sendButton.innerHTML = "Send";*/

        //messageArea ("col div"; where the messages will be typed)


        //sendArea ("col div"; where the 'Send' button will be located)

        /*
        Append items to corresponding containers
        */
        //Chat elements
        chatArea.appendChild(chatMessage);
        chatContainer.appendChild(chatArea);

        //messageForm elements

        //Message elements
        messageContainer.appendChild(messageForm);

        //chatDiv elements
        chatDiv.appendChild(chatContainer);
        chatDiv.appendChild(messageContainer);

    }

    /*function generate_csrf_token(formID){
        console.log(document.querySelector("#csrf-token input").value);
        try{
            var csrfValue = document.querySelector("#csrf-token input").value;
        }
        catch(err) {}

        if (csrfValue == undefined){
            try {
                var csrfValue = Cookies.get('csrftoken');
            }
            catch(err){
                console.log("Add {% csrf_token %} in template or use JS cookie library")
                return;
            }
        }

        var csrfToken = document.createElement("input");
        csrfToken.setAttribute("type", "hidden");
        csrfToken.name = "csrfmiddlewaretoken";
        csrfToken.value = csrfValue;

        messageForm.appendChild(csrfToken);
        console.log(messageForm);
    }*/
}
