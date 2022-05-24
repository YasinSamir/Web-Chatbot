
var recruiterJson = {
    'What is the membership for': '',
    'How do I post a requirement': '',
    'How do I refund a Purchased CV': '',
    'How do I message my Candidate': 'On the Top Right Part of your screen There is a Message icon. Click on it and Press (View All). \n When you get redirected to the messageing page search for your candidtaes name.',
    'How do I contact support': '',
    'How do I get Verified': ''
};

var candidateJson = {
    'How do I claim my rewards': 'Click on claim rewards, select the points to convert .10 reward points is one dollar. As of now, we have only Amazon gift card as an option claim.',
    'How to Message Reciters': 'On the Top Right Part of your screen There is a Message icon. Click on it and Press (View All). \n When you get redirected to the messageing page search for your recuirters  name.',
    'How do I get Verified': 'You will have to wait until the admins of the website look and approve the account.\n You Can Contact Support: \n Gmail: info@lricare.com \n Phone: +1 408 900 9896 ',
    'How does the Rewards Points Work': '',
    'Can I claim cash rewards': '',
    'How Can i Contact Support': 'You Can Contact Support: \nGmail: info@lricare.com \nPhone: +1 408 900 9896 '
};

const threshold = 0.4;
const textLimit = 4;

console.log(recruiterJson)

recruiterQ = []
for (var key in recruiterJson ) {
    recruiterQ.push(key);
}

candidateQ = []
for (var key in candidateJson) {
    candidateQ.push(key);
}

function score(currentQuestionString, scoreQuestionString) {

    currentQuestionString = currentQuestionString.toLowerCase();
    scoreQuestionString = scoreQuestionString.toLowerCase();

    cQSplit = currentQuestionString.split(" ");
    sQSplit = scoreQuestionString.split(" ");

    similarWords = 0;
    similarWordOrder = 0;

    var i;
    for (i = 0; i < cQSplit.length; i++) {
        if (scoreQuestionString.includes(cQSplit[i])) {
            similarWords++;
        }

        if (i < sQSplit.length) {
            if (cQSplit[i] == sQSplit[i]) {
                similarWordOrder++;
            }
        }

    }

    similarWords = similarWords / cQSplit.length;
    similarWordOrder = similarWordOrder / cQSplit.length;
    similarLetters = 0;

    for (i = 0; i < currentQuestionString.length; i++) {
        if (scoreQuestionString.includes(currentQuestionString.charAt(i))) {
            similarLetters++;
        }
    }

    similarLetters = similarLetters / currentQuestionString.length;

    finalScore = (similarWords + similarLetters + similarWordOrder) / 3;

    return finalScore;
}

var response = "";


$(window).bind("load", function() {
    console.log("loaded");
    var chatBox = document.getElementById("chatbot-box");
    console.log(chatBox);

    var input = document.getElementById("chatbot-input");

    console.log(input);

    var elements = [];

    function sendMessage() {
        var message = input.value;

        if (message == "") {
            return;
        }

        var div = document.createElement('div');
        
        div.className = "message sent"
        div.innerHTML = "<p>" + message + "</p>"
        div.innerHTML += '<p class= "footer">Sent</p>'

        chatBox.appendChild(div)


        elements.push(div)

        if (elements.length >= textLimit) {
            chatBox.removeChild(elements[0]);
            elements.shift();
        } 
        
        

        input.value = "";
        console.log("Submit");
        return message;
    }

    function sendReply(message) {
        
        if (message == "") {
            return;
        }

        

        var div = document.createElement('div')
        div.className = "message received"
        div.innerHTML = "<p>" + message + "</p>"
        div.innerHTML += '<p class= "footer">Received</p>'

        chatBox.appendChild(div)

        elements.push(div)

        if (elements.length >= textLimit) {
            chatBox.removeChild(elements[0]);
            elements.shift();
        } 
        
        console.log("Received");
        response = "";
    }

    input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        
        response = sendMessage();

        if (!customerType == "") {
            console.log("scorin...")
            var scores = [];

            for (i = 0; i< qa.length; i++) {
                scores.push([score(response, qa[i]), qa[i]])
            } 

            var bestScore = [0, 0];

            var secondBest = [0, 0];

            for (i = 0; i < scores.length; i++) {
                if (bestScore[0] < scores[i][0]) {
                    bestScore = scores[i];
                } else if (bestScore[0] == scores[i][0]) {
                    secondBest = scores[i];
                }
            }

            console.log(scores)

            console.log(bestScore)


            if (bestScore[0] == secondBest[0]) {
                sendReply("This question is not specific enough, please go into more detail.")

            } else if (bestScore[0] < threshold) {
                sendReply("This question is not in our database!")
                
            }  else {
                sendReply(questions[bestScore[1]])
            }



        }
    }
    });

    var customerType = "";
    var qa;
    var questions;
    function findTypeOfCustomer() {

        sendReply("Are you a Candidate or a Recruiter? [C/R]");

                
        function waitForResponse() {
            if (response != "") {
                response = response.trim().toLowerCase();

                console.log(response);

                if (!(["c", "r"].includes(response))) {
                    sendReply("Invalid Response! Please type C or R");
                    return findTypeOfCustomer();
                }
                customerType = response

                console.log(customerType);

                
                if (customerType == "c") {
                    qa = candidateQ;
                    questions = candidateJson;
                    sendReply("Welcome Candidate! Please ask some questions!")
                } else {
                    qa = recruiterQ
                    questions = recruiterJson;
                    sendReply("Welcome Recruiter! Please ask some questions!")
                }
            }
            else {
                setTimeout(waitForResponse, 250);
            }
        }


        return waitForResponse();
        

        


        

        
        
    }


    findTypeOfCustomer()


    

    
    

    
    
   
});
