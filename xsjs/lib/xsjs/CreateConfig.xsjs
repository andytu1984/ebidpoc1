"use strict";
$.response.contentType = "application/json";
$.response.contentType = "text/plain";
var requestBody = $.request.body.asString();

function insertData() {
	var data = JSON.parse(requestBody);
	var connection = $.db.getConnection();

	try {
		// Create Conguration
		var pStmt = connection.prepareStatement("insert into \"ebidpoc.db::Tables.Conguration\" values(?,?,?)");
		pStmt.setString(1, data.Key.toString());
		pStmt.setString(2, data.Seq.toString());
		pStmt.setString(3, data.Value.toString());
		var result = pStmt.executeUpdate();
		pStmt.close();
		connection.commit();

		return {
			"result": result,
			"msg": "Conguration record created"
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