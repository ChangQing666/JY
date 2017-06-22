/*二手房预约js*/
var swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    paginationClickable: false,
    effect: 'coverflow',
    coverflow: {
        rotate: 38,
        stretch:-15,
        depth: 150,
        modifier: 1,
        slideShadows: false
    },
    noSwiping: true,
    roundLengths: true,
    initialSlide:0,
    speed: 600,
    slidesPerView: "auto",
    centeredSlides: true,
    followFinger: false,
    onSlideChangeStart: function(swiper){
        if(swiper.activeIndex==0||swiper.activeIndex==7){
            $z(".swiper-pagination").hide();
        }else{
            $z(".swiper-pagination").show();
        }
    },
    onSliderMove: function(swiper){
        if(swiper.activeIndex==0){
            swiper.unlockSwipes();
        }else if(swiper.activeIndex==1){
            if(!$z(".purpose>li").hasClass("selected")){
                swiper.lockSwipes();
                toast("请选择购房目的");
            }else{
                swiper.unlockSwipes();
            }
        }else if(swiper.activeIndex==3){
            if(!$z(".type .item").hasClass("selected")){
                swiper.lockSwipes();
                toast("请选择户型");
            }else{
                swiper.unlockSwipes();
            }
        }else if(swiper.activeIndex==4){
            if($z(".selected_box .item").length==0){
               swiper.lockSwipes();
               toast("请选择区域");
            }else{
                swiper.unlockSwipes();
            }
        }else if(swiper.activeIndex==5){
            if(! $z(".feature .item").hasClass("selected")){
                swiper.lockSwipes();
                toast("请选择房源特色");
            }else{
                swiper.unlockSwipes();
            }
        }else if(swiper.activeIndex==6){
            swiper.lockSwipeToNext();
        }
    }
});

var purpose;var type=[];var feature=[];
//    购房目的
$z(".purpose>li").click(function(){
    $z(this).addClass("selected").siblings().removeClass("selected");
    purpose = $z(this).html();
    swiper.unlockSwipes() ;
    swiper.slideNext();
})
//    户型
$z(".type .item").click(function(){
    var selLen = $z(".type .item.selected").length;
    if(!$z(this).hasClass("selected")){
        if(selLen>=2){
            toast("最多只能选两项");
            return
        }else{
            $z(this).addClass("selected");
            type.push($z(this).html());
        }
    }else{
        $z(this).removeClass("selected");
        type.remove($z(this).html());
    }
    swiper.unlockSwipes();
})

//  区域选择
var city1 = [], city2 = [], city3 = [], cityType = 1, cityChecked = [0, 0, 0];
$z(function () {
    if (cityType == 1) {
        if (city1.length != 0) {
            render(city1);
        } else {
            getCity1();
        }
    } else if (cityType == 2) {
        if (city2.length != 0) {
            render(city2);
        } else {
            getCity2();
        }
    } else if (cityType == 3) {
        if (city3.length != 0) {
            render(city3);
        } else {
            getCity3();
        }
    }
})
var requestFlag = true;
$z(".select-scroll").on("click", "li", function (e) {
    //   选择城市
    if (!requestFlag) return;
    requestFlag = false;
    var index = $z(this).attr("index");
    if (cityType == 1) {
        cityType = 2;
        getCity2(city1[index].cityId);
        $z(".tabs").css({visibility:"visible"});
        $z(".select-value").find("li").eq(0).show().text($z(this).text()).addClass("selected").siblings().removeClass("selected");
        cityChecked[0] = index;
    } else if (cityType == 2) {
        cityType = 3;
        getCity3(city2[index].id);
        $z(".select-value").find("li").eq(1).show().text($z(this).text()).addClass("selected").siblings().removeClass("selected");
        cityChecked[1] = index;
    } else if (cityType == 3) {
        $z(".select-value").find("li").eq(2).show().text($z(this).text()).addClass("selected").siblings().removeClass("selected");
        var curIndexId;
        var selLen = $z(".selected_box .item").length;
        if($z(this).hasClass("selected")){
            $z(this).removeClass("selected");
            var curIndex = $z(this).attr("index");
            curIndexId = "index"+curIndex;
            var curSelector ="#" +curIndexId;
            $z(curSelector).remove();
        }else{
            if( selLen >2){
                toast("最多选三个");
            }else{
                $z(this).addClass("selected");
                var curCountyName =  $z(this).attr("countyname");
                var curCityName = $z(this).attr("cityname");
                var curName = $z(this).attr("name");
                var curCityId =  $z(this).attr("cityid");
                var curCountyId = $z(this).attr("countyid");
                var curCid = $z(this).attr("cid");
                var str =  $z(".selected_box").html();
                var curIndex = $z(this).attr("index");
                curIndexId = "index"+curIndex;
                str+= "<span class='item'  id='"
                    + curIndexId
                    +"' cityId='"+curCityId+"'cityName='"+curCityName+"' countyName='"+curCountyName+"' name='"+curName +"' cid='"+ curCid
                    +"'><span>"
                    + curName
                    +" </span><img class='btn_close' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAQAAAAm93DmAAACkUlEQVRIx6WXS1IaQRiAuyh14Razo7wGOUnUnERPgBewIHdgY5nKDXogsxHGXWqSUEDMg0diNKVQWF8WMz39D3QPUHZv5vH3N/33/xyF8s4SVU5pEjHhiScmRDQ5pUrJv8r3okKNPr7Rp0alEKjFpMwFM9aNGReUdX6lC8gbRmw6RhwVAtmhLuUXjIiJCGnRIiQiZsQiD62z4wGyz5WVeySmjXbMNjGPEnnFvgPIDpdG4pkegRNmZkCPZ4u8THaZBzbs3jqFMDM7cp+NJSBH5s0D4UY4jSbkwSJPJLBsLPu4BS5BZruc8MoC6+bsOlvhNJpre5YNAzxknjzpZWIDFtx6IS0iYbSeAc45TIA1o64VSr76w6PmP2AqLJ6pXUMpSgySu1gs+plKfPfgYCaexQY4oKSomqho5/xsnMrcOnHwKefqWfRUFWcmLJddd7KC/Ji5SbwknYX/qaLpFtEETFOpb2twQumm4ia5ipwBZpBD2tyn158dkpEB3ihzWKHHQX5n6S8ZXzyWT8dYGcnA63N/RGL56k0W5rtrgZowi4VpQfaxwEKVNS3uxA573o9alQuMInFPhUpLo3jdRp5fnzZ/C5DSbTyOLS08SOPh3mtp6divXaGnCTLcUISY2xdbudBzJoflKCkOvnxycKavX87UIJFzb/pSVIwvWqdYeHC2kkxWE+yMiikBF6YEXKdCfebi7FbN1c20ESWgLovU+MVFakxZltHjF5fRtwWF/nrDeicK/bvVzmHvRa3InrtZ+pBvlloekyw1S++dzZJWWrFrFbftXJeQgICQrquda7Bb3HAeb9Vwnngaztw8oL5RS1znYJum/ZyhFzbkfE3T7v2tOKNJxJQ5c6ZENDkr/q34D4W+dHxkTkUlAAAAAElFTkSuQmCC' >"
                    +"</span> "

                $z(".selected_box").html(str);
            }
        }
        cityChecked[2] = index;
        requestFlag = true;
        swiper.unlockSwipes();
    }
});
/*点击tab项*/
// 点击二级城市
$z(".select-value").find("li").eq(0).click(function () {
    cityType = 1;
    cityChecked[1] = 0;
    cityChecked[2] = 0;
    render(city1);
    $z(this).addClass("selected").siblings().removeClass("selected");
    $z(".select-value").find("li").eq(1).text("").hide();
    $z(".select-value").find("li").eq(2).text("").hide();
});
// 点击三级城市
$z(".select-value").find("li").eq(1).click(function () {
    cityType = 2;
    cityChecked[2] = 0;
    render(city2);
    $z(this).addClass("selected").siblings().removeClass("selected");
    $z(".select-value").find("li").eq(2).text("").hide();
});

/*点击下面选中的商圈*/
$z(".selected_box").on("click",".btn_close",function(){
    $z(this).parent().remove();
    var curId =Number($z(this).parent().attr("id").substring(5)) ;
    $z(".select-scroll li").eq(curId).removeClass("selected");
    swiper.unlockSwipes();
});

