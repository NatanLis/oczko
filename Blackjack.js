/* Final project cs3200:
   Authors Authors: Tyson Hickey, 201507225 and Matthew Gilchrist, 200942688

   Combined with the html file this file use the q learning algorithm to
   simulate the game of blackjack.

   The Q-Learning policy is integrated witht he table in the HTML file in order
   to show the changes in real time.


*/


myTable = document.getElementById("myTable");
// class made to simulate a deck of cards
class Deck
{
    constructor()
    {
        this.deck = [];

        for (let i = 0 ; i < 4 ; i++)
        {
            this.deck.push([11,2,3,4,5,6,7,8,9,10,10,10,10]);
        }
    }

    drawCard()
    {
        let rand1 = Math.floor(Math.random()*this.deck.length);
        let rand2 = Math.floor(Math.random()*this.deck[rand1].length)
        let card = this.deck[rand1].splice(rand2, 1);
        return card[0];
    }
}
// initalizes empty arrays to begin
init = function()
{
    state = [22, 22]; //state === [players cards, dealers first card]
    player = [0, 0]; //player == [players cards, aces at value 11]
    dealer = [0, 0]; //dealer == [dealers cards, aces at value 11]
    // alpha = 0.0;
    // epsilon = 0.0;
    // gamma = 0.0;

    console.log(alpha);

    Q = [];
    P = [];
    for (let i = 0 ; i <= 16 ; i++)
    {
        Q.push([]);
        P.push([]);
        for (let j = 0 ; j < 10 ; j++)
        {
            Q[i].push([]);
            P[i].push([]);
            for (let k = 0 ; k < 2 ; k++)
            {
                Q[i][j].push(0);
                P[i][j].push(0.5);
            }
        }
    }
    console.log("init done");
}
// q Learning algorithm function
QLearning = function()
{
    setInterval(function() {
        alpha = document.getElementById("alpha").value;
        epsilon = document.getElementById("epsilon").value;
        gamma = document.getElementById("gamma").value;

        while (state[0] >= 21)
        {
            StartBlackjack();
        }
        var action = selectAction();
        var reward = getReward(action);
        if (player[0] >= 21 || action == 0)
        {
            var nextState = state;
        }
        else
        {
            var nextState = [player[0], state[1]];
        }
        Q[state[0]-4][state[1]-2][action] = Q[state[0]-4][state[1]-2][action] = alpha * (reward + gamma * maxReward(nextState) - Q[state[0]-4][state[1]-2][action]);
        updatePolicy();
        if (player[0] >= 21 || action == 0)
        {
            state = [22, 22];
        }
        else
        {
            state = nextState;
        }

    }, 1);
}
// Q - Learning Algorithm for stepping through
QLearningStep = function()
{
    alpha = document.getElementById("alpha").value;
    epsilon = document.getElementById("epsilon").value;
    gamma = document.getElementById("gamma").value;
    while (state[0] >= 21)
    {
        StartBlackjack();
    }
    var action = selectAction();
    var reward = getReward(action);
    if (player[0] >= 21 || action == 0)
    {
        var nextState = state;
    }
    else
    {
        var nextState = [player[0], state[1]];
    }
    Q[state[0]-4][state[1]-2][action] = Q[state[0]-4][state[1]-2][action] = alpha * (reward + gamma * maxReward(nextState) - Q[state[0]-4][state[1]-2][action]);
    updatePolicy();
    if (player[0] >= 21 || action == 0)
    {
        state = [22, 22];
    }
    else
    {
        state = nextState;
    }

    console.log(Q);
    console.log(P);

}
// begins hand
StartBlackjack = function()
{
    deck = new Deck();
    player = [0, 0];
    dealer = [0, 0];
    state = [0, 0];

    //Player Draw
    for (let i = 0 ; i < 2 ; i++)
    {
        let card = deck.drawCard();
        player[0] += card;
        state[0] += card;
        if (card == 11)
        {
            player[1]++;
        }
    }

    if (player[0] == 21)
    {
        state = [22, 22];
        return;
    }

    if (player[0] == 22)
    {
        player[0] -= 10;
        state[0] -= 10;
        player[1]--;
    }

    //Dealer Draw
    var card = deck.drawCard();
    dealer[0] += card;
    state[1] += card;
    if (card == 11)
    {
        dealer[1]++;
    }

    card = deck.drawCard();
    dealer[0] += card;
    if (card == 11)
    {
        dealer[1]++;
    }

    if (dealer[0] == 22)
    {
        dealer[0] -= 10;
        dealer[1]--;
    }
}
// selects an action based on epsilon greedy or by policy
selectAction = function()
{
    if (Math.random < epsilon)
    {
        return Math.floor(Math.random()*2);
    }
    else
    {
        if (Math.random() > P[state[0]-4][state[1]-2][0])
        {
            return 1;
        }
        else
        {
            return 0;
        }
    }
}
// gets reward from hit or stand functions
getReward = function(a)
{
    if (a)
    {
        return Hit();
    }
    return Stand();
}
// commences game when Hit action is taken
Hit = function()
{
    let card = deck.drawCard();
    player[0] += card;
    if (card == 11)
    {
        player[1]++;
    }

    if (player[0] > 21)
    {
        if (player[1] > 0)
        {
            player[0] -= 10;
            player[1]--;
            return 0;
        }
        else
        {
            return -1;
        }
    }
    else if (player == 21)
    {
        return Stand();
    }
    else
    {
        return 0;
    }
}
// Continues game when Stand action is taken
Stand = function()
{
    while (dealer < 17)
    {
        let card = deck.drawCard();
        dealer[0] += card;
        if(card == 11)
        {
            dealer[1]++;
        }
    }

    if (dealer > 21)
    {
        if (dealer[1] > 0)
        {
            dealer[0] -= 10;
            dealer[1]--;
            Stand();
        }
        else
        {
            return 1;
        }
    }
    else if (dealer[0] > player[0])
    {
        return -1;
    }
    else if (dealer[0] == player[0])
    {
        return 0;
    }
    else
    {
        return 1;
    }
}
// maxReward function returns the maximun reward based on an action
// this is used as the max action within the Q-Learning algorithm
maxReward = function(nState)
{
    if (Q[nState[0]-4][nState[1]-2][0] > Q[nState[0]-4][nState[1]-2][1])
    {
        return Q[nState[0]-4][nState[1]-2][0];
    }
    else
    {
        return Q[nState[0]-4][nState[1]-2][1];
    }
}


