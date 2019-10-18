/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";

  $.trace.debug("Entered create test function...");	
// $.import("xsjs", "session");
// var SESSIONINFO = $.xsjs.session;

/**
@param {connection} Connection - The SQL connection used in the OData request
@param {beforeTableName} String - The name of a temporary table with the single entry before the operation (UPDATE and DELETE events only)
@param {afterTableName} String -The name of a temporary table with the single entry after the operation (CREATE and UPDATE events only)
*/
function biddingCreate(param){
  $.trace.debug("Entered create test function...");	
	var after = param.afterTableName;    

	//Get Input New Record Values
	var	pStmt = param.connection.prepareStatement("select * from \"" + after + "\"");
	var bidDt = pStmt.executeQuery();
	// var User = SESSIONINFO.recordSetToJSON(pStmt.executeQuery(), "Details");
	pStmt.close();
	//Validate Email
	// if(!validateEmail(User.Details[0].Email)){
	// 	throw "Invalid email for "  + Bid.bidding[0].FirstName +  
 //       " No Way! E-Mail must be valid and " + Bid.bidding[0].Email + " has problems";
	// }

	//Get Next Personnel Number
	  pStmt = param.connection.prepareStatement("select \"ebidpoc.db.sequences::biddingSeqId\".NEXTVAL from dummy");
		var rs = pStmt.executeQuery();
	 //var BiddingId = bidDt[0].BiddingId.toString() + 1;
	 var BiddingId = "";
	  while (rs.next()) {
	  	BiddingId = rs.getString(1);
	 }
	 pStmt.close();
	//Insert Record into DB Table and Temp Output Table
	for( var i = 0; i<2; i++){
		var pStmt;
		if(i<1){
			pStmt = param.connection.prepareStatement("insert into \"ebidpoc.db::Tables.Bid\" values(?,?,?,?,?,?,?,?,?,?,?,?)" );			
		}else{
			pStmt = param.connection.prepareStatement("TRUNCATE TABLE \"" + after + "\"" );
			pStmt.executeUpdate();
			pStmt.close();
			pStmt = param.connection.prepareStatement("insert into \"" + after + "\" values(?,?,?,?,?,?,?,?,?,?,?,?)" );		
		}
		// pStmt.setString(1, bidDt._rows[0].BiddingId.toString());
		pStmt.setString(1, BiddingId.toString());
		pStmt.setString(2, bidDt._rows[0][1].toString());	
		pStmt.setString(3, bidDt._rows[0][2].toString());
		pStmt.setString(4, bidDt._rows[0][3]);
		pStmt.setString(5, bidDt._rows[0][4]);
		pStmt.setString(6, bidDt._rows[0][5]);
		pStmt.setString(7, bidDt._rows[0][6].toString());
		pStmt.setString(8, bidDt._rows[0][7].toString());
		pStmt.setString(9, bidDt._rows[0][8].toString());
		pStmt.setString(10, bidDt._rows[0][9].toString());  //Created By
		pStmt.setString(11, bidDt._rows[0][10].toString());  //Bid Personnel
		pStmt.setString(12, bidDt._rows[0][11].toString());  //Bid Manager
		pStmt.executeUpdate();
		pStmt.close();
	}

}

function biddingUpdate(param){
  $.trace.debug("Entered create test function...");	
	var after = param.afterTableName;    

	//Get Input New Record Values
	var	pStmt = param.connection.prepareStatement("select * from \"" + after + "\"");
	var bidDt = pStmt.executeQuery();
	// var User = SESSIONINFO.recordSetToJSON(pStmt.executeQuery(), "Details");
	pStmt.close();
	//Validate Email
	// if(!validateEmail(User.Details[0].Email)){
	// 	throw "Invalid email for "  + Bid.bidding[0].FirstName +  
 //       " No Way! E-Mail must be valid and " + Bid.bidding[0].Email + " has problems";
	// }

	//Insert Record into DB Table and Temp Output Table
	for( var i = 0; i<2; i++){
		var pStmt;
		if(i<1){
			pStmt = param.connection.prepareStatement("update \"ebidpoc.db::Tables.Bid\" set \"Title\" = (?), \"Context\" = (?) where \"BiddingId\" = (?)" );			
		}else{
			pStmt = param.connection.prepareStatement("TRUNCATE TABLE \"" + after + "\"" );
			pStmt.executeUpdate();
			pStmt.close();
			pStmt = param.connection.prepareStatement("insert into \"" + after + "\" values(?,?,?,?,?,?,?,?,?,?,?,?)" );		
		}
		// pStmt.setString(1, bidDt._rows[0].BiddingId.toString());
		pStmt.setString(1, bidDt._rows[0].Title.toString());	
		pStmt.setString(2, bidDt._rows[0].Context.toString());
		pStmt.setString(3, bidDt._rows[0].BiddingId.toString());
		// pStmt.setString(5, bidDt._rows[0].EndDate);
		// pStmt.setString(6, bidDt._rows[0].BiddingOpeningDate);
		// pStmt.setString(7, bidDt._rows[0].InitialPrice.toString());
		// pStmt.setString(8, bidDt._rows[0].Currency.toString());
		// pStmt.setString(9, bidDt._rows[0].Status.toString());
		pStmt.executeUpdate();
		pStmt.close();
	}
}

