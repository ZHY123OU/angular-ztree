	app.directive('zTree', function($timeout, $parse) {
		return {
			restrict: 'AE',
			templateUrl: '/scripts/directive/zTreeDirective.html',
			replace: true,
			scope: {
				addNode: '&addNode', 						//���ӽڵ㷽��
				removeNode: '&removeNode', 			//ɾ���ڵ㷽��
				renameNode: '&renameNode', 			//�������ڵ㷽��
				touchData: '&touchData',				//������ڵ㴥��ҳ�淽��
				dropedData: '&dropedData', 			//�������ķ���
				zNodes: '=zNodes', 							//��������
				
				treename: '@treename', 					//�༭�������֣���֤ͬ��ҳ��������Ķ�����
				noDisplay: '=noDisplay', 				//���޸Ķ�Ӧ�����͵Ľڵ㲻����ʾ��Ӧ�Ĺ���
				dropDom: '&dropDom',    				//��ק������dom�󴥷��ķ���
				dontShow: '=dontShow',  				//������ʾ���ܴ�
				cantDropNode: '=cantDropNode',  //������ק������
				simpleData: '=simpleData',			//������
				cantEdit: '=cantEdit',					//�������༭
				onlyDom: '=onlyDom',						//ֻ�ܱ���ק������dom
				loadOtherData: '&loadOtherData',
				iconType: '=iconType',
				showDatatype: '=showDatatype',
				cantSearchType: '=cantSearchType'
			},
			link: function(scope, element, attrs) {

				//�л�ͼ��
				scope.changeIcon = function(data, parentNode) {
					
					var changeData = data? data: scope.iconType
					angular.forEach(changeData, function(val, key) {
						var node = zTree.getNodesByParam('DataType', key, parentNode)
						angular.forEach(node, function(nodeVal) {
							nodeVal.icon = '/contents/img/diy/' + val + '.png'
						})
					})
					
				}

				var setting = {
					treeNodeKey : "Id",
    			treeNodeParentKey : "pId",
					data: {
						simpleData: {
							enable: scope.simpleData,
							idKey: "Id",
							pIdKey: "pId",
						}
					},
					edit: {
						enable: !scope.cantEdit,
						showRemoveBtn: false,
						showRenameBtn: false,
						drag: {
							prev: dropPrev,
							inner: dropInner,
							next: dropNext,
						}
					},
					callback: {
						onRightClick: OnRightClick,
						onClick: onClick,
						beforeDrag: beforeDrag,
						beforeDrop: beforeDrop,
						onDrop: onDrop,
						beforeRename: beforeRename,
						onExpand: onExpand,
					}
				};
				$(element[0].children[2].children[0]).attr('id', scope.treename)

				var dropFalse;

			/*��קʱ���Ľ�������  ������exedit/drag_super.html ---START*/
				var log, className = "dark",
					curDragNodes, autoExpandNode;

				function beforeDrag(treeId, treeNodes) {

					//					className = (className === "dark" ? "":"dark");
					//					showLog("[ "+getTime()+" beforeDrag ]&nbsp;&nbsp;&nbsp;&nbsp; drag: " + treeNodes.length + " nodes." );
					for(var i = 0, l = treeNodes.length; i < l; i++) {
						if(treeNodes[i].drag === false) {
							curDragNodes = null;
							return false;
						} else if(treeNodes[i].parentTId && treeNodes[i].getParentNode().childDrag === false) {
							curDragNodes = null;
							return false;
						}
					}
					curDragNodes = treeNodes;
					return true;
				}
				var isInner = null;
				function beforeDrop(treeId, treeNodes) {
					if (scope.onlyDom) {
						return false
					}
				}

				function onDrop(e, treeId, treeNode, targetNode) {
//					var targetAttr = $(e.target).attr('z-drop-success')
//					var onDropCallback = $parse(targetAttr)
					if($(e.target).attr('zDroppable') !== undefined) {
//						$timeout(function() {
//							onDropCallback(scope, {$data: treeNode, $target: e})
//						})
						$timeout(function() {
							scope.dropDom({
								message: {data: treeNode[0], target: e, targetClassName: $(e.target).attr('class'), targetId: $(e.target).attr('id')}
							})
						})
						return true
					}

					var data = angular.copy(treeNode[0]);

					if (isInner) {
						data.pId = targetNode.id

					}else if(isInner === false) {
						data.pId = targetNode.getParentNode.id
//						data.pId =
					}else {
						return false
					}
					scope.dropedData({data: data})


				}

				function dropPrev(treeId, nodes, targetNode) {
					var isDroppable;
					angular.forEach(scope.cantDropNode, function(val, key) {
						angular.forEach(val, function(jugeVal) {
							if (targetNode[key] == jugeVal) {
								isDroppable = true
							}
						})
					})
					if(targetNode && isDroppable) {
						dropParentNode = null
						isInner = null
						return false;
					}
					isInner = false
					return true

				}

				function dropInner(treeId, nodes, targetNode) {
					var isDroppable;
					angular.forEach(scope.cantDropNode, function(val, key) {
						angular.forEach(val, function(jugeVal) {

							if (targetNode[key] == jugeVal) {

								isDroppable = true
							}
						})
					})
					if(targetNode && isDroppable) {
						dropParentNode = null
						isInner = null
						return false;
					}
					isInner = true
					return true

//					if(targetNode && targetNode.dropInner === false) {
//						return false;
//					} else {
//						for(var i = 0, l = curDragNodes.length; i < l; i++) {
//							if(!targetNode && curDragNodes[i].dropRoot === false) {
//								return false;
//							} else if(curDragNodes[i].parentTId && curDragNodes[i].getParentNode() !== targetNode && curDragNodes[i].getParentNode().childOuter === false) {
//								return false;
//							}
//						}
//					}
//					return true;
				}

				function dropNext(treeId, nodes, targetNode) {
					var isDroppable;
					angular.forEach(scope.cantDropNode, function(val, key) {
						angular.forEach(val, function(jugeVal) {
							if (targetNode[key] == jugeVal) {
								isDroppable = true
							}
						})
					})
					if(targetNode && isDroppable) {
						dropParentNode = null
						isInner = null
						return false;
					}
					isInner = true
					return true
				}
			/*��קʱ���Ľ�������    ---END*/

				function findParent(data) {
					var Database = data.getParentNode().getParentNode()
					console.log(Database.name, 'findParent')
					return Database.name
				}

				var treeData; // ��ȡ��ǰ����ڵ����Ϣ
				function onClick(treeId, treeNode) {
					var FilePath;
					treeData = angular.copy(zTree.getSelectedNodes()[0])
					
					if (treeData.DataType == 'Table') {
						FilePath = findParent(treeData)
					}else if (treeData.DataType == 'View') {
						FilePath = findParent(treeData)
					}else if (treeData.DataType == 'StoredProcedure') {
						FilePath = findParent(treeData)
					}
					//�жϵ���ڵ���Ƿ�ֵ  ��������������뱣����
					console.log(treeData, 'onClick')
					$timeout(function() {
						scope.touchData({
							data: {
								nodeData: treeData,
								FilePath: FilePath,
								treename: scope.treename
							}
						})
					})
					
					
				}

			/*��demo ������super/metro.html  --START*/

				//���� ���ܰ�ť
				function removeHoverDom(treeId, treeNode) {
					$("#addBtn_" + treeNode.tId).unbind().remove();
				};
			/*��demo --END*/

			/*DIY���  ������ super/diydom.html  --START*/
				var addObj;
				//��ʾ ���ܰ�ť
				function addHoverDom(treeId, treeNode) {
					if (scope.cantEdit || scope.dontShow) {
						return
					}
					var sObj = $("#" + treeNode.tId + "_span");
					if(treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
					var addStr = "<span class='button add' id='addBtn_" + treeNode.tId +
						"' title='add node' onfocus='this.blur();'></span>";
					sObj.append(addStr);
					var btn = $("#addBtn_" + treeNode.tId);
					if(btn) btn.bind("click", function(event) {

						//						if(!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
						//							zTree.cancelSelectedNode();
						//							showRMenu("root", event.clientX, event.clientY);
						//						} else if(treeNode && !treeNode.noR) {
						//							zTree.selectNode(treeNode);
						//							//��ʾ���ܴ�
						//							showRMenu("node", event.clientX, event.clientY);
						//						}
						showRMenu("node", event.clientX + 5, event.clientY + 5);
						addObj = {
							pId: treeNode.id,
							name: "�½��ļ���",
							isParent: true
						}

						return false;
					});
				}
			/*DIY���  --END*/

				function hasParent(data) {
					if (data.getParentNode()) {
						data.getParentNode().open = true
						return hasParent(data.getParentNode())
					}
					return data
				}

			/*������  --START*/

				///�����ı���Ĺؼ�����������Զ�ƥ�����ڽڵ� ����ģ������
				scope.findNodes = function(txtObj) {
					scope.resetTree();
					if(txtObj.length > 0) {
//						scope.resetTree();
//						var zTree = $.fn.zTree.getZTreeObj(scope.treename);
						var nodeList = zTree.getNodesByParamFuzzy("name", txtObj),
								accountObj = {},
								accountArr = []
								console.log(nodeList, 'nodeList')
						//������Ϊ��ѯ���������ݣ�
						for (var i = nodeList.length - 1; i >= 0; i--) {
							
							var tempNode = hasParent(nodeList[i])
							console.log(accountObj, 'accountObj', accountArr)
							if (accountObj[tempNode.id] == 'readyHave') {
								break
							}
							console.log(tempNode.id, 'nodeList[i]')
							accountArr.push(tempNode)
							accountObj[tempNode.id] = 'readyHave'
						}
						console.log(nodeList, 'nodeList', accountArr)
						//���ҵ���nodelist�ڵ������Ztree��
						//				                scope.zNodes = nodeList
						$.fn.zTree.init($("#" + scope.treename), setting, accountArr);
						scope.changeIcon(nodeList)
						//				                showMenu();
					}
				}
			
			/*������  --END*/

				var treename;
			/*�Ҽ������÷���  ������super/rightClickMenu.html  --START*/
				function OnRightClick(event, treeId, treeNode) {
					console.log(treeNode, 'rightClick')
					treename = treeNode.tId.split('_')[0]
					addObj = {
//						id: (100 + newCount),
						pId: treeNode.id,
						name: "�½��ļ���",
						isParent: true
					}
					console.log(treeNode, 'rightClick')
					if(!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
						zTree.cancelSelectedNode();
						showRMenu("root", event.clientX, event.clientY);
					} else if(treeNode && !treeNode.noR) {
						zTree.selectNode(treeNode);
						showRMenu("node", event.clientX, event.clientY);
					}
				}

				//��ʾ���ܴ�
				function showRMenu(type, x, y) {
					if (scope.cantEdit || scope.dontShow) {
						return
					}
					$("#rMenu ul").show();
					//					if(type == "root") {
					//						$("#m_del").hide();
					//						$("#m_check").hide();
					//						$("#m_unCheck").hide();
					//					} else {
					//						$("#m_check").show();
					//						$("#m_unCheck").show();
					//					}
					$('#rMenu li').each(function(val, index) {
						$(this).show()
					})
					if(scope.noDisplay) {
						angular.forEach(scope.noDisplay, function(val, index) {
							if(zTree.getSelectedNodes()[0].DataType == val.DataType) {
								angular.forEach(val.cantShow, function(cVal, cIndex) {
									if(cVal == 'add') {
										$("#m_add").hide()
									} else if(cVal == 'remove') {
										$('#m_del').hide()
									} else if(cVal == 'rename') {
										$('#m_rename').hide()
									}
								})
							}
						})
					}

					y += document.body.scrollTop;
					x += document.body.scrollLeft;
					rMenu.css({
						"top": y + "px",
						"left": x + "px",
						"visibility": "visible"
					});

					$("body").bind("mousedown", onBodyMouseDown);
				}

				function hideRMenu() {
					if(rMenu) rMenu.css({
						"visibility": "hidden"
					});
					$("body").unbind("mousedown", onBodyMouseDown);
				}

				function onBodyMouseDown(event) {
					if(!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length > 0)) {
						rMenu.css({
							"visibility": "hidden"
						});
					}
				}


				var addCount = 1;

				scope.addTreeNode = function(data, isExpand) {
					console.log(isExpand, 'isExpand')
					if (isExpand) {
						zTree.addNodes(node, data.data);
					}
					hideRMenu();
					var newNode = {
						name: "",
						isParent: true
					};
					var node = zTree.getSelectedNodes()[0]
					if(node) {
						if (data.type == 'folder') {
//							var
							console.log(data, 'addTreeNode', node)
//							newNode.checked = node.checked;
							zTree.addNodes(node, data.data);
							zTree.cancelSelectedNode()
//								var node = zTree.transformTozTreeNodes(data)
								zTree.selectNode(zTree.transformTozTreeNodes(data.data))
								renameTreeNode()
						}

					} else {
						zTree.addNodes(null, data);
					}
					resetData()
				}

				scope.$on('SaveAs', function(event, data) {
					if (data.treename == scope.treename) {
						zTree.addNodes(zTree.getNodesByParamFuzzy('id', data.Id)[0], data.data)
						resetData()
					}
					
				})
				scope.$on('AddFile', function(event, data) {
					if (data.treename == scope.treename) {
						scope.addTreeNode(data)
					}
				})
				scope.$on('otherLoading', function(event, data) {
					if (data.treename == scope.treename) {
						zTree.addNodes(data.node, data.data);
						scope.changeIcon(data.icon, data.node)
						resetData()
					}
				})
				//ͬ����������
				scope.$on('resetTreeData', function(event, data) {
					resetData()
				})
				//������������
				scope.$on('resetZtree', function(event, data) {
					if (data == scope.treename) {
						scope.resetTree()
					}
					
				})
				
				var isReset = false;
				function resetData() {
					scope.zNodes = zTree.getNodes()
						isReset = true
				}

				function onExpand(event, treeId, treeNode) {
					scope.loadOtherData({data: treeNode})
				}

				function addTreeNodeAjxFun() {
					scope.addNode({data: addObj})
				}

				function removeTreeNode() {
					hideRMenu();
					var nodes = zTree.getSelectedNodes();
					console.log(nodes, 'removeTreeNode', scope.treename)
					if(nodes && nodes.length > 0) {
						if(nodes[0].children && nodes[0].children.length > 0) {
							var msg = "Ҫɾ���Ľڵ��Ǹ��ڵ㣬���ɾ������ͬ�ӽڵ�һ��ɾ����\n\n��ȷ�ϣ�";
							if(confirm(msg) == true) {
								zTree.removeNode(nodes[0]);
							}
						} else {
							zTree.removeNode(nodes[0]);
						}
						scope.removeNode({data: nodes[0]})
					}

				}

				function renameTreeNode() {
					hideRMenu();
					console.log('renameTreeNode')
					var nodes = zTree.getSelectedNodes();
					if(zTree.getSelectedNodes()[0]) {
						zTree.editName(zTree.getSelectedNodes()[0])

					}
				}
				function beforeRename(treeId, treeNode, newName) {
					console.log('beforeRename')

					scope.renameNode({data: treeNode})
				}

				scope.resetTree = function() {
					hideRMenu();
					var openNodes = zTree.getNodesByParam('open', true)
					$.fn.zTree.init($("#" + scope.treename), setting, scope.zNodes);
					angular.forEach(openNodes, function(val) {
							zTree.expandNode(val, true)
							console.log(val, 'openNode')
					})
					
					console.log('already setted')
				}
			/*�Ҽ������÷���  --END*/
				var zTree, rMenu;
				$(document).ready(function() {
					$.fn.zTree.init($('#' + scope.treename), setting, scope.zNodes);

					$('#m_add').bind('click', addTreeNodeAjxFun)
					$('#m_del').bind('click', removeTreeNode)
					$('#m_rename').bind('click', renameTreeNode)
					//
		        	zTree = $.fn.zTree.getZTreeObj(scope.treename);
		        	console.log(zTree, 'zTree')
		        	scope.changeIcon(scope.zNodes)
		        	rMenu = $("#rMenu");
				})
				scope.$watch(
					function() {
						return scope.zNodes
					},
					function(newVal, oldVal) {
						if (!isReset) {
//							console.log('reset', scope.treename)
							isReset = true
							return
						}
						console.log(newVal, 'newVal')
						$.fn.zTree.init($('#' + scope.treename), setting, newVal);
						scope.changeIcon()

						//		        	$('#m_add').bind('click', addTreeNode)
						//		        	$('#m_del').bind('click', removeTreeNode)
						//		        	$('#m_rename').bind('click', renameTreeNode)
						//		        	$('#m_check').bind('click', checkTreeNode, true)
						//		        	$('#m_unCheck').bind('click', checkTreeNode, false)
						//		        	$('#m_reset').bind('click', scope.resetTree)

						zTree = $.fn.zTree.getZTreeObj(scope.treename);
						
						rMenu = $("#rMenu");
					})

			}
		}
	})