// Updates policy with the P array as well in the HTML table depending on the
// outcome of the hand.
updatePolicy = function()
{


    if (Q[state[0]-4][state[1]-2][0] > Q[state[0]-4][state[1]-2][1])
    {
        P[state[0]-4][state[1]-2][0] = 1;
        P[state[0]-4][state[1]-2][1] = 0;
        myTable.rows[state[0]-4 + 2].cells[state[1]-2 + 1].innerHTML = "HIT";
        myTable.rows[state[0]-4 + 2].cells[state[1]-2 + 1].style.backgroundColor = "red";
        myTable.rows[state[0]-4 + 2].cells[state[1]-2 + 1].style.color = "white";


    }
    else if (Q[state[0]-4][state[1]-2][0] < Q[state[0]-4][state[1]-2][1])
    {
        P[state[0]-4][state[1]-2][0] = 0;
        P[state[0]-4][state[1]-2][1] = 1;
        myTable.rows[state[0]-4 + 2].cells[state[1]-2 + 1].innerHTML = "STAND";
        myTable.rows[state[0]-4 + 2].cells[state[1]-2 + 1].style.backgroundColor = "yellow";
        myTable.rows[state[0]-4 + 2].cells[state[1]-2 + 1].style.color = "black";
    }
    else
    {
        P[state[0]-4][state[1]-2][0] = 0.5;
        P[state[0]-4][state[1]-2][1] = 0.5;
        myTable.rows[state[0]-4 + 2].cells[state[1]-2 + 1].innerHTML = "H/S";
        myTable.rows[state[0]-4 + 2].cells[state[1]-2 + 1].style.backgroundColor = "green";
        myTable.rows[state[0]-4 + 2].cells[state[1]-2 + 1].style.color = "white";
    }
}
window.onload = init();
