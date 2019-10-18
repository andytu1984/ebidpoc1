"use strict";
$.response.contentType = "application/json";
$.response.contentType = "text/plain";
var requestBody = $.request.body.asString();

function insertData() {
	var data = JSON.parse(requestBody);
	var connection = $.db.getConnection();

	// Get Next Bidder Number
	var pStmt = connection.prepareStatement("select max( \"BidderId\" ) from \"ebidpoc.db::Tables.Bidder\"");
	var rs = pStmt.executeQuery();
	pStmt.close();
	var BidderId = "";
	while (rs.next()) {
		BidderId = rs.getInteger(1) + 1;
	}
	try {
		// Create Bidder
		var date = new Date();
		pStmt = connection.prepareStatement("insert into \"ebidpoc.db::Tables.Bidder\" values(?,?,?,?)");
		pStmt.setString(1, BidderId.toString());
		pStmt.setString(2, data.Email.toString());
		pStmt.setString(3, data.BidderName.toString());
		pStmt.setString(4, data.CreateDate);
		var result = pStmt.executeUpdate();
		pStmt.close();
		connection.commit();

		return {
			"result": result,
			"msg": "Bidder record created"
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