function biddingDelete(param){
  $.trace.debug("Entered create test function...");	
	var after = param.beforeTableName;    

	//Get Input New Record Values
	var	pStmt = param.connection.prepareStatement("select * from \"" + after + "\"");
	var bidDt = pStmt.executeQuery();
	// var User = SESSIONINFO.recordSetToJSON(pStmt.executeQuery(), "Details");
	pStmt.close();
	//Validate Email
	// if(!validateEmail(User.Details[0].Email)){
	// 	throw "Invalid email for "  + Bid.bidding[0].FirstName +  
 //       " No Way! E-Mail must be valid and " + Bid.bidding[0].Email + " has problems";
	// }


	//Insert Record into DB Table and Temp Output Table
	for( var i = 0; i<2; i++){
		var pStmt;
		if(i<1){
			pStmt = param.connection.prepareStatement("delete from \"ebidpoc.db::Tables.Bid\" where \"BiddingId\" = (?)" );			
		}else{
			pStmt = param.connection.prepareStatement("TRUNCATE TABLE \"" + after + "\"" );
			pStmt.executeUpdate();
			pStmt.close();
			pStmt = param.connection.prepareStatement("insert into \"" + after + "\" values(?,?,?,?,?,?,?,?,?,?,?,?)" );		
		}
		// pStmt.setString(1, bidDt._rows[0].BiddingId.toString());
		pStmt.setString(1, bidDt._rows[0].BiddingId.toString());
		// pStmt.setString(2, bidDt._rows[0].Title.toString());	
		// pStmt.setString(3, bidDt._rows[0].Context.toString());
		// pStmt.setString(4, bidDt._rows[0].StartDate);
		// pStmt.setString(5, bidDt._rows[0].EndDate);
		// pStmt.setString(6, bidDt._rows[0].BiddingOpeningDate);
		// pStmt.setString(7, bidDt._rows[0].InitialPrice.toString());
		// pStmt.setString(8, bidDt._rows[0].Currency.toString());
		// pStmt.setString(9, bidDt._rows[0].Status.toString());
		pStmt.      
		pStmt.executeUpdate();
		pStmt.close();
	}
}

function bidderCreate(param){
	var after = param.afterTableName;    
	//Get Input New Record Values
	var	pStmt = param.connection.prepareStatement("select * from \"" + after + "\"");
	var bidDt = pStmt.executeQuery();
	// var User = SESSIONINFO.recordSetToJSON(pStmt.executeQuery(), "Details");
	pStmt.close();
	//Validate Email
	// if(!validateEmail(User.Details[0].Email)){
	// 	throw "Invalid email for "  + Bid.bidding[0].FirstName +  
 //       " No Way! E-Mail must be valid and " + Bid.bidding[0].Email + " has problems";
	// }

	//Get Next Personnel Number
	  pStmt = param.connection.prepareStatement("select \"ebidpoc.db.sequences::bidderSeqId\".NEXTVAL from dummy");
		var rs = pStmt.executeQuery();
	 //var BiddingId = bidDt[0].BiddingId.toString() + 1;
	 var BidderId = "";
	  while (rs.next()) {
	  	BidderId = rs.getString(1);
	 }
	 pStmt.close();
	//Insert Record into DB Table and Temp Output Table
	for( var i = 0; i<2; i++){
		var pStmt;
		if(i<1){
			pStmt = param.connection.prepareStatement("insert into \"ebidpoc.db::Tables.Bidder\" values(?,?,?)" );			
		}else{
			pStmt = param.connection.prepareStatement("TRUNCATE TABLE \"" + after + "\"" );
			pStmt.executeUpdate();
			pStmt.close();
			pStmt = param.connection.prepareStatement("insert into \"" + after + "\" values(?,?,?)" );		
		}
		// pStmt.setString(1, bidDt._rows[0].BiddingId.toString());
		pStmt.setString(1, BidderId.toString());
		pStmt.setString(2, bidDt._rows[0][0].toString());	
		pStmt.setString(3, bidDt._rows[0][1].CreateDate);
		pStmt.executeUpdate();
		pStmt.close();
	}
}