/*请求数据*/
function getCity1() {
    $z.get("https://m.jyall.com/entrust/queryOpenCityList",function (res) {
        res = JSON.parse(res);
        if(res.state == 1){
            city1 = res.resultList;
            render(city1);
        }
    })
}
function getCity2(id) {
    $z.ajax({
        url: "https://m.jyall.com/entrust/queryCountry/"+id,
        dataType : "jsonp",
        success: function (res) {
            city2 = res.countries;
            render(city2);
        }
    });
}
function getCity3(id) {
    $z.ajax({
        // url: "https://m.jyall.com/entrust/querTown/"+id,//获取四级地址
        url: "https://m.jyall.com/common-city/v1/district/queryDistrictByCounty/"+id,//获取商圈
        dataType : "json",
        success: function (res) {
            city3 = res;
            render(city3);
        },
        error:function(res){
            console.log(res)
        }
    });
}
function render(citylist) {
    var str = "";
    citylist.forEach(function (i,index) {
        var name = '';
        if(cityType==1){
            name = i.cityName;
            str += "<li index='"+ index + "'>" + name + "</li>";
        }else if(cityType==2){
            name = i.name;
            str += "<li index='"+ index + "'>" + name + "</li>";
        }else{
            var selected="";
            $z(".selected_box .item").map(function(k,item){
                if(Number($z(item).attr("cid"))==i.id){
                    selected = "selected"
                }
            })
            str += "<li class='"+ selected +"' index='"+ index +"'cityId='"+i.cityId+"'cityName='"+i.cityName+"'countyName='"+i.countyName+"'name='"+i.name+"' cid='"+i.id +"'>" + i.name + "</li>";
        }
    });
    $z(".select-scroll ul").html(str);
    requestFlag =true;
}

//  房源特色
$z(".feature .item").click(function(){
    $z(this).toggleClass("selected");
    if($z(this).hasClass("selected")){
        feature.push($z(this).html());
    }else{
        feature.remove($z(this).html());
    }
    swiper.unlockSwipes();
})


// 兼容input获取焦点键盘弹出挡住底部输入框
var H = $z("body").height();
$z("input").focus(function(){
    $z("body").height( $z("body").height()+30)
}).blur(function(){
    $z("body").height(H)
})

//删除数组中指定元素
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};


//开始找房
/*立即预约*/
var getQueryString = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return "";
};
var wwwURL = (/https/i.test(location.protocol) === false ? 'http://' : 'https://') + location.hostname,
    isOnline=true,
    domain_v1 = isOnline ? wwwURL:'/api.php?jsApiUrl=' + wwwURL;
$z("#btnSubmit").click(function () {
        mobilePhone=$z("#phone").val(),
        mobileCode=$z("#yzm").val();
    if(mobilePhone==""){
        toast("请输入手机号");
        return;
    }
    if(!/^1[34578]\d{9}$/.test(mobilePhone)){
        toast("请输入正确手机号");
        return;
    }
    if (mobileCode == "") {
        toast("请输入验证码");
        return;
    }

    var source = getQueryString('source')=='app'?'2':'3';
    var appointID = "FCESF20170616001";
    var catagoryOneId = "1";
    var APPkey= getQueryString('APPkey') ? getQueryString('APPkey') : 'b40538ab5bef1ffd18605efda7f820d9';
    var _track_d="";
    if($z.fn.cookie('_track_d')){
        _track_d=$z.fn.cookie('_track_d').split('.')[0];
    }
    var deviceId=_track_d;
    var validate = 1;var selectedCities=[];
    $z(".selected_box .item").map(function(i,item){
        var curSelectedCity = $z(item).attr("cityname")+"_"+$z(item).attr("countyname")+"_"+$z(item).attr("name")
        selectedCities.push(curSelectedCity);
    })
    var wAraea           =  selectedCities.join(";"),//"“北京市_东城区_朝阳门;北京市_西城区_月坛;天津市_和平区_新兴”
        appointTime      =  "",//预约时间
        housePurpose     =  $z(".purpose li.selected").text(),//购房目的
        totalCount       =  parseInt($z(".tracker_modal").text())+"", //预算总价
        houseRoom        =  type.join(","),//户型
        houseFeature     =  feature.join(","),//房源特色
        name             =  $z("#name").val(),//姓名
        cellphone        =  $z("#phone").val(),//手机号（字符形式）
        appointName      =  "二手房帮您找房",//预约名称
        catagoryOneName  =  "房产",//一级分类名称
        messageParam     =  "二手房帮您找房",//短信变量
        handleFlag       =  "0",//处理类型
        citySite         =  "00000",//站点
        cellphoneCode    =  $z("#yzm").val();//验证码
    var data = {
        appointTime: appointTime,
        name: name,
        cellphone: cellphone,
        source: source,
        citySite: citySite,
        housePurpose: housePurpose,
        totalCount: totalCount,
        houseRoom: houseRoom,
        houseFeature: houseFeature,
        wAraea: wAraea,
        appointID: appointID,
        appointName: appointName,
        catagoryOneId: catagoryOneId,
        catagoryOneName: catagoryOneName,
        messageParam: messageParam,
        handleFlag: handleFlag,
        cellphoneCode: cellphoneCode
    };
    data = JSON.stringify(data);
    // console.log("data",data)
    $z.ajax({
        url:"https://m.jyall.com/jygoods-api/v1/dispatch/addWithValidate/1/"+ "FCESF20170616001"  + "/" + source + "?validate=1",
        beforeSend: function(xhr){
            xhr.setRequestHeader('deviceId', _track_d);
            xhr.setRequestHeader('APPkey', APPkey);
        },
        type:"post",
        data:data,
        dataType:"json",
        contentType:"application/json",
        cache:false,
        success: function (data) {
            //res = JSON.parse(data);
            if(data.state==1){
                toast(data.message);
                swiper.unlockSwipeToNext()
                swiper.slideNext();
            }
            if(data.state==0){
                toast(data.message)
            }
            if(data.state==2){
                toast(data.message)
            }
        },
        error: function () {
            toast("发生了错误，请您尝试再次申请！");
        }
    })
});


