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
      Lightstreamer.LightstreamerClient.setLoggerProvider(new Lightstreamer.ConsoleLoggerProvider(Lightstreamer.ConsoleLogLevel.WARN));

      //setup the lightstreamer connection
      var lsClient = new Lightstreamer.LightstreamerClient("https://push.lightstreamer.com","DEMO");
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
      var sub = new Lightstreamer.Subscription("MERGE",["item3","item4","item5","item6","item7","item8","item9"],grid.extractFieldList()); 
      sub.addListener(grid);
      sub.setDataAdapter("QUOTE_ADAPTER");
      sub.setRequestedSnapshot("yes");

      lsClient.subscribe(sub);
      
    }
};
