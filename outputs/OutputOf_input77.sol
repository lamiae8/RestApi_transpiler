pragma solidity ^0.4.21; // What compiler to use

contract policies {
	
	struct attribute {
		string id_;
		string type_;
		string category_;
	}







	constructor () public { 
		attribute actionId ;
		actionId.category_ = "actionCat" ;
		actionId.id_ = "actionId" ;
		actionId.type_ = "string" ;

		attribute resourceType ;
		resourceType.category_ = "resourceCat" ;
		resourceType.id_ = "resourceType" ;
		resourceType.type_ = "string" ;

		attribute amount ;
		amount.category_ = "resourceCat" ;
		amount.id_ = "amount" ;
		amount.type_ = "double" ;

		attribute limit ;
		limit.category_ = "subjectCat" ;
		limit.id_ = "limit" ;
		limit.type_ = "double" ;


	}


}




 // End of translation