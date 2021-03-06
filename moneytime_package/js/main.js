//Check script loading
console.log('Loaded main.js');

//Ask background page for data
chrome.runtime.sendMessage({init: 'true'}, function(response) {
  console.log(response.msg);
  // setTimeout(convert(response.data), 6000);
  convert(response.data);
});


function convert(result){
console.log('Converting values...');
//converting the money values in the document to time value
    var body = document.getElementsByTagName('body');
    var bodyText = body[0].innerHTML;
    // console.log(bodyText);

    for(var i = 0; i < bodyText.length; i++){
        // console.log(bodyText[i]);

        //Found money?
        if(bodyText[i] == '$'){
            // console.log('Found money!');
            var moneyValue = '';
            var j = i + 1;

            //Start concatenating:
            while(
                //1. Is the this character a number?
                !isNaN(bodyText[j]) ||

                //2. Is it a dot, BUT NOT the first character? — avoid conflicts with AJAX
                (bodyText[j] == '.' && j > i + 1) &&

                //3. Have we reached the end?
                j < bodyText.length){

                // console.log('concatenating');
                moneyValue += bodyText[j]; //Concatenate
                j ++;
            }
            // console.log(moneyValue.length);
            //var timeValue = moneyValue * 10;
            if(moneyValue.length > 0){
                var timeValue = moneyValue / result;
                timeValue = Math.round(timeValue * 100) / 100;

                //now let's get the value of hours and minutes
                var timeHours = Math.floor(timeValue);
                var timeMinutes = (timeValue - timeHours) * 60;
                timeMinutes = Math.round(timeMinutes);
                if(timeHours > 0){
                    bodyText = bodyText.substring(0, i) + timeHours + ' h ' + timeMinutes + " min " + bodyText.substring(j);
                }else{
                    bodyText = bodyText.substring(0, i) + timeMinutes + " min " + bodyText.substring(j);
                }
            }

            //jump to next iteration
            i = j;
        }
    }

    // console.log(bodyText);
    body[0].innerHTML = bodyText;
}