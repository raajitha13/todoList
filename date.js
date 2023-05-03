
module.exports.getDate = getDate;

var getDate = function() {
  let today = new Date();
  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };
  return  today.toLocaleDateString("en-US", options); //gives sunday,april 9
}

exports.getDay = getDay;

function getDay(){
  let today = new Date();
  const options = {
    weekday: 'long'
  };
  return today.toLocaleDateString("en-US", options); //gives sunday
}
