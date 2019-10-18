"use strict";
$.response.contentType = "application/json";
$.response.contentType = "text/plain";
var dest = $.net.http.readDestination("WORKFLOW_HTTP");
var requestBody = $.request.body.asString();

function startWorkFlow(bidId) {
	var client = new $.net.http.Client();
	var request = new $.net.http.Request($.net.http.GET, '/workflow-service/rest/v1/xsrf-token');
	var token;
	request.headers.set("X-CSRF-Token", "Fetch");
	request.headers.set("Authorization", dest.authString);
	client.request(request, dest);
	var response = client.getResponse();

	var request2 = new $.net.http.Request($.net.http.POST, '/workflow-service/rest/v1/workflow-instances');
	// Get token
	response.headers.forEach(function (header) {
			if (header.name == 'x-csrf-token') {
				token = header.value;
			}
		})
		// Get cookies
	response.cookies.forEach(function (cookie) {
		request2.cookies.set(cookie.name, cookie.value);
	});

	if (token !== undefined) {
		request2.headers.set("Content-Type", "application/json");
		request2.headers.set("X-CSRF-Token", token);
		request2.headers.set("Authorization", dest.authString);
		var oBody = {
			"definitionId": "wfdetail",
			"context": {
				"BidId": bidId.toString()
			}
		};
		request2.setBody(JSON.stringify(oBody));
		client.request(request2, dest);
		var response2 = client.getResponse();
		return response2;
	} else {
		return {
			"result": 0,
			"msg": "Failed to fetch workflow's token"
		}
	}
}

function insertData() {
	var data = JSON.parse(requestBody);
	var connection = $.db.getConnection();
	// Get bid manager, will be set to WF approver
	var query = "SELECT * FROM \"ebidpoc.db::Tables.Conguration\" where \"Key\" = 'bidmanager';";
	var pStmt = connection.prepareStatement(query);
	var configRs = pStmt.executeQuery();
	pStmt.close();
	while (configRs.next()) {
		var key = configRs.getString(1);
		var value = configRs.getString(3);
		if (key == 'bidmanager') {
			var bidManager = value;
		}
	}
	//Get Next Personnel Number
	var pStmt = connection.prepareStatement("select max( \"BiddingId\" ) from \"ebidpoc.db::Tables.Bid\"");
	var rs = pStmt.executeQuery();
	pStmt.close();
	var BiddingId = "";
	while (rs.next()) {
		BiddingId = rs.getInteger(1) + 1;
	}

	try {
		//Create Bid	 
		var date = new Date();
		pStmt = connection.prepareStatement("insert into \"ebidpoc.db::Tables.Bid\" values(?,?,?,?,?,?,?,?,?,?,?)");
		pStmt.setString(1, BiddingId.toString());
		pStmt.setString(2, data.Title.toString());
		pStmt.setString(3, data.Context.toString());
		pStmt.setString(4, data.StartDate);
		pStmt.setString(5, data.EndDate);
		pStmt.setString(6, data.InitialPrice.toString());
		pStmt.setString(7, data.Currency.toString());
		pStmt.setString(8, data.Status.toString());
		if ($.session.getUsername() == undefined) {
			pStmt.setString(9, ""); //Created By
		} else {
			pStmt.setString(9, $.session.getUsername()); //Created By
		}
		if (data.BidPersonel == undefined) {
			pStmt.setString(10, "");
		} else {
			pStmt.setString(10, data.BidPersonel.toString()); //Bid Personnel
		}
		pStmt.setString(11, bidManager);
		var result = pStmt.executeUpdate();
		pStmt.close();
		var i = "";
		for (i in data.BidderListRef) {
			//Create BRB	 
			pStmt = connection.prepareStatement("insert into \"ebidpoc.db::Tables.BidRefBidder\" values(?,?,?,?,?)");
			pStmt.setString(1, BiddingId.toString());
			pStmt.setString(2, data.BidderListRef[i].toString());
			pStmt.setString(3, "");
			pStmt.setString(4, "");
			pStmt.setString(5, data.StartDate.toString());
			result = pStmt.executeUpdate();
			pStmt.close();
		}
		connection.commit();
		// Call workflow
		var rs = startWorkFlow(BiddingId);
		return rs;
		return {
			"result": result,
			"msg": "Bid record created"
		};
	} catch (err) {
		return {
			"result": 0,
			"msg": err.message
		};
	}
}
if (typeof (requestBody) !== "undefined") {
	try {
		var respBody = insertData();
	} catch (err) {
		respBody = {
			"result": 0,
			"msg": err.message
		};
		$.response.returnCode = 200;
	}
	$.response.setBody(respBody);
} else {
	$.response.setBody("Error while retriving params");
	$.response.returnCode = 200;
}