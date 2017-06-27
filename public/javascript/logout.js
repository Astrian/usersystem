var app = new Vue({
  el: '.vue'
})

function init() {
  app.$http.post('/interface/logout',{},{
    "Content-Type": "application/json"
  }).then(res => {
    window.location = '/'
  }, res => {
    window.location = '/'
  });

}
init()
