// Delegate .transition() calls to .animate()
// if the browser can't do CSS transitions.
if (!$.support.transition)
    $.fn.transition = $.fn.animate;
// APPLICATION
var app = angular.module("application",[]);
// IMAGE LOADER DIRECTIVE
app.directive("imageLoader",function(){
  return function(scope,element,attrs){
    $.cssEase.bounce = 'cubic-bezier(0,1,0.5,1.3)';
    element.on("load",function(event){
      console.log("load");
      element.css({"scale":0,"opacity":0});
      element.transition({scale:1,opacity:0.8},750,"bounce");
  });
};
});
app.directive("imageLoaderFade",function(){
  return function(scope,element,attrs){
    element.on("load",function(event){
        element.transition({opacity:0},0).transition({opacity:1},300);
    });
};
});
// IMAGE HOVER DIRECTIVE
app.directive("imageHover",function(){
  return function(scope,element,attrs){
    element.on("mouseover",function(){
      element.transition({scale:1.2,opacity:1},200,"in");
  });
    element.on("mouseout",function(){
      element.transition({scale:1,opacity:0.8},200,"out");
  });
};
});
app.directive("appModal",function(){
    return function(scope,element,attrs){
        var modal =attrs.appModal;
        element.on("click",function(){
          $(modal).modal("show");
      });
    };
});

// FlickSearchController
var FlickSearchController=function($scope,$http){
    $scope.rpp = 20;
    $scope.menuVisible = "hide menu";
    $scope.historyVisible ="show history";
    $scope.bodyClass = "dark";
    $scope.showMenu = function(v){
        if(v=="show menu"){
            v="hide menu";
        }else{
            v="show menu";
        }
        $scope.menuVisible = v;
    };
    $http({cache:true});
    $scope.apiKey = window.localStorage.getItem("apiKey") || "a47e50dcce48c46c58f9b8c622c42a18";
    $scope.keyword= null;
    $scope.getNextImage = function(){
        $scope.selectedImageIndex = ($scope.selectedImageIndex+1) %  $scope.images.length;
        $scope.selectedImage = $scope.selectedImage = $scope.images[$scope.selectedImageIndex];
    };  
    $scope.getPreviousImage = function(){
        $scope.selectedImageIndex = ($scope.selectedImageIndex-1) %  $scope.images.length;
        $scope.selectedImage = $scope.selectedImage = $scope.images[$scope.selectedImageIndex];
    };
    $scope.setSelectedImage = function(index){
        $scope.selectedImageIndex = index;
        $scope.selectedImage = $scope.images[index];
    };
    $scope.getFromLocalStorage=function(key,value){
        return window.localstorage.getItem(key,value);
    };
    $scope.setToLocalStorage = function(key,value){
        // set apikey to localstorage doesnt seem to work though
        window.localStorage.setItem(key,value);
    };
    var makePhotoURL =function(farmId,serverId,id,secret,format){

        // make image url from flickR object
        return "http://farm"+farmId+".staticflickr.com/"+serverId+"/"+id+"_"+secret+"_"+format+".jpg";
    };

    var makeApiString = function(keyword,apiKey,resultsPerPage){
        // get the request url
        resultsPerPage = resultsPerPage || 20;
        var str =  "http://api.flickr.com/services/rest/?"+
        "method=flickr.photos.search"+
        "&is_getty=true"+
        "&tags="+keyword+
        "&api_key="+apiKey+
        "&text="+keyword+
        "&format=json&per_page="+resultsPerPage+
        "&jsoncallback=JSON_CALLBACK";
        return str;
    };
    var doSearch = function(keyword,apiKey,rpp){
        $http.jsonp(makeApiString(keyword,$scope.apiKey,rpp)).success(function(data){
            if(data.stat!='ok'){
                // request failure
                $scope.serverMessage = data.message;
                $scope.images = [];
                return;
            }else{
                // request success
                $scope.serverMessage=null;
            }
            $scope.images = data.photos.photo.map(function(photo){
                return {data:photo,title:photo.title,bigSrc:makePhotoURL(photo.farm,photo.server,photo.id,photo.secret,'z'),src:makePhotoURL(photo.farm,photo.server,photo.id,photo.secret,'q')};
            });
        });
    };
    $scope.search = function(keyword){

        if($scope.apiKey===null ||keyword===null || (typeof(keyword)!="undefined" && keyword.length<4) ){
          return;
      }
      if($scope.rpp<=0){
          $scope.rpp = 10;
      }
      if( $scope.timedout ){
          clearTimeout($scope.timeout);
      }
      $scope.timedout = setTimeout(function(){
          doSearch(keyword,$scope.apiKey,$scope.rpp);
      },1000);
  };
};