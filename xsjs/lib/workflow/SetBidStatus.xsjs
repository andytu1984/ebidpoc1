$.response.status = 200;
$.response.contentType = "application/json";

//Implementation of GET call
function fnHandleGet() {
	return {
		"result": "0",
		"msg": "The service only accept POST method"
	};
}

//Implementation of POST call
function fnHandlePost() {
	var requestBody = $.request.body.asString();
	var data = JSON.parse(requestBody);
	var bidId = data.BidId.toString();
	if (data.Status.toString() == 'approve') {
		var bidStatus = 'A';
	} else {
		bidStatus = 'R';
	}
	try {
		//Update		
		var connection = $.db.getConnection();
		var pStmt = connection.prepareStatement("update \"ebidpoc.db::Tables.Bid\" set \"Status\" = '" + bidStatus + "' where \"BiddingId\" = '" + bidId +"';");
		var rs = pStmt.executeQuery();
		connection.commit();
		pStmt.close();
		return {
			"result": "1",
			"msg": "Status updated successfully"
		};
	} catch (err) {
		return {
			"result": "0",
			"msg": err.message
		};
	}
}

try {
	switch ($.request.method) {
		//Handle your GET calls here
	case $.net.http.GET:
		$.response.setBody(JSON.stringify(fnHandleGet()));
		break;
		//Handle your PUT calls here
	case $.net.http.POST:
		$.response.setBody(JSON.stringify(fnHandlePost()));
		break;
	default:
		break;
	}
} catch (err) {
	var msg =  JSON.stringify({
				"result": "0",
				"msg": "Failed to execute action: " + err.toString()
				}); 
	$.response.setBody(msg);
}