// jshint esversion: 10
let url = 'https://jsonmock.hackerrank.com/api/transactions/search?txnType=';
const searchForm = document.querySelector('.search-form');
const getResultsButton = document.querySelector('.get-results-button');
const userId = document.querySelector('.user-id');
const txn = document.querySelector('.txn-type');
const date = document.querySelector('.month-year');
const responseData = document.querySelector('.response-data');

function fetchData(url) {
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.onload = function() {
      resolve(this.responseText);
			console.log(JSON.parse(this.responseText));
    };
    request.onerror = function() {
      reject("Network error!");
    };
    request.send();
  });
}

async function getUserTransaction(uid, txnType, monthYear) {
	let userData = JSON.parse(await fetchData(url));
	let totalPages = userData.total_pages + 1;
	let arrayOfCharges = [];
	//Loop over each page of 30
	for (let i = 0; i < totalPages; i++){
	userData = JSON.parse(await fetchData(url + '&page=' + i));
	// Loop over all of our individual page data
     for (let i = 0; i < userData.data.length; i++){
       //convert timestamps to useable monthYear format
       let newTimeStamp = new Date(userData.data[i].timestamp);
       let month = (newTimeStamp.getUTCMonth() + 1).toString().padStart(2, '0');
       let year = newTimeStamp.getUTCFullYear();
       userData.data[i].transactionMonthYear = month + '-' + year;
       //If the data the data parameters match the data in the array, move forward
     if (userData.data[i].userId == uid && userData.data[i].txnType == txnType && userData.data[i].transactionMonthYear == monthYear) {
					 arrayOfCharges.push(userData.data[i]);
       }
     }
	 }
     //Turn debit charges into actual integers we can use
    arrayOfCharges.forEach(charge => {
			  charge.chargeAsNum = Number(charge.amount.replace(/[^0-9\.]+/g,""));
		 })

     //Get the total amount spent in this month
     const reducer = (accumulator, currentValue) => accumulator + currentValue.chargeAsNum;
     const totalSpentThisMonth = arrayOfCharges.reduce(reducer, 0);
     //Get the average amount spent this month
     const averageSpentThisMonth = totalSpentThisMonth / arrayOfCharges.length;
     //Get the charges that were less than this average to remove them from our array. Also get the index of the values removed so we can also remove the corresponding ids with the same values

		 const filteredTransactions = arrayOfCharges.filter(charge => {
			 return charge.chargeAsNum > averageSpentThisMonth;
		 });

		 console.log(totalSpentThisMonth);
		 console.log(averageSpentThisMonth);
     console.log(filteredTransactions);

     //sort the ids of the over budget transactions in descending order
     const finalIdArray = filteredTransactions.sort();
     console.log(finalIdArray);
		 return finalIdArray;
}

getResultsButton.addEventListener('click', (e) => {
e.preventDefault();
let uid = parseInt(userId.value);
let txnType = txn.value;
let monthYear = date.value;

responseData.innerHTML = ``;

let results = getUserTransaction(uid, txnType, monthYear);

var getResults = function() {
  return new Promise(function(resolve){
    resolve(results);
  });
};

async function displayResults () {
  var result = await getResults();
  for (let i = 0; i < result.length; i++){
  responseData.innerHTML += `
    <div class="response-id">${result[i].id}</div>
  `;
 }
}

displayResults();
searchForm.reset();
});

// getUserTransaction(4, 'debit', '02-2019');


// // Each individual transaction has its own id number (id), and each user has their own id number (userId).
// //There are 30 pages with 10 entries each. 300 transactions total.
// //Each user has made multiple transactions which are just randomly throughout the entire document.
// //We need to find a user's id (userId) that will be repeating throughout attached to each of their transactions
// ////Find the number of records that belong to the user uid,
// //have a transaction type of txnType,
// //and the transaction amount is greater than the average monthly spending.
// //goal is to return an integer_array containing ids of the transactions that match the criteria.
