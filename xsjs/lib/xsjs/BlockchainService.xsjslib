function postData(oBiddingRecord){
	var dest = $.net.http.readDestination("EXTERNAL_HTTP");
	var client = new $.net.http.Client();
	var query = 'SELECT * FROM \"ebidpoc.db::Tables.Conguration\"';
	var conn = $.db.getConnection();
	if(conn){
		var oStatement = conn.prepareStatement(query);
		var oResultSet = oStatement.executeQuery();
	}
	while (oResultSet.next()){
		var key = oResultSet.getString(1);
		var value = oResultSet.getString(3);
		if( key == 'chainHost'){
			var chainHost = value;
		}else if(key == 'path'){
			var path = value;
		}else if(key == 'apikey'){
			var apikey = value;
		}
	}
	oResultSet.close();
	oStatement.close();
	conn.close();
	
	var client = new $.net.http.Client();
	var request = new $.net.http.Request($.net.http.POST,path);
	request.headers.set("Content-Type", "application/json");
	request.headers.set("apikey", apikey);
	var recordString = JSON.stringify(oBiddingRecord);
	var oPublishBody = {"method": "publish", "params": ["BiddingRecords", oBiddingRecord.biddingId, $.util.codec.encodeHex(recordString)]};
	var oCreateBody = {"method": "create", "params": ["stream", "BiddingRecords", true]};
	// Create stream firstly
	request.setBody(JSON.stringify(oCreateBody));
	client.request(request,dest);
	// Publish data to chain
	request.setBody(JSON.stringify(oPublishBody));
	client.request(request,dest);
	var response = client.getResponse();
	return response.status;
	// $.response.status = response.status;
	// $.response.contentType = "application/json";	
	// $.response.setBody(response.body.content);
}
function postDataToChain(biddingId,bidderId,timeStamp,price,currency){
	try{
		var statusCode = postData(biddingId,bidderId,timeStamp,price,currency);
		return statusCode;
	}catch (e){
	     var errorResponse = {"error": e.toString()};
	     var statusCode = $.net.http.INTERNAL_SERVER_ERROR;
	     //$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	     //$.response.contentType = "application/json";
	     //$.response.setBody(JSON.stringify(errorResponse));
	    return statusCode;
	}
}
