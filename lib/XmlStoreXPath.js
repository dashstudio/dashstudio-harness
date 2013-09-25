define([  "dojo/_base/declare", "dojox/data/XmlStore" ], function( declare, XmlStore )
{
    return declare( "lib/XmlStoreXPath", [XmlStore],
    {
        _getItems: function( document, request )
        {
            var xPath	= request.query.XPath;
            if( !xPath )
                return this.inherited( arguments );
            var de		= document.documentElement;
            var u		= "undefined";
            var nodes	= [];

            if( u != typeof de.selectNodes )// IE
                nodes = de.selectNodes(xPath);
            else
            if(    u != typeof XPathEvaluator		// WebKit
                || u != typeof document.evaluate )	// FF
            {
                var evaluator = (u != typeof XPathEvaluator) ? new XPathEvaluator(): document;
//			var xpr = evaluator.evaluate( xPath, de, null,  0, null ); // XPathResult.ANY_TYPE = 0
//			for( var n = xpr.iterateNext(); n ; n = xpr.iterateNext() )
//				nodes.push( n );
                var xpr = evaluator.evaluate( xPath, de, null,  6, null ); // XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE = 6
                for( var i = 0; i < xpr.snapshotLength ; i++ )
                    nodes.push( xpr.snapshotItem(i) );
            }else
                throw new Error( this.declaredClass + " is not supported for document type", document );

            var ret = [];
            for( var i=0; i< nodes.length; i++ )
                ret.push( this._getItem(nodes[i]) );

            return ret;
        }
    });
});
