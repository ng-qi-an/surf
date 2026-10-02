export default function welcomeTexts(){
    const date = new Date();
    const hour = date.getHours();
    let greetings = ["Welcome back!", "Ready to dive in?", "Ahoy there, mate!", "Greetings, adventurer!"];
    if (hour < 12) {
        greetings = [...greetings, ...["Get the morning started!"]];
    } else if (hour < 16) {
        greetings = [...greetings, ...["Good afternoon!"]];
    } else if (hour < 19) {
        greetings = [...greetings, ...["Good evening!", "Beautiful evening, isn't it?"]];
    } else {
        greetings = [...greetings, ...["Burning the midnight oil?", "Working late?", "The night is young!"]];
    }
    return greetings;
}

export function getRandomWelcomeText(){
    const greetings = welcomeTexts();
    const randomIndex = Math.floor(Math.random() * greetings.length);
    
    return greetings[randomIndex];
}