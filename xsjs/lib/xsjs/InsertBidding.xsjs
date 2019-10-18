"use strict";
$.response.contentType = "application/json";
$.response.contentType = "text/plain";
// $.response.setBody("Hello World");
var requestBody = $.request.body.asString();
var UTIL = $.import('xsjs','BlockchainService');
function insertData(biddingId,bidderId,price,currency){
	var biddingId = biddingId;
	var bidderId = bidderId;
	var currentDate;
	var connection = $.db.getConnection();
	var sql = 'INSERT INTO \"ebidpoc.db::Tables.BiddingHistory\" VALUES(?,?,?,?,?,?);';
	var date = new Date();
	var timeStamp = date.getFullYear() + ('0' + (date.getMonth()+1)).slice(-2) +
					('0' + date.getDate()).slice(-2) + ('0' + date.getHours()).slice(-2) +
					('0' + date.getMinutes()).slice(-2) + ('0' + date.getSeconds()).slice(-2);
	try{
		var pStmt = connection.prepareStatement(sql);
		pStmt.setString(1, biddingId.toString());
		pStmt.setString(2, bidderId.toString() );
		pStmt.setString(3, timeStamp);
		pStmt.setString(4, price.toString());
		pStmt.setString(5, currency);
		pStmt.setString(6, '');
		var result = pStmt.executeUpdate();
		connection.commit();
		pStmt.close();
		var oBiddingRecord = {biddingId:biddingId,bidderId:bidderId,timeStamp:timeStamp,price:price,currency:currency};
		var srvResult = UTIL.postDataToChain(oBiddingRecord);
		if( srvResult == $.net.http.OK){
			return { "result": result, "msg": "Bidding record created"};
		}
	} catch(err){
		return { "result": 0, "msg":err.message};
	}
	
}

if (typeof (requestBody) !== "undefined"){
	var obj = JSON.parse(requestBody).bid;
	var biddingId = obj.biddingId;
	var bidderId = obj.bidderId;
	var biddingPrice = obj.biddingPrice;
	var currency = obj.currency;
	try{
		var respBody = insertData(biddingId,bidderId,biddingPrice,currency);
	} catch(err){
		respBody = { "result": 0, "msg":err.message};
		$.response.returnCode = 200;
	}
	$.response.setBody(respBody);
}else{
	$.response.setBody("Error while retriving params");  $.response.returnCode = 200;	
}