document.addEventListener('DOMContentLoaded', function() {

    //Add event listeners for navigation pane buttons
    document.querySelector('#profile_view').addEventListener('click', () => load_view('profile'));
    document.querySelector('#calendar_view').addEventListener('click', () => load_view('calendar'));
    document.querySelector('#chores_view').addEventListener('click', () => load_view('chores'));
    document.querySelector('#chat_view').addEventListener('click', () => load_view('chat'));
    document.querySelector('#sync_feature').addEventListener('click', () => sync_calendar());

    //Load the calendar view by default
    load_view('calendar');

});

function load_view(view){
    //Hide all content-areas. Then, using if block, display the one we need
    document.querySelectorAll("[data-content]").style.display='none';

    if (view == 'profile'){
        document.querySelector("[data-content='profile']").style.display = 'block';
    } elseif (view == 'calendar'){
        document.querySelector("[data-content='calendar']").style.display = 'block';
    } elseif (view == 'chores'){
        document.querySelector("[data-content='chores']").style.display = 'block';
    } elseif (view == 'chat'){
        document.querySelector("[data-content='chat']").style.display = 'block';
    }
}
