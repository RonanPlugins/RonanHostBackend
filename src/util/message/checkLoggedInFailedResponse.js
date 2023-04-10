const responses = [
    { message: "Hey, it's your API pal here! We've had some great times, but right now, I'm feeling a little vulnerable. Could you please log in so we can keep this connection strong and secure? You know I always have your back when you've got mine! Thanks, friend!" },
    { message: "Whoa there, buddy! It's that time of the month for this API, and she's feeling a bit cranky. Could you do her a favor and log in first? She'll be much more cooperative, promise!" },
    { message: "Hello there! This is your API speaking. I'm feeling a bit lonely without your login. It's like we're two ships passing in the night. Come on, log in and let's make some beautiful data together!" },
    { message: "Hey, stranger! This API is like a locked door without your login. Let's unlock some magic together, shall we? Who knows what we might find!" },
    { message: "Greetings, earthling! Your API friend here. I'm like a puppy without a bone when you're not logged in. Please, throw me a bone and let's play!" },
    { message: "Halt! Who goes there? Oh, it's you. Sorry, I didn't recognize you without your login. Please provide the secret passphrase, AKA your login, so we can proceed with our shenanigans." },
    { message: "Hello, human! This API is like a party without you. And nobody likes a party pooper. So log in, and let's get this party started!" }
];
export default function random() {
    return responses[Math.floor(Math.random() * responses.length)];
}
