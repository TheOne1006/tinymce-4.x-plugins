/**
 * plugin.js
 *
 * Copyright, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */
'use strict';
tinymce.PluginManager.add('tabset', function(editor, url) {

    // 共享私有
    var data = {};

    var showDialog = function showDialog(){
      var selection = editor.selection, dom = editor.dom, selectedElm, anchorElm,classStr ,justified, queryAnchorElem;
      //当前光标select
      selectedElm = selection.getNode();
      // 获取编辑的ele,去除无关的ele
      anchorElm = dom.getParent(selectedElm, 'tabset');

      classStr = anchorElm ? dom.getAttrib(anchorElm, 'class') : '';

      justified = anchorElm ? dom.getAttrib(anchorElm,'justified'):'';

      if(justified !== ''){
        data.justified = justified;
      }

      // intabset
      if(anchorElm){
        queryAnchorElem = dom.$(anchorElm);
        var tabs = queryAnchorElem.find('tab'),initkey  = 1;

        data.ele = anchorElm;
        data.tabs = tabs;


        tinymce.each(tabs, function(item){

          data['heading'+initkey] = dom.getAttrib(item, 'heading') || '';
          data['content'+initkey] = item.innerText || item.textContent;

          initkey += 1;
        });

      }

      console.log(dom);


      console.log(anchorElm);

    };

    // Add a button that opens a window
    editor.addButton('tabset', {
        text: 'tabset',
        bodyType: 'tabpanel',
        icon: false,
        stateSelector: 'tabset',
        onclick: function() {
            showDialog();
            // Open window
            editor.windowManager.open({
                title: 'tabset plugin',
                data:data,
                minWidth: editor.getParam('code_dialog_width', 500),
                body: [
                    {
                      type:'listbox',
                      name:'justified',
                      label:'consistent width',
                      values:[
                      {text:'consistent',value:'true'},
                      {text:'default',value:'false'}
                      ]
                    },{
                      name:'heading1',type:'textbox',label:'heading-tab1'
                    },{
                      name:'content1',type:'textbox',label:'content-tab1',multiline: true,minHeight:50,
                      style:'margin-bottom:20px;border-bottom:2px solid blue'
                    },{
                      name:'heading2',type:'textbox',label:'heading-tab2'
                    },{
                      name:'content2',type:'textbox',label:'content-tab2',multiline: true,minHeight:50,
                        style:'margin-bottom:20px;border-bottom:2px solid blue'
                    },{
                      name:'heading3',type:'textbox',label:'heading-tab3'
                    },{
                      name:'content3',type:'textbox',label:'content-tab3',multiline: true,minHeight:50,
                        style:'margin-bottom:20px;border-bottom:2px solid blue'
                  }
                ],
                onsubmit: function(e){

                  if(data.ele !== '' && data.tabs && data.tabs.length !== 0){
                    // 修改
                    var dom = editor.dom,initkey = 1;
                    dom.setAttrib(data.ele,'justified', e.data.justified);

                    tinymce.each(data.tabs, function(item){

                      if(e.data['heading'+initkey] && e.data['content'+initkey]){
                        dom.setAttrib(item, 'heading', e.data['heading'+initkey]);
                        item.innerText = e.data['content'+initkey];
                      }else{
                        dom.$(data.ele).find('tab:last').remove();
                      }
                        initkey += 1;
                    });



                  }else if(e.data.heading1 && e.data.content1){
                    // 添加

                    var htmlStr = '<tabset justified='+e.data.justified+'>';
                    htmlStr += '<tab heading='+e.data.heading1+'>'+e.data.content1+'</tab>';

                    if(e.data.heading2 && e.data.content2) {
                       htmlStr += '<tab heading='+e.data.heading2+'>'+e.data.content2+'</tab>';
                    }

                    if(e.data.heading3 && e.data.content3) {
                       htmlStr += '<tab heading='+e.data.heading3+'>'+e.data.content3+'</tab>';
                    }

                    htmlStr += '</tabset><p></p>';
                    editor.insertContent(htmlStr);
                  }

                }
            });
        }
    });

});