define([ "dojo/_base/declare","dijit/layout/AccordionContainer" ]
, function( declare, AccordionContainer )
{

// Design notes:
//
// An AccordionContainer coupled with ForestStoreModel for panels and child branches inside as tree w/ ForestStoreModel.
//
    return declare(	"lib/AccordionTree", [AccordionContainer],
	{
		// summary:
		//		Holds a set of panes where every pane's title is visible, but only one pane's content is visible at a time,
		//		and switching between panes is visualized by sliding the other panes up/down.
		// example:
		//	| 	<div data-dojo-type="dojox.data.XmlStoreXPath"   data-dojo-id="ObjectsTreeStore"	data-dojo-props="url:'ObjectTree.xml',label:'text',attributeMap:{'text':'@name'}" ></div>
		//	|	<div dojoType="dijit.tree.ForestStoreModel" jsId="ObjectsTreeModel"			store="ObjectsTreeStore" query="{XPath:'/root/*'}" childrenAttrs="childNodes" ></div>
		//	|	<div data-dojo-type="dojoPlay2011.AccordionTree" id="AccordionTree1" data-dojo-props="model:ObjectsTreeModel,dndController:dijit.tree.dndSource" </div>


		// code from dijit.Tree mashed-in
		
		postCreate: function(){

			// Create glue between store and Tree, if not specified directly by user
			if(!this.model){
				this._store2model();
			}

			// monitor changes to items
			this.connect(this.model, "onChange", "_onItemChange");
			this.connect(this.model, "onChildrenChange", "_onItemChildrenChange");
			this.connect(this.model, "onDelete", "_onItemDelete");

			this._load();

			this.inherited(arguments);

			if(this.dndController){
				if(dojo.isString(this.dndController)){
					this.dndController = dojo.getObject(this.dndController);
				}
				var params={};
				for(var i=0; i<this.dndParams.length;i++){
					if(this[this.dndParams[i]]){
						params[this.dndParams[i]] = this[this.dndParams[i]];
					}
				}
				this.dndController = new this.dndController(this, params);
			}
		},

		_store2model: function(){
			// summary:
			//		User specified a store&query rather than model, so create model from store/query
			this._v10Compat = true;
			dojo.deprecated("Tree: from version 2.0, should specify a model object rather than a store/query");

			var modelParams = {
				id: this.id + "_ForestStoreModel",
				store: this.store,
				query: this.query,
				childrenAttrs: this.childrenAttr
			};

			// Only override the model's mayHaveChildren() method if the user has specified an override
			if(this.params.mayHaveChildren){
				modelParams.mayHaveChildren = dojo.hitch(this, "mayHaveChildren");
			}

			if(this.params.getItemChildren){
				modelParams.getChildren = dojo.hitch(this, function(item, onComplete, onError){
					this.getItemChildren((this._v10Compat && item === this.model.root) ? null : item, onComplete, onError);
				});
			}
			this.model = new dijit.tree.ForestStoreModel(modelParams);

			// For backwards compatibility, the visibility of the root node is controlled by
			// whether or not the user has specified a label
			this.showRoot = Boolean(this.label);
		},
		_load: function(){
			// summary:
			//		Initial load of the tree.
			//		Load root node (always hidden) and it's children.
			
			this.model.getRoot(
				dojo.hitch(this, function(item){
					this.model.getChildren(
						item
						, dojo.hitch(this,function(items){
								for(var i=0;i<items.length;i++)
									this.AddItem(items[i],i);
							})
						, function(err){
							console.error(this, ": error loading children: ", err);
					});
				}),
				function(err){
					console.error(this, ": error loading root: ", err);
				}
			);
		},
		getLabel: function(/*dojo.data.Item*/ item){
			// summary:
			//		Overridable function to get the label for a tree node (given the item)
			// tags:
			//		extension
			return this.model.getLabel(item);	// String
		},

		//////////////// Events from the model //////////////////////////
		AddItem: function(/* dojo.data */ item, /* int */ index ){
			// summary:
			//		Callback when a node is available. Default implementation creates subtree 
			// tags:
			//		callback

	//		this.addChild(new dijit.layout.ContentPane({
	//			title: this.getLabel(item),
	//			content: "Hi!"
	//		}));

			var store = this.model.store;
			var tagName = store.getValue(item,"tagName");
			var treeModel = new dijit.tree.ForestStoreModel({
				store: store
				,query: {XPath:this.model.query.XPath+"[name()='"+tagName+"']/*"}
				,childrenAttrs: this.model.childrenAttrs
			});

			var content = new dijit.Tree({
					model: treeModel
					,title: this.getLabel(item)
					,showRoot:false
				},this.id+"PanelTree"+index);

			this.addChild(content);
		},

		_onItemChange: function(/*Item*/ item){
			// summary:
			//		Processes notification of a change to an item's scalar values like label
			console.error(this, "Not implemented yet");	
		},

		_onItemChildrenChange: function(/*dojo.data.Item*/ parent, /*dojo.data.Item[]*/ newChildrenList){
			// summary:
			//		Processes notification of a change to an item's children
			console.error(this, "Not implemented yet");	
		},

		_onItemDelete: function(/*Item*/ item){
			// summary:
			//		Processes notification of a deletion of an item
			console.error(this, "Not implemented yet");	
		}
	});
});
