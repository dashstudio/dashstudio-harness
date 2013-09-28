define([ "dojo/_base/declare","dojo/store/Memory" ]
, function( declare, Memory )
{

// Design notes:
//  Should be an adapter to proxy data to CompoundStore
//
    return declare(	null, [Memory],
	{
		// summary:
        //      The store to navigate over OSIoT objects by smartobjectservice.com protocol.
        //      The RDF by URL defines the objects types and location using absolute or relative path.
		// example:
		//	| 	<div data-dojo-type="lib/com.smartobjectservice.com" data-dojo-props="url:'http://smartobjectservice.com:8000/'" ></div>


		// code from dijit.Tree mashed-in
		
		postCreate: function()
        {
			this.inherited(arguments);
		}

	});
});
