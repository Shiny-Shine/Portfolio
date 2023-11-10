$(document).ready(function(){

 //메뉴 효과 
 $("ul.gnb>li").mouseover(function(){
    $("ul.sub, .nav_bg").stop().slideDown();
 }); 
 $("ul.gnb>li").mouseout(function(){
    $("ul.sub, .nav_bg").stop().slideUp();
 }); 

 //슬라이드 애니메이션
 var slide=$(".slide li"); //슬라이드에 사용할 이미지 배열에 저장
 var sno=0; //배열 첨자는 0부터 시작. 이미지 개수 카운트
 var lastno=slide.length-1; //마지막 번호는 배열에 있는 아이템 개수-1
 function playSlide(){
  $(slide[sno]).animate({
   "top":"300px"
  },1000,function(){
   $(this).css({"top":"-300px"});
  });	 
  sno++;
  if(sno>lastno) sno=0;
  $(slide[sno]).animate({
   "top":"0"
  },1000);		
 }
  var timer = setInterval(function(){
  playSlide();
 },2000);


 //레이어 팝업
 $(".notice ul li").eq(0).click(function(){
   $(".modal").show();
 });
 $(".btn").click(function(){
   $(".modal").hide();
 });

}); //ready end