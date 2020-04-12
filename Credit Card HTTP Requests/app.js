// jshint esversion: 10

function getData() {
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://jsonmock.hackerrank.com/api/transactions/search?txnType=', true);
xhr.onload = function () {
if (this.status == 200) {
		var userData = JSON.parse(this.responseText);
		console.log(userData.data);
		let totalPages = userData.total_pages;
		return userData;
} else if (xhr.status == 404) {
		console.log('Request Not Found');
		}
	};
	xhr.send();
}

async function getUserTransaction(uid, txnType, monthYear) {
	let userData = await getData();
	//Main function code below...
	let idsOfUserTransactions = [];
	let debitCharges = [];
	console.log(userData);
	// Loop over all of our individual page data
     for (let i = 0; i < userData.data.length; i++){
       //convert timestamps to useable monthYear format
       let newTimeStamp = new Date(userData.data[i].timestamp);
       let month = newTimeStamp.getMonth().toString().padStart(2, '0');
       let year = newTimeStamp.getFullYear();
       let transactionMonthYear = month + '-' + year;
       //If the data the data parameters match the data in the array, move forward
     // if (userData.data[i].userId == uid && userData.data[i].txnType == txnType && transactionMonthYear == monthYear) {
       if (userData.data[i].userId == uid && userData.data[i].txnType == txnType) {
           idsOfUserTransactions.push(userData.data[i].id);
           debitCharges.push(userData.data[i].amount);
       }
     }

     console.log(idsOfUserTransactions);
     console.log(debitCharges);

     //Turn debit charges into actual integers we can use
     const chargeAsNum = debitCharges.map(charge => Number(charge.replace(/[^0-9\.]+/g,"")));
     console.log(chargeAsNum);
     //Get the total amount spent in this month
     const reducer = (accumulator, currentValue) => accumulator + currentValue;
     const totalSpentThisMonth = chargeAsNum.reduce(reducer);
     //Get the average amount spent this month
     const averageSpentThisMonth = totalSpentThisMonth / debitCharges.length;
     //Get the charges that were less than this average to remove them from our array. Also get the index of the values removed so we can also remove the corresponding ids with the same values
     for (let i = 0; i < chargeAsNum.length; i++) {
       if (i < averageSpentThisMonth){
         let chargeIndex = chargeAsNum.indexOf(i);
         chargeAsNum.splice(chargeIndex);
         console.log(chargeAsNum);
         idsOfUserTransactions.splice(chargeIndex); //The charge amount and the id were added at the same time and have the same indexes in their arrays.
         console.log(idsOfUserTransactions);
       }
     }

     console.log(totalSpentThisMonth);
     console.log(averageSpentThisMonth);

     //sort the ids of the over budget transactions in descending order
     const finalIdArray = idsOfUserTransactions.sort();
     console.log(finalIdArray);
}

getUserTransaction();














//
// function getUserTransaction(uid, txnType, monthYear) {
// var xhr = new XMLHttpRequest();
//
// xhr.open('GET', 'https://jsonmock.hackerrank.com/api/transactions/search?txnType=', true);
// xhr.onload = function () {
// 	if (this.status == 200){
//     var userData = JSON.parse(this.responseText);
//     console.log(userData.data);
//     let totalPages = userData.total_pages;
//
//     let idsOfUserTransactions = [];
//     let debitCharges = [];
//
// //loop over each of the 30 pages with the same function
// for (let i = 1; i < totalPages; i++) {
//   let currentPage = i;
//   let url = `https://jsonmock.hackerrank.com/api/transactions/search?txnType=&page=` + currentPage;
//   xhr.open('GET', url, true);
//     //Loop over all of our individual page data
//     for (let i = 0; i < userData.data.length; i++){
//       //convert timestamps to useable monthYear format
//       let newTimeStamp = new Date(userData.data[i].timestamp);
//       let month = newTimeStamp.getMonth().toString().padStart(2, '0');
//       let year = newTimeStamp.getFullYear();
//       let transactionMonthYear = month + '-' + year;
//       //If the data the data parameters match the data in the array, move forward
//     // if (userData.data[i].userId == uid && userData.data[i].txnType == txnType && transactionMonthYear == monthYear) {
//       if (userData.data[i].userId == uid && userData.data[i].txnType == txnType) {
//           idsOfUserTransactions.push(userData.data[i].id);
//           debitCharges.push(userData.data[i].amount);
//       }
//     }
//   }
//
//     console.log(idsOfUserTransactions);
//     console.log(debitCharges);
//
//     //Turn debit charges into actual integers we can use
//     const chargeAsNum = debitCharges.map(charge => Number(charge.replace(/[^0-9\.]+/g,"")));
//     console.log(chargeAsNum);
//     //Get the total amount spent in this month
//     const reducer = (accumulator, currentValue) => accumulator + currentValue;
//     const totalSpentThisMonth = chargeAsNum.reduce(reducer);
//     //Get the average amount spent this month
//     const averageSpentThisMonth = totalSpentThisMonth / debitCharges.length;
//     //Get the charges that were less than this average to remove them from our array. Also get the index of the values removed so we can also remove the corresponding ids with the same values
//     for (let i = 0; i < chargeAsNum.length; i++) {
//       if (i < averageSpentThisMonth){
//         let chargeIndex = chargeAsNum.indexOf(i);
//         chargeAsNum.splice(chargeIndex);
//         console.log(chargeAsNum);
//         idsOfUserTransactions.splice(chargeIndex); //The charge amount and the id were added at the same time and have the same indexes in their arrays.
//         console.log(idsOfUserTransactions);
//       }
//     }
//
//     console.log(totalSpentThisMonth);
//     console.log(averageSpentThisMonth);
//
//     //sort the ids of the over budget transactions in descending order
//     const finalIdArray = idsOfUserTransactions.sort();
//     console.log(finalIdArray);
//     //return the final sorted array as our result
//     return finalIdArray;
//   } else if (xhr.status == 404) {
//     console.log('Request Not Found');
//     }
//   };
//  xhr.send();
// }
//
//
// getUserTransaction(2, 'debit', '02-2019');
//
//
// // Each individual transaction has its own id number (id), and each user has their own id number (userId).
// //There are 30 pages with 10 entries each. 300 transactions total.
// //Each user has made multiple transactions which are just randomly throughout the entire document.
// //We need to find a user's id (userId) that will be repeating throughout attached to each of their transactions
// ////Find the number of records that belong to the user uid,
// //have a transaction type of txnType,
// //and the transaction amount is greater than the average monthly spending.
// //goal is to return an integer_array containing ids of the transactions that match the criteria.
