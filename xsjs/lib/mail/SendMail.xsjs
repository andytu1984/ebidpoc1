/*eslint no-console: 0, no-unused-vars: 0*/
"use strict";
var requestBody = $.request.body.asString();
var data = JSON.parse(requestBody);
var response = {};
var bidId = data.BidId.toString();
var conn = $.db.getConnection();
var query = "SELECT * FROM \"ebidpoc.db::BidderToBidView\" where \"BidId\" = '" + bidId + "';";
if (conn) {
	var oStatement = conn.prepareStatement(query);
	var oResultSet = oStatement.executeQuery();
}
var totalRecord = new Array();
var singleRec = {};
while (oResultSet.next()) {
	var bidId = oResultSet.getString(1);
	var bidderId = oResultSet.getString(2);
	var bidderName = oResultSet.getString(3);
	var emailAddr = oResultSet.getString(4);
	singleRec = {
		name: bidderName,
		address: emailAddr,
		nameEncoding: "US-ASCII",
		bidId: bidId,
		bidderId: bidderId
	};
	totalRecord.push(singleRec);
}
//Get Bid Information
var bidInfo;
var query = "SELECT * FROM \"ebidpoc.db::Tables.Bid\" where \"BiddingId\" = '" + bidId + "';";
if (conn) {
	oStatement = conn.prepareStatement(query);
	oResultSet = oStatement.executeQuery();
	while (oResultSet.next()) {
		var bidTitle = oResultSet.getString(2);
		var bidContext = oResultSet.getString(3);
		var bidEndDate = oResultSet.getString(5);
	}
}

var senderEmail;
var query = "SELECT * FROM \"ebidpoc.db::Tables.Conguration\";";
if (conn) {
	oStatement = conn.prepareStatement(query);
	oResultSet = oStatement.executeQuery();
	while (oResultSet.next()) {
		if (oResultSet.getString(1) == "emailsender") {
			senderEmail = oResultSet.getString(3);
		};
		if (oResultSet.getString(1) == "BiddingURL") {
			var BiddingURL = oResultSet.getString(3);
		};
	}
}
if (senderEmail == "") {
	response = {
		"result": "0",
		"msg": "No email sender found, please check configuration"
	};
} else {
	var recipientArr = new Array();
	//create email from JS Object and send

	totalRecord.forEach(function (record) {
		var accessKey = Math.floor(Math.random() * 10000000000);
		var updateSQL = "update \"ebidpoc.db::Tables.BidRefBidder\" set \"AccessKey\" = '" + accessKey + "' where \"BidId\" = '" + record.bidId +
			"' and \"BidderId\" = '" + record.bidderId + "';";
		try {
			var oUpdate = conn.prepareStatement(updateSQL);
			var oUpdateRs = oUpdate.executeQuery();
			conn.commit();
			oUpdate.close();
		} catch (err) {};

		recipientArr.splice(0, recipientArr.length);
		var oRecipient = {
			name: record.name,
			address: record.address,
			nameEncoding: "US-ASCII"
		};
		recipientArr.push(oRecipient);
		
		var mailContent =
			"<h1 align='center'>Invitation to Bid</h1><img src='https://gss1.bdstatic.com/-vo3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=6ed07003fc36afc30e0c38638b228cf9/203fb80e7bec54e75b4e27ddb2389b504ec26a56.jpg' width='100' height='100'><table style='font-size:20px;'> " +
			"<tr><td><b>Bid Due Date:</b></td><td>" + bidEndDate + "</td></tr>" +
			"<tr><td><b>Project Information:</b></td><td>" + bidTitle + "</td></tr>" +
			"<tr><td><b>Project Description:</b></td><td>" + bidContext + "</td></tr>" +
			"<tr><td><b>Biding URL:</b></td><td><a href='" + BiddingURL + "'>" + BiddingURL + "</a></td></tr>" +
			"<tr><td><b>Access Key:</b></td><td>" + accessKey + "</td></tr></table>" +
			"<p>All information in this request for proposal and all other documents related to this project bidding are confidential. All of the documents provided by Owner should be returned after the conpletion of the tendering unless a formal written approval from Owner. Un-returnable documents or information should be eliminated by the Bidders. The Bidders should not keep any form of documents or drawings originall provided by Owner when then tendering is completed.</p>";

		var mail = new $.net.Mail({
			sender: {
				address: senderEmail
			},
			//to: [{ name: "Jerry Lin", address: "jerry.lin02@sap.com", nameEncoding: "US-ASCII"}],
			to: recipientArr,
			// cc: ["gaoqiao213@126.com", {address: "gaoqiao213@126.com"}],
			//   bcc: [{ name: "Jonnie Doe", address: "bcc@hana.mail.com"}],
			subject: "Bidding Invitation",
			subjectEncoding: "UTF-8",
			parts: [new $.net.Mail.Part({
				type: $.net.Mail.Part.TYPE_TEXT,
				//text: "Dear vendor: \n	We would like to invite you to our auction bidding, please visit our bidding site through:\nURL: \nAccess Key:" + accessKey,
				text: mailContent,
				contentType: "text/html",
				encoding: "UTF-8"
			})]
		});

		var returnValue = mail.send();
		var msg = "MessageId = " + returnValue.messageId + ", final reply = " + returnValue.finalReply;
		response = {
			"result": "1",
			"msg": msg
		};
	})
}
$.response.status = $.net.http.OK;
$.response.contentType = "application/json";
$.response.setBody(response);