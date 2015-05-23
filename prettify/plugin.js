/**
 * plugin.js
 *
 * Copyright, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 * @version  0.0.1
 */
'use strict';
tinymce.PluginManager.add('prettify', function(editor, url) {

    // 共享私有
    var data = {};

    var showDialog = function showDialog(){
      var selection = editor.selection, dom = editor.dom, selectedElm, anchorElm, initialText,classStr;

      //当前光标select
      selectedElm = selection.getNode();
      // 获取编辑的ele,去除无关的ele
      anchorElm = dom.getParent(selectedElm, 'pre.prettyprint');

      //获取文本
      data.prettify = initialText = anchorElm ? (anchorElm.innerText || anchorElm.textContent) : selection.getContent({format: 'text'});

      data.ele = anchorElm || '';
      data.dom = dom || '';

      //获取kind
      classStr = anchorElm ? dom.getAttrib(anchorElm, 'class') : '';

      if(classStr.indexOf('lang-js') > -1){
        data.kind = 'lang-js';
      }else if(classStr.indexOf('lang-css') > -1){
        data.kind = 'lang-css';
      }else if(classStr.indexOf('lang-html') > -1){
        data.kind = 'lang-html';
      }else if(classStr.indexOf('lang-php') > -1){
        data.kind = 'lang-php';
      }else {
        data.kind = '';
      }

      data.showline = '';

      if(classStr.indexOf('linenums') > -1){
        data.showline = 'linenums';
      }

    };
    // Add a button that opens a window
    editor.addButton('prettify', {
        text: 'prettify',
        icon: false,
        stateSelector: 'pre.prettyprint',
        onclick: function() {
            showDialog();
            // Open window
            editor.windowManager.open({
                title: 'prettify plugin',
                data:data,
                body: [
                    {
                      type:'listbox',
                      name:'kind',
                      label:'code class',
                      values:[
                      {text:'JavaScript',value:'lang-js'},
                      {text:'Css',value:'lang-css'},
                      {text:'HTML',value:'lang-html'},
                      {text:'PHP',value:'lang-php'}
                      ]
                    },
                    {
                      type:'listbox',
                      name:'showline',
                      label:'show line number',
                      values:[
                      {text:'showline',value:'linenums'},
                      {text:'noshowline',value:''}
                      ]
                    },
                    {type: 'textbox',
                     name: 'prettify',
                    label: 'prettify',
                    multiline: true,
                    minWidth: editor.getParam('code_dialog_width', 600),
                    minHeight: editor.getParam('code_dialog_height', Math.min(tinymce.DOM.getViewPort().h - 200, 500)),
                    spellcheck: false,
                    style: 'direction: ltr; text-align: left'
                  }
                ],
                onsubmit: function(e) {
                    if(data.ele !== ''){
                      data = tinymce.extend(data, e.data);

                      if ('innerText' in data.ele) {
                        data.ele.innerText = data.prettify;
                      } else {
                        data.ele.textContent = data.prettify;
                      }

                      data.dom.setAttribs(data.ele, {class:'prettyprint '+data.kind+' '+data.showline});
                      
                    }else{
                    // console.log(editor.contentWindow.document);
                    // Insert content when the window form is submitted
                    editor.insertContent('<pre class="prettyprint '+ e.data.kind +' '+ e.data.showline +'">' + e.data.prettify +'</pre>');
                    }
                }
            });
        }
    });

});