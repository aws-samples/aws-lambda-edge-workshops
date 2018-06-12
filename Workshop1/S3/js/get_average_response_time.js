$(document).ready(function(){
  var timeTaken = [];
  var totalTime = 0;

  /* Disable browser caching */
  $.ajaxSetup({ cache: false });

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function printTimeTaken() {
    for (var i = 0; i < 10; i++) {
      var startTime = new Date().getTime();
      var sleepTime = i === 0 ? 5500 : 3500;

      $.get("/card/960w/da8398f4.jpg").done(function(){
          timeTaken[i] = (new Date().getTime() - startTime);
          totalTime += timeTaken[i];
          $("#time_results").append("Request No. <b>" + (i+1) +"</b>, TimeTaken: <b>" + timeTaken[i] + " ms</b><br>");
      });
      await sleep(sleepTime);
    }
    $("#time_results").append("================================<br>Average Response Time: <b>" + totalTime/timeTaken.length + " ms</b><br>================================<br>");
  }

  printTimeTaken();
});