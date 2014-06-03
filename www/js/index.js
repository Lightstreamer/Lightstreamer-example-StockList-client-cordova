/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        
        this.setupLightstreamer();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    
    setupLightstreamer: function() {
      //setup the lightstreamer connection
      var lsClient = new Lightstreamer.LightstreamerClient("http://push.lightstreamer.com","DEMO");
      lsClient.addListener({
        onStatusChange: function(newStatus) {
          //update the connection status on the UI
          document.getElementById("connection_status").innerHTML = newStatus;
        }
      });
      lsClient.connect();

      //prepare the grid
      var grid = new Lightstreamer.DynaGrid("stocks",true);
      grid.setSort("stock_name");
      grid.addListener({
        onVisualUpdate: function(key,info) {
          if (info == null) {
            return; //cleaning
          }
          info.setHotTime(500);
          info.setHotToColdTime(300);
          info.setAttribute("#F7941E", "transparent", "backgroundColor");
          info.setAttribute("white", "black", "color");
        }
      });
      
      //prepare the subscription and bind it to the grid
      var sub = new Lightstreamer.Subscription("MERGE",["item3","item4","item5","item6","item7"],grid.extractFieldList()); 
      sub.addListener(grid);
      sub.setDataAdapter("QUOTE_ADAPTER");
      sub.setRequestedSnapshot("yes");

      lsClient.subscribe(sub);
      
    }
};