// slider滑块取值
$z(function(){
    var $zsliderTrack = $z('#sliderTrack'),
        $zsliderHandler = $z('#sliderHandler'),
        $ztrackerModal = $z('.tracker_modal');
    var totalLen = $z('#sliderInner').width(),
        startLeft = 0,
        startX = 0;
    $zsliderHandler
        .on('touchstart', function (e) {
            startLeft = parseFloat($zsliderHandler.css('left')) * totalLen / 100;
            startX = e.changedTouches[0].clientX;
        })
        .on('touchmove', function(e){
            var dist = startLeft + e.changedTouches[0].clientX - startX,
                percent;
            dist = dist < 0 ? 0 : dist > totalLen ? totalLen : dist;
            percent =  parseFloat(dist / totalLen * 100);
            $zsliderTrack.css('width', percent + '%');
            $zsliderHandler.css('left', percent + '%');
            $ztrackerModal.css('left', percent + '%');
            if(percent==100){
                $ztrackerModal.css({fontSize:".28rem"}).text("1000万以上")
            }
            else if(percent==0){
                $ztrackerModal.text("100万以下")
            }else{
                var totalAmount = 10*Math.round(parseInt(percent*0.01*900+100)/10)+"万";//滑动显示10为最小变量
                $ztrackerModal.text(totalAmount);
            }
            e.preventDefault();
        });
});

// 发送验证码
var interval,seconds = 60,flag=false;
$z(function(){
    $z(".hqyzm").click(function () {
        if(flag) {
            return;
        }
        var num = $z("#phone").val();
        if(num == ""){
            toast("请输入手机号");
            return;
        }
        if(!/^1[34578]\d{9}$/.test(num)){
            toast("请输入正确手机号");
            return;
        }
        flag = true;
        var self = $z(this);
        var str = "(" + seconds + ")";
        self.text(str).addClass("hqyzm-djs");
        interval = setInterval(function(){
            seconds--;
            var str = "(" + seconds+")";
            self.text(str).addClass("hqyzm-djs");
            if(seconds<0){
                clearInterval(interval);
                seconds = 60;
                self.text("获取验证码").removeClass("hqyzm-djs");
                flag = false;
            }
        },1000);
        $z.ajax({
            url: "https://m.jyall.com/entrust/sendvcode?mobile="+num,
            dataType : "jsonp",
            success: function (res) {
                if(res.state==0){
                    toast(res.message);//验证码发送失败，取消定时器
                    clearInterval(interval);
                    $z(".hqyzm").text("获取验证码").removeClass("hqyzm-djs");
                    flag = false;
                }else if(res.state==1){
                    toast("验证码已发送")
                }
            }
        });
    })
})
// toast提示
var timer = '';
function toast(str){
    $z(".my-toast").text(str).show(400);
    timer = setTimeout(function(){
        $z(".my-toast").hide(400);
        clearTimeout(timer);
    },1000)
};

// 小屏幕样式兼容
$z(function(){
    console.log((window.innerHeight+"_"+screen.height+"_"+window.innerHeight/screen.height));
    if(window.innerHeight/screen.height<0.801){
        var percent = window.innerHeight/screen.height;
        if(percent<0.801){
            percent = percent*.4;
        }

        $z(".fixgapPadding").map(function(i,item){
            var fixgap1 = parseFloat($z(item).css("padding-top"));
            fixgap1*=percent;
            $z(item).css({ paddingTop: fixgap1})
        })
        $z(".fixgapMargin").map(function(i,item){
            var fixgap1 = parseFloat($z(item).css("margin-top"));
            fixgap1*=percent;
            $z(item).css({ marginTop: fixgap1})
        })
        $z(".btm_txt").map(function(i,item){
            var fixgap1 = parseFloat($z(item).css("bottom"));
            fixgap1*=percent;
            $z(item).css({ bottom: fixgap1})
        });
        $z(".tojyall").addClass("smallScreen")
    }
})

var _track_conf = _track_conf || [];_track_conf.push(['_page_id','']);
