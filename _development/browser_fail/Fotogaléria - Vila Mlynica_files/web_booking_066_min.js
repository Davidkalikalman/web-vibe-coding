// web_booking javascripts

// document ready --------------------------------------------------------------

$( document ).ready(function() {

  setInterval(checkFive, 15 * 60000);
  checkHot();

  var step = $('#booking-result').data('nfo');
  var tpe = $('#booking-result').data('tpe');
  var defa = countPersons();

  $('#rf-persons div').html(defa);
  if(step == 1) {

    if(tpe == 'offers') {
      $('#wait').fadeOut('slow');
    } else {

      var urlCheckin = getUrlParameter('checkin');
      var specialoffer = getUrlParameter('specialoffer');
      var result = getUrlParameter('result');
      
      if(typeof specialoffer === "undefined"){
        var stopscroll = 0;
      } else {
        var stopscroll = 1;
      }

      if(typeof urlCheckin === "undefined") {
        openCal();
      } else {
        var urlPersons = getUrlParameter('1-adults');
        if(typeof urlPersons === "undefined") {
          window.location.replace("/booking/");
        } else {
          showResults(stopscroll);
        }
      }

      countPersons();
      setTimeout( function() { $('#wait').fadeOut('slow'); }, 1000);

    }

    var getroom = getUrlParameter('room');
    $.post( "/utility/widgets/wbwidget/", {
      getroom: getroom,
      book: 0
    }).done(function( data ) {
      $( "#ratecompare" ).html( data ).fadeIn();
    });

    var opencode = getUrlParameter('code');
    if(opencode == 'open') {
      $(".vouchermam").click();
    }

  } else

  if(step == 2) {

    $( document ).on( "click", ".booking-next", function() {
      checkFloat();
    });
    shortInfo();

    const el = document.querySelector("#fixednext");
    const observer = new IntersectionObserver(([e]) => e.target.classList.toggle("pinned", e.intersectionRatio < 1), { threshold: [1] } );
    observer.observe(el);

  } else

  if(step == 3) {
    shortInfoStep3();

    if ( self !== top ) {
      setTimeout(function() { window.top.location.href = window.location.href; }, 2000);
    }

  } else

  if(step == 4) {
    $('#wait').fadeOut('slow');
  }

});

// common ----------------------------------------------------------------------

// popup popup

$( document ).on( "click", ".popup", function() {

  const basehref = $(this).closest('.oneroomr').data('basehref');

  if (basehref) {
    var basehrefpopup = basehref + "/utility/bookingpopup/";
  } else {
    var basehrefpopup = "/utility/bookingpopup/";
  }

  $("#popup").removeClass();
  $( "#popup" ).fadeIn("fast");
  var type = $(this).data('popup');
  var id = $(this).data('id');
  var date = $(this).data('date');
  $("#popup").addClass(type);
  $.post( basehrefpopup, {
    type: type,
    id: id,
    date: date
  }).done(function( data ) {
    $('#js-popup-content').html(data);
  });
});

$( document ).on( "click", "#popup-close, .closeme", function() {
  $( "#popup" ).fadeOut("fast", function() { $('#js-popup content').html(""); });
});

// verifi code
$( document ).on( "click", "#rb-check-coupon", function() {
  var code = $("#rb-coupon").val();
  $.post( "/utility/checkcode/", {
    code: code
  }).done(function( data ) {
    if(data == 'reload') {
      location.reload();
    } else {
      $("#chckresp").html(data);
    }
  });
});

function checkFloat() {
  $.post( "/utility/checkfloat/" ).done(function( data ) {
    if(data == 0) {
      window.location.replace("/booking/");
    }
  });
}

// get parameters from site url var tech = getUrlParameter('technology');
function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for(var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if(sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}

function getUrlParameter2(sParam) {
  var sURLReplace = window.location.href.replace("?", "&");
  var sURLVariables = sURLReplace.split('&');
  for(var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if(sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}

// Returns path only
function checkFive() {
  var pathname = window.location.pathname;
  var room = getUrlParameter('room');
  if(typeof room === "undefined") { var add = ''; } else { var add = "&room=" + room; }
  $.post( "/utility/checkfive/" ).done(function( data ) {
    if(data == 'true') {
      window.location.replace(pathname + "?allert=true" + add);
    }
  });
}

$( document ).on( "click", ".js-wbs", function() {
  $.post( "/utility/sharelink/", {
    step: $(this).data('step')
  }).done(function( data ) {
    $('.wb-share').fadeOut('fast', function() {
      $('.wb-share').html(data).fadeIn();
    });
  });
});

$( document ).on( "click", "#js-shb", function() {
  var copyText = document.getElementById("sharelink");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  $('.sharelinkinfo').fadeIn();
});

// step 1 ----------------------------------------------------------------------

// calendar no rooms
$( document ).on( "click", ".cl-next", function() { $( ".cl-a" ).hide(); $( ".cl-n" ).show(); });
$( document ).on( "click", ".cl-prev", function() { $( ".cl-n" ).hide(); $( ".cl-a" ).show(); });

$( document ).on( "click", ".flexiterm", function() {
  var id = $(this).data("id");
  var info = $(this).data("info");
  $('.flexi-content[data-id="' + id +'"]').html("<div id='bb-preloader'><div></div><div></div><div></div><div></div></div>").fadeIn(600);
  $(this).removeClass("act").addClass("act");
  $(".fixedterm").removeClass("act");
  $('.fixed-content[data-id="' + id +'"]').fadeOut("slow", function() {
    $.post( "/utility/flexicontent/", {
      info: info
    })
      .done(function( data ) {
        $('.flexi-content[data-id="' + id +'"]').empty().html(data);
    });
  });
});

$( document ).on( "click", ".fixedterm", function() {
  var id = $(this).data("id");
  $(this).removeClass("act").addClass("act");
  $(".flexiterm").removeClass("act");
  $('.flexi-content[data-id="' + id +'"]').fadeOut("slow", function() {
    $(this).empty();
    $('.fixed-content[data-id="' + id +'"]').fadeIn(600);;
  });
});

$( document ).on( "click", ".parex_text_toggle", function() {
  $(this).parent().toggleClass('opened');
});

$( document ).on( "click", "#btn-offer-open-cal", function() {
  if(!$('#calendar-block').is(':visible')) {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $( "#js-peoples" ).hide();
    //$( ".pop-bg" ).fadeIn("fast");
    if(isValidDate($('#rf-end span').html()) == false) {
      $('.selectable').removeClass('startdate enddate selecteddays minstay');
    } else {
      startDay();
      endDay();
      betweenDays();
      if($('.startdate').hasClass('nostart')) {
        $('.selectable').removeClass('startdate enddate selecteddays minstay');
      }
    }
    $( "#calendar-block" ).fadeToggle( 400, function() {
      $('#sci-nights span').html($('.selecteddays').length);
      if($("#calendar-block").is(":hidden") && $("#js-peoples").is(":hidden")) {
        //$( ".pop-bg" ).fadeOut("fast");
      }
    });
  }
});

$( document ).on( "click", ".bcr-plus", function() {
  var input = $('.bfc-rooms-val');
  var max = input.attr('max');
  var value = parseInt(input.val());
  if(value < max) {
    input.val(value + 1);
    $('#js-all-rooms').html(value + 1);
  }
});

$( document ).on( "click", ".bcr-minus", function() {
  var input = $('.bfc-rooms-val');
  var value = parseInt(input.val());
  if(value > 1) {
    input.val(value - 1);
    $('#js-all-rooms').html(value - 1);
  }
});

$( document ).on( "click", ".bfc-plus", function() {
  var id = $(this).data('id');
  var room  = $(this).data('idr');
  var childs = $('#rblock-' + room + ' .p_blok .p_child').length;
  var input = $('.' + id);
  var max = parseInt(input.attr('max'));
  var value = parseInt(input.val());
  var ffeb  = $('#js-peoples').data('ffeb');
  var meb  = parseInt($('#js-peoples').data('meb'));
  if(ffeb == 0) {
    if((childs - meb) > 0) { var minm = (childs - meb); } else { var minm = 0; }
    if(value < (max - minm)) {
      input.val(value + 1);
      countPersons();
      setPersons();
    } else {
      addRoomModal();
      $('.js-addroom').addClass('lookatme');
    }
  } else {
    if((childs + value) < max) {
      input.val(value + 1);
      countPersons();
      setPersons();
    } else {
      addRoomModal();
      $('.js-addroom').addClass('lookatme');
    }
  }
});

$( document ).on( "click", ".bfc-minus", function() {
  var id = $(this).data('id');
  var input = $('.' + id);
  var value = parseInt(input.val());
  var minimum = 1;
  if(value > minimum) {
    input.val(value - 1);
    countPersons();
    setPersons();
  }
});

$( document ).on( "click", "#rf-persons", function() {
  if($('#calendar-block').is(':visible')) {
    closeCal(1);
  } else {
    if(!$('#js-peoples').is(':visible')) {
      $( "#js-peoples" ).fadeIn();
    }
  }
  var checkin = getUrlParameter2('checkin');
  var fpa = getUrlParameter2('1-adults');
  var room = getUrlParameter2('room');
  if(typeof room === "undefined") {
    var prep = 'booking/?ndts=1';
  } else {
    var prep = 'booking/?room=' + room + '&ndts=1'
  }
  if(typeof checkin === "undefined" && typeof fpa === "undefined") {
    window.history.pushState({urlPath:'/booking/'}, "", prep);
  }
})

$( document ).on( "change", ".bfc-chiladd", function() {
  childAddHelper($(this).val(), $(this).data('idr'));
  setPersons();
});

$( document ).on( "click", ".bfc-childadd-button", function() {
  childAddHelper($(this).prev().find('.bfc-chiladd').val(), $(this).data('idr'));
  setPersons();
});

function childAddHelper($age, $room) {
  var age   = $(this).prev().find('.bfc-chiladd').val();
  var mb  = parseInt($('#js-peoples').data('mb'));
  var room  = $(this).data('idr');
  var adults = parseInt($('.bfc-item-adu-' + $room).val());
  var ffeb  = parseInt($('#js-peoples').data('ffeb'));
  var childs = $('#rblock-' + $room + ' .p_blok .p_child').length;
  var maxchilds = $('#js-peoples').data('meb');
  if(ffeb == 0) {
    if((mb - adults) > 0) { var minm = (mb - adults); } else { var minm = 0; }
    if((childs + 1) <= (maxchilds + minm)) {
      var ltx = $('.clp-buttons').data('ltx');
      $('<div class="p_blok"><div class="p_child">' + (childs + 1) + '. ' + ltx + ': </div><input type="text" class="childage countall" name="child" value="'+ $age +'"><div class="child-dele"></div></div>').insertAfter( $('#rblock-' + $room + ' .p_blok').last() );
      countPersons();
    } else {
      addRoomModal();
      $('.js-addroom').addClass('lookatme');
    }
  } else {
    var mb  = $('#js-peoples').data('mb');
    var adults = parseFloat($('#rblock-' + $room + ' input[name="adults"]').val());
    if((adults + (childs + 1)) <= mb) {
      var ltx = $('.clp-buttons').data('ltx');
      $('<div class="p_blok"><div class="p_child">' + (childs + 1) + '. ' + ltx + ': </div><input type="text" class="childage countall" name="child" value="'+ $age +'"><div class="child-dele"></div></div>').insertAfter( $('#rblock-' + $room + ' .p_blok').last() );
      countPersons();
    } else {
      addRoomModal();
      $('.js-addroom').addClass('lookatme');
    }
  }
}

function setPersons() {
  var string = personsString();
  var start = $('#rf-start span').html();
  var end = $('#rf-end span').html();
  var fullpath = window.location.href;
  var split = fullpath.split('&1-adults');
  if(split[1] !== undefined) {
    var split2 = split[1].split('&rooms');
    if(split2[1] !== undefined) { var add = '&rooms' + split2[1]; } else { var add = ''; }
  } else {
    var add = '';
  }
  var newUrl = split[0] + string + add;
  var room = getUrlParameter2('room');
  if(room !== undefined && newUrl.indexOf("room=") == -1) {
    newUrl = newUrl + '&room=' + room;
  }
  window.history.pushState({urlPath:'/booking/1/'}, "", newUrl);
}

function personsString() {
  var string = '';
  $( ".rblock" ).each(function( room ) {
    $('.countall', this ).each(function( index ) {
      if($(this).attr('name') == 'adults') {
        var pre = $(this).attr('name');
      } else {
        var pre = index + '-' + $(this).attr('name');
      }
      string = string + '&' + (room + 1) + '-' + pre + '=' + $(this).val().replace('+','');
    });
  });
  return string;
}

$( document ).on( "click", ".child-dele", function() {
  $(this).parents('.p_blok').remove();
  countPersons();
  setPersons();
});

$( document ).on( "click", ".child-add-ico", function() {
  var chadt = $(this);
  var chadi = $(this).next(".child-add-in");
  $(chadi).toggle();
  if($(chadi).is(":visible")) {
    $(chadt).addClass('opened');
    $(chadi).addClass('opened');
  } else {
    $(chadt).removeClass('opened');
    $(chadi).removeClass('opened');
  }
});

$( document ).on( "click", ".js-addroom", function() {
  if($("#popup").is(":visible")) {
    $( "#popup" ).fadeOut("fast", function() { $('#js-popup content').empty(); });
  }
  var mr = $('#js-peoples').data('mr');
  var mb = $('#js-peoples').data('mb');
  var totalrooms = $('.rblock').length;
  if(mr > totalrooms) {
    var room = getUrlParameter2('room');
    var string = personsString();
    var fullpath = window.location.href;
    var split = fullpath.split('&1-adults');
    window.history.pushState({urlPath:'/booking/1/'}, "", split[0] + string);
    var nt = (totalrooms + 1);
    var fullpath = window.location.href;
    var split = fullpath.split('&rooms');
    var dfa = $("body").data("dfa");
    var newUrl = split[0] + "&" + nt + "-adults=" + dfa + "&rooms=" + nt + "&rst=1";
    if(room !== undefined) {
      newUrl = newUrl + '&room=' + room;
    }
    window.history.pushState({urlPath:'/booking/1/'}, "", newUrl);
    $('.js-peoples-in').html('<div id="bb-preloader"><div></div><div></div><div></div><div></div></div>');
    $.post( "/utility/personsform/", { url: window.location.href, mb: mb }).done(function( data ) {
      $('.js-peoples-in').html(data);
      countPersons();
      $('.js-addroom').removeClass('lookatme');
    });
  } else {
    return false;
  }
});

$( document ).on( "click", ".dele-room", function() {
  $('#rblock-' + $(this).data('idr')).remove();
  var room = getUrlParameter2('room');
  var mb = $('#js-peoples').data('mb');
  var string = personsString();
  var fullpath = window.location.href;
  var split = fullpath.split('&1-adults');
  window.history.pushState({urlPath:'/booking/1/'}, "", split[0] + string);
  var totalrooms = $('.rblock').length;
  var fullpath = window.location.href;
  var split = fullpath.split('&rooms');
  if(totalrooms == 1) {
    var newUrl = split[0];
  } else {
    var newUrl = split[0] + "&rooms=" + totalrooms + "&rst=1";
  }
  if(room !== undefined) {
    newUrl = newUrl + '&room=' + room;
  }
  window.history.pushState({urlPath:'/booking/1/'}, "", newUrl);
  $.post( "/utility/personsform/", { url: window.location.href, mb: mb }).done(function( data ) {
    $('.js-peoples-in').html(data);
    countPersons();
  });
});

function countPersons() {
  var sum = 0;
  $(".countall").each(function(){
    if($(this).attr('name') == 'adults') {
      sum += +$(this).val();
    } else {
      sum = (sum + 1);
    }
  });
  $("#js-all-pepples").html(sum);
  $('#rf-persons div').html(sum);
}

$( document ).on( "click", ".js-closecalendar", function() {
  closeCal();
});

$( document ).on( "click", ".js-show-calendar", function() {
  openCal();
});

$( document ).on( "click", ".js-peoples", function() {
  var checkin = $('#rf-start span').html();
  var checkout = $('#rf-end span').html();
  if(isValidDate(checkin) == true && isValidDate(checkout) == true) {
    //$( ".pop-bg" ).fadeIn("fast");
    $( "#calendar-block" ).hide();
    $('#rf-start').removeClass('highlight');
    $('#rf-end').removeClass('highlight');
    var mb = $('#js-peoples').data('mb');
    $.post( "/utility/personsform/", { url: window.location.href, mb: mb }).done(function( data ) {
      $('.js-peoples-in').html(data);
    });
    $( "#js-peoples" ).fadeToggle( 400, function() {
      if($("#calendar-block").is(":hidden") && $("#js-peoples").is(":hidden") ) {
        //$( ".pop-bg" ).fadeOut("fast");
      }
    });
  } else {
    openCal();
  }
});

function openCal($default = 0) {
  if(!$('#calendar-block').is(':visible')) {
    $("#br-result").html('');
    $('#rf-start').addClass('highlight');
    $( "#js-peoples" ).hide();
    //$( ".pop-bg" ).fadeIn("fast");
    if(isValidDate($('#rf-end span').html()) == false) {
      $('.selectable').removeClass('startdate enddate selecteddays minstay');
    } else {
      startDay();
      endDay();
      betweenDays();
      if($('.startdate').hasClass('nostart')) {
        $('.selectable').removeClass('startdate enddate selecteddays minstay');
      }
      $('#confirm-selected').fadeIn();
    }
    $( "#calendar-block" ).fadeToggle( 400, function() {
      $('#sci-nights span').html($('.selecteddays').length);
      if($("#calendar-block").is(":hidden") && $("#js-peoples").is(":hidden")) {
        //$( ".pop-bg" ).fadeOut("fast");
      }

    });

    if(!$(".startdate").length) {
      $( ".mobile-info span" ).hide();
      $( ".mobile-info #mi1" ).fadeIn();
      $("#sci-cancel").fadeOut();
    } else {
      $("#sci-cancel").fadeIn();
    }
  }
}

function closeCal($openPeoples = 0) {
  if($('#calendar-block').is(':visible')) {
    $("#calendar-block").fadeToggle( 400, function() {
      if($("#calendar-block").is(":hidden") && $("#js-peoples").is(":hidden") ) {
        checkHot();
        $("#js-calendar .startdate").removeClass('startdate');
        $("#js-calendar .enddate").removeClass('enddate');
        $("#js-calendar .selecteddays").removeClass('selecteddays');
        $("#js-calendar .nostart").removeClass('nostartno');
        $('#rf-start').removeClass('highlight');
        $('#rf-end').removeClass('highlight');
        action = 0;
        $("#calendar-wrapper").css({left: 0});
        //$( ".pop-bg" ).fadeOut("fast");
      }
      if($openPeoples == 1) {
        $( "#js-peoples" ).fadeIn();
      }
    });
    $("html, body").animate({ scrollTop: 0 }, "fast");
  }
}

function startDay() {
  var spanDate = $('#rf-start span').html();
  var startelement = $("#js-calendar").find("[data-date='" + spanDate + "']");
  $(startelement).addClass('startdate');
}

function endDay() {
  var spanDate = $('#rf-end span').html();
  $("#js-calendar").find("[data-date='" + spanDate + "']").addClass('enddate');
}

function betweenDays() {
  var startDay = $('.startdate').data('number');
  var endDay = $('.enddate').data('number');
  for (var i = startDay; i < endDay; i++) {
    var ele = $("#js-calendar").find("[data-number='" + i + "']");

    if($(ele).hasClass('unavailable')) {
      clearAllDates();
      action = 0;
      $('#sci-start span').html('-');
      $('#sci-end span').html('-');
      $('#sci-nights span').html('-');
      $('#rf-start').addClass('highlight');
      $('#rf-end').removeClass('highlight');
    } else {
      ele.addClass('selecteddays');
    }

  }
}

function clearAllDates() {
  $('.selectable').removeClass('startdate enddate selecteddays minstay nostartno tempblock');
  $( ".mobile-info span" ).hide();
  $( ".mobile-info #mi1" ).fadeIn();
}

// set start and end date

var action = 0;

$( document ).on( "click", ".selectable", function() {

  //preventing click .selectable
  if ($('#calendar-block').is(':animated')) {
    return;
  }

  var rst = getUrlParameter('rst');

  action += 1;

  if(action == 1) {
    if($(this).hasClass('nostart') == false && $(this).hasClass('unvst') == false) {
      var maxdays = $('#calendar-block').data('maxdays');
      clearAllDates();
      var startDay = $(this).data('number');
      if(maxdays > 0) {
        $( ".mb-day" ).each(function() {
          if($( this ).data('number') < startDay || $( this ).data('number') > (startDay + maxdays)) {
            $(this).addClass('tempblock');
          }
        });
      }
      if($("#solo-offer").data('minstay')) {
        var minstay = $("#solo-offer").data('minstay');
        if(minstay != null){
          for(var i = (startDay + 1); i < (startDay + minstay); i++) {
            $('.mb-content').find("[data-number='" + i + "']").addClass('minstay');
          }
        }
      }
      $('.nostart').addClass('nostartno');
      $startDay = startDay;
      $(this).addClass('startdate');
      $("#sci-cancel").fadeIn();
      $( ".mobile-info span" ).hide();
      $( ".mobile-info #mi2" ).fadeIn();
      $('#rf-start span').html($(this).data('date'));
      $('#rf-end span').html('-');
      $('#sci-start span').html($(this).data('date'));
      $('#sci-end span').html('-');
      $('#sci-nights span').html('-');
      $('#rf-start').removeClass('highlight');
      $('#rf-end').addClass('highlight');
    } else {
      action = 0;
    }
  }

  if(action == 2) {
    var startDay = $('.startdate').data('number');
    var checkin = $('.startdate').data('date');
    var endDay = $(this).data('number');
    var checkout = $(this).data('date');
    if(endDay > startDay && $(this).hasClass( "minstay" ) == false && $(this).hasClass("tempblock") == false) {
      action = 0;
      $(this).addClass('enddate');
      $( ".mobile-info span" ).hide();
      $( ".month-block .sltlt" ).remove();
      $('#rf-end span').html($(this).data('date'));
      $('#sci-end span').html($(this).data('date'));
      $('#sci-nights span').html($('.selecteddays').length);
      betweenDays();
      $('#rf-end').removeClass('highlight');
      var fullpath = window.location.href;
      var split = fullpath.split('1-adults');
      if(split[1] !== undefined) {
        var append = '&1-adults' + split[1];
      } else {
        var dfa = $("body").data("dfa");
        var append = '&1-adults=' + dfa;
      }
      var newUrl = window.location.pathname + '?checkin=' + checkin + '&checkout=' + checkout + append;
      var room = getUrlParameter2('room');
      if(room !== undefined && newUrl.indexOf("room=") == -1) {
        newUrl = newUrl + '&room=' + room;
      }
      window.history.pushState({urlPath:'/booking/1/'},"", newUrl);
      closeCal(1);
      checkHot()
    } else {
      clearAllDates();
      if($(this).hasClass('nostart') == false) {
        var maxdays = $('#calendar-block').data('maxdays');
        var startDay = endDay;
        $startDay = startDay;
        if(maxdays > 0) {
          $( ".mb-day" ).each(function() {
            if($( this ).data('number') < startDay || $( this ).data('number') > (startDay + maxdays)) {
              $(this).addClass('tempblock');
            }
          });
        }
        if($("#solo-offer").data('minstay')) {
          var minstay = $("#solo-offer").data('minstay');
          if(minstay != null){
            for(var i = (startDay + 1); i < (startDay + minstay); i++) {
              $('.mb-content').find("[data-number='" + i + "']").addClass('minstay');
            }
          }
        }
        $('#rf-start').addClass('highlight');
        $('#rf-end').removeClass('highlight');
        $('.nostart').addClass('nostartno');
        $(this).addClass('startdate');
        $('#rf-start span').html($(this).data('date'));
        $('#sci-start span').html($(this).data('date'));
        $('#sci-end span').html('-');
        $('#sci-nights span').html('-');
        action = 1;
      } else {
        action = 0;
      }
    }
  }

});

$( document ).on( "click", "#sci-cancel", function() {
  if ($("#js-calendar .startdate")[0]){
    clearAllDates();
    action = 0;
    $('#rf-start span').html('-');
    $('#rf-end span').html('-');
    $('#sci-nights span').html('-');
    $('#rf-start').addClass('highlight');
    $('#rf-end').removeClass('highlight');
  } else {
    closeCal();
  }

});

// we have start date and finding end date
$( document ).on( "mouseover", ".selectable", function() {
  if(action == 1 && !$(this).hasClass("tempblock")) {
    var maxdays = $('#calendar-block').data('maxdays');
    $actual = $(this).data('number');
    $actualDate = $(this).data('date');
    if($actual > $startDay && (maxdays == 0 || $('.selecteddays').length < maxdays)) {
      $('.selectable').removeClass('selecteddays');
      for (var i = $startDay; i < $actual; i++) {
        $("#js-calendar").find("[data-number='" + i + "']").addClass('selecteddays');
      }
      $('#sci-end span').html($actualDate);
      $('#sci-nights span').html($('.selecteddays').length);
    } else {
      $('.selectable').removeClass('selecteddays');
    }
  }
});

// for walking in calendar
$( document ).on( "click", "#js-cb-next", function() {
  if($("#calendar-wrapper").is(':animated') == false) {
    var position = $('#calendar-wrapper').position();
    var left = position.left;
    var width = $('.month-block').width() + 20;
    var newleft = left - width;
    if(((newleft - width) * -1) < $('#calendar-wrapper').width()) {
      $("#calendar-wrapper").animate({
        left: newleft
      }, 300, function() {
        $('#js-cb-prev').removeClass('disabled');
        if(newleft == width * -13) {
          $('#js-cb-next').addClass('disabled');
        }
      });
    }
  }
});

$( document ).on( "click", "#js-cb-prev", function() {
  if($("#calendar-wrapper").is(':animated') == false) {
    var position = $('#calendar-wrapper').position();
    var left = position.left;
    var width = $('.month-block').width() + 20;
    var newleft = left + width;
    if(left < 0) {
      $("#calendar-wrapper").animate({
        left: left + width
      }, 300, function() {
        $('#js-cb-next').removeClass('disabled');
        if(newleft == 0) {
          $('#js-cb-prev').addClass('disabled');
        }
      });
    }
  }
});

function checkHot() {
  var adults = getUrlParameter('1-adults');
  if(adults > 0) {
    $("#rf-button").fadeIn();
  } else {
    $("#rf-button").fadeOut();
  }
}

$( document ).on( "click", ".menu-opener", function() {
  //$(".pop-bg").fadeOut("fast");
  $("#js-peoples").fadeOut("fast");
  $("#calendar-block").fadeOut("fast");
  $('#rf-start').removeClass('highlight');
  $('#rf-end').removeClass('highlight');
});

// ask for results
$( document ).on( "click", "#rf-button", function() {
  showResults();
});

$( document ).on( "click", "#confirm-selected", function() {
  closeCal();
  $( "#js-peoples" ).fadeIn();
});

$( document ).on( "click", "#sci-done", function() {
  var adults = getUrlParameter('1-adults');
  var checkin = $('.startdate')[0];
  var checkout = $('.enddate')[0];
  if(adults > 0 && checkin && checkout) {
    showResults();
    $('#br-result').fadeOut('fast', function() {$(this).empty();});
    $( "#calendar-block" ).fadeToggle( 400, function() {
      $('#rf-end').removeClass('highlight');
      $('#rf-start').removeClass('highlight');
    });
  } else {
    if(checkin && checkout) {
      $( "#calendar-block" ).fadeToggle( 400, function() {
        $( "#js-peoples" ).fadeToggle( 400);
      });
    } else {
      return false;
    }
  }
});

function showResults($stopscroll) {

  $(".offerprop").hide();

  if($("#js-peoples").is(":visible")) {
    $("#js-peoples").hide();
  }
  if($("#calendar-block").is(":visible")) {
    closeCal();
  }

  $('#br-result').hide().empty();
  $('#br-preloader').fadeIn(1200);
  $("#rf-button").removeClass("imhot");
  var idoffer = $('#rf-button').data('offer');
  if ( $( ".bfc-rooms-val" ).length ) {
    var rooms = $( ".bfc-rooms-val" ).val();
  } else {
    var rooms = getUrlParameter('rooms');
  }
  var specialoffer = getUrlParameter('specialoffer');
  var room = getUrlParameter('room');
  var rst = getUrlParameter('rst');
  var recheck = getUrlParameter('recheck');
  var start = $('#rf-start span').html();
  var end = $('#rf-end span').html();
  var pathname = window.location.pathname;
  var fullpath = window.location.href;
  var split = fullpath.split('1-adults');
  if(split[1] !== undefined) { var append = '&1-adults' + split[1]; } else { var append = ''; }

  $.post( "/utility/bookingfindrooms/", {
    start: start,
    end: end,
    fullpath: fullpath,
    idoffer: idoffer,
    rooms: rooms,
    room: room,
    rst: rst,
    recheck: recheck,
    specialoffer: specialoffer
  })
    .done(function( data ) {
      var newUrl = pathname + '?checkin=' + start + '&checkout=' + end + append;
      var room = getUrlParameter2('room');
      if(room !== undefined && newUrl.indexOf("room=") == -1) {
        newUrl = newUrl + '&room=' + room;
      }
      window.history.pushState({urlPath:'/booking/1/'},"", newUrl);
      $('#br-preloader').fadeOut(600, function() {
        //$(".pop-bg").fadeOut("fast");
        $('#br-result').html(data).fadeIn(600);
        var p = $("#booking-result");
        var offset = p.offset();
        var body = $("html, body");
        if($stopscroll != 1){
          body.stop().animate({scrollTop:(offset.top - 80)}, 500);
        }
    });
  });
}

// proced to step 2
$( document ).on( "click", ".rbi_confirm", function() {
  var hash = $(this).data('hash');
  var rst = $(this).data('rst');
  var rstrooms = $(this).data('rstrooms');
  var mcmult = $(this).data('mcmult');
  selectFromList(hash, rst, rstrooms, mcmult);
});

$( document ).on( "click", ".off_confirm", function() {
  var hash = $(this).data('hash');
  var rst = $(this).data('rst');
  var rstrooms = $(this).data('rstrooms');
  selectFromList(hash, rst, rstrooms);
});

function selectFromList($hash, $rst, $rstrooms, $mcmult) {
  $('#wait').fadeIn('slow', function() {
    $.post( "/utility/selectprice/", {
      hash: $hash,
      mcmult: $mcmult
    }).done(function( data ) {
      var response = jQuery.parseJSON( data );
      window.dataLayer = window.dataLayer || [];
      dataLayer.push( response.datalayer );
      if($rst == $rstrooms) {
        window.location.href="/booking/2/";
      } else {
        var fullpath = window.location.href;
        var split = fullpath.split('&1-adults');
        if(split[1] !== undefined) { var append = '&1-adults' + split[1]; } else { var append = ''; }
        var append = append.split('&rooms');
        var append = append[0];
        var checkin = getUrlParameter('checkin');
        var checkout = getUrlParameter('checkout');
        var room = getUrlParameter2('room');
        var newUrl = window.location.pathname + "?checkin=" + checkin + "&checkout=" + checkout + append + "&rooms=" + $rstrooms + "&rst=" + ($rst + 1) + "&result=auto";
        if(room !== undefined && newUrl.indexOf("room=") == -1) {
          newUrl = newUrl + '&room=' + room;
        }
        window.location.href = newUrl;
      }
    });
  });
}

// days callendar
var cdclick = 0;
var rid = start = startdate = laststamp = closestamp = '';
$( document ).on( "click", ".free", function() {
  cdclick += 1;
  if(cdclick == 1) {
    $(this).addClass('start');
    rid = $(this).data('rid');
    start = $(this).data('stmp');
    laststamp = start;
    startdate = $(this).data('std');
    empty = $( ".room-" + rid + " .empty" ).filter( function() { return $(this).data("stmp") >= start });
    closestamp = $(empty[0]).data('stmp');
    if(closestamp > 0) {
      $(empty[0]).addClass('free');
      $( ".room-" + rid + " .free" ).filter( function() {
          return $(this).data("stmp") > closestamp
        }
      ).removeClass('free').addClass('freex');
      $( ".room-" + rid + " .firstempty" ).filter( function() {
          return $(this).data("stmp") > closestamp
        }
      ).removeClass('free').addClass('freex');
    }
  }
  if(cdclick == 2) {
    if($(this).data('rid') == rid) {
      if($(this).data('stmp') <= start) {
        clearAllDates2();
      } else {
        var fullpath = window.location.href;
        var split = fullpath.split('1-adults');
        if(split[1] !== undefined) { var append = '&1-adults' + split[1]; } else { var append = ''; }
        var append = append.replace('&result=auto', '');
        var split2 = append.split('&rst=');
        if(split2[1] !== undefined) { var append2 = split2[0] + '&rst=1'; } else { var append2 = append; }
        window.location.href = window.location.pathname + "?checkin=" + startdate +"&checkout=" + $(this).data('std') + append2 + "&result=auto";
      }
    } else {
      clearAllDates2();
    }
  }
});

$( document ).on( "click", ".freex", function() {
  clearAllDates2();
});

$( document ).on( "mouseover", ".calday", function() {
  if(cdclick == 1) {
    var stmp = $(this).data('stmp');
    var trid = $(this).data('rid');
    if(trid == rid) {
      $( ".room-" + rid + " .free" ).filter( function() {
          return $(this).data("stmp") >= start && $(this).data("stmp") <= stmp
        }
      ).addClass('slctd');
      $( ".room-" + rid + " .free" ).filter( function() {
          return $(this).data("stmp") < start || $(this).data("stmp") > stmp
        }
      ).removeClass('slctd');
    } else {
      clearAllDates2();
    }
  }
});

function clearAllDates2() {
  $('.calday').removeClass('start end slctd');
  $('.empty').removeClass('free');
  $('.freex').removeClass('freex').addClass('free');
  cdclick = 0;
  rid = start = startdate = laststamp = closestamp = '';
}

// step 2 ----------------------------------------------------------------------

function shortInfo() {
  $.post( "/utility/bookingservices/", {}).done(function( data ) {
    $('#js-step-2-r').html(data);
    $.post( "/utility/bookingshortinfo/", {type: 'services'}).done(function( data ) {
      response = jQuery.parseJSON(data);
      $( ".result_sub_block" ).each(function( index ) {
        $('.servicesmore.svm-' + $(this).data('room')).html(response['services'][$(this).data('room')]['mandatory'] + response['services'][$(this).data('room')]['userchoice']);
      });
      $('#finalprice').html(response.price);
      $('#wait').fadeOut("slow");
    });
  });
}

// show category
$( document ).on( "click", ".servicecategory", function() {
  var clicked = $(this);
  var element = $('#' + $(this).attr('id') + '_cont');
  $(element).slideToggle('fast', function() {
    if ($(element).is(':hidden')) {
      $(clicked).removeClass("opened");
    } else {
      $(clicked).addClass("opened");
    }
  });
});

// change count
$( document ).on( "click", ".rbi_services-plus", function() {
  $('#js-half-white').fadeIn();
  $( "#br-preloader" ).fadeIn();
  var id = $(this).data('id');
  var input = $("input[name='service_" + id + "']");
  var sdc = input.data('sdc');
  var inputVal = parseInt($(input).val());
  var type = 'plus';
  if(inputVal >= 20) { $newVal = 20; } else { $newVal = inputVal + 1; }
  $(input).val( $newVal );
  $.post( "/utility/selectservices/", { type: type, count: $newVal, name: 'service_' + id, sdc: sdc }).done(function( data ) {
    response = jQuery.parseJSON(data);
    window.dataLayer = window.dataLayer || [];
    dataLayer.push( response.datalayer );
    $( ".result_sub_block" ).each(function( index ) {
      $('.servicesmore.svm-' + $(this).data('room')).html(response['services'][$(this).data('room')]['mandatory'] + response['services'][$(this).data('room')]['userchoice']);
    });
    $('#finalprice').html(response.price);
    $('#js-half-white').fadeOut();
    $.post( "/utility/orderinfo/", function( data ) {
      $( "#js-ords" ).html( data );
      $( "#br-preloader" ).fadeOut();
    });
  });
});

$( document ).on( "click", ".rbi_services-minus", function() {
  $('#js-half-white').fadeIn();
  $( "#br-preloader" ).fadeIn();
  var id = $(this).data('id');
  var input = $("input[name='service_" + id + "']");
  var sdc = input.data('sdc');
  var inputVal = parseInt($(input).val());
  var type = 'minus';
  if(inputVal <= 0) { $newVal = 0; } else { $newVal = inputVal - 1; }
  $(input).val( $newVal );
  $.post( "/utility/selectservices/", { type: type, count: $newVal, name: 'service_' + id, sdc: sdc }).done(function( data ) {
    response = jQuery.parseJSON(data);
    window.dataLayer = window.dataLayer || [];
    dataLayer.push( response.datalayer );
    $( ".result_sub_block" ).each(function( index ) {
      $('.servicesmore.svm-' + $(this).data('room')).html(response['services'][$(this).data('room')]['mandatory'] + response['services'][$(this).data('room')]['userchoice']);
    });
    $('#finalprice').html(response.price);
    $('#js-half-white').fadeOut();
    $.post( "/utility/orderinfo/", function( data ) {
      $( "#js-ords" ).html( data );
      $( "#br-preloader" ).fadeOut();
    });
  });
});

$( document ).on( "click", ".rbis-man", function() { 
  $('#js-half-white').fadeIn();
  var element = $(this);
  var sdc = element.data('sdc');
  var id = element.data('id');
  var add = element.data('add');
  var del = element.data('del');
  var text = element.text();
  if(element.hasClass( "rbi-service-add" )) {
    var count = 1;
  } else {
    var count = 0;
  }
  $.post( "/utility/selectservicesman/", { count: count, sdc: sdc, id: id }).done(function( data ) {
    response = jQuery.parseJSON(data);
    window.dataLayer = window.dataLayer || [];
    dataLayer.push( response.datalayer );
    $( ".result_sub_block" ).each(function( index ) {
      $('.servicesmore.svm-' + $(this).data('room')).html(response['services'][$(this).data('room')]['mandatory'] + response['services'][$(this).data('room')]['userchoice']);
    });
    $('#finalprice').html(response.price);
    $('#js-half-white').fadeOut();
    if(count > 0) {
      element.removeClass('rbi-service-add').addClass('rbi-service-delete');
      element.html(del);
    } else {
      element.removeClass('rbi-service-delete').addClass('rbi-service-add');
      element.html(add);
    }
    $.post( "/utility/orderinfo/", function( data ) {
      $( "#js-ords" ).html( data );
      $( "#br-preloader" ).fadeOut();
    });
  });
});

$( document ).on( "click", ".booking-next", function() {
  var href= $(this).attr('href');
  $('#wait').fadeIn( 'slow', function() {
    window.location=href;
  })
  return false;
})

// step 3 ----------------------------------------------------------------------

function shortInfoStep3() {
  $.post( "/utility/bookingshortinfo/", {}).done(function( data ) {
    $('#js-step-3-l').html(data);
    $('#wait').fadeOut("slow");
  });
}

// check form before send
$(document).on("change", "#rbi_company_country", function() {
  var result = $(this).val().split('-');
  if(result[0] == 'disabled') {
    if(result[1] > 0) {
      $("#rbi_company_country").val(result[1]);
    }
  }
});

$(document).on("keyup", "#rbi_company_name", function() {
  if ($(this).val().length > 3) {
    $(".com-rslt").show();
    $(".com-rslt").html("<div id='loader' style='height: 120px;'><div></div><div></div><div></div></div>");
    $.post( "/utility/partnersearchconnector/", { search: $(this).val(), type: 'name' }).done(function( data ) {
      $(".com-rslt").html(data);
    });
  } else {
    $(".com-rslt").html('');
  }
});

$( document ).on( "click", ".js-fillpartner", function() {
  $(".com-rslt").html("<div id='loader' style='height: 120px;'><div></div><div></div><div></div></div>");
  $.post( "/utility/partnersearchconnector/", { search: $(this).data('id'), type: 'fill' }).done(function( data ) {
    var reply = JSON.parse(data);
    $('#rbi_company_name').val(reply.name);
    $('#rbi_company_street').val(reply.street);
    $('#rbi_company_city').val(reply.city);
    $('#rbi_company_zip').val(reply.zip);
    $('#rbi_company_country').val(1);
    $('#rbi_company_id').val(reply.company_id);
    $('#rbi_company_vat').val(reply.vat_number);
    $('#rbi_company_vatid').val(reply.vat_id);
    $(".com-rslt").html('');
  });
});

$( document ).on( "click", "#rbi-send-form", function() {
    $('#wait').fadeIn('slow');
    if($("#paydep-1").prop('checked') == 1) {var paydep = 1;} else {var paydep = 0;}
    if($("#rbi_com").prop('checked')) {var company = 1;} else {var company = 0;}
    if($("#rbi_cond").prop('checked')) {var cond = 1;} else {var cond = 0;}
    if($("#rbi_gdpr").prop('checked')) {var gdpr = 1;} else {var gdpr = 0;}
    if($("#rbi_marketing").prop('checked')) {var marketing = 1;} else {var marketing = 0;}
    $.post( "/utility/bookingsendorder/", {
      rbi_title: $('#rbi_title').val(),
      rbi_name: $('#rbi_name').val(),
      rbi_surname: $('#rbi_surname').val(),
      rbi_email: $('#rbi_email').val(),
      rbi_note: $('textarea#rbi_note').val(),
      rbi_phone: $('#rbi_phone').val(),
      rbi_cond: cond,
      rbi_gdpr: gdpr,
      rbi_marketing: marketing,
      rbi_payment: $("input[name='rbi_payment']:checked").val(),
      rbi_company: $('.rbi_company').serializeArray(),
      rbi_com: company,
      rbi_paydep: paydep
    }).done(function( data ) {
      response = jQuery.parseJSON(data);
      if(response.status == 'prepay') {
          var payid = $("input[name='rbi_payment']:checked").val();
          $.post( "/utility/bookingpopup/", {
            type: 'prepaypopup',
            payid: payid
          }).done(function( data ) {
            $('#rbi_pi_form').html(data);
            $('#wait').fadeOut('slow');
          });

      } else
      if(response.status == 'error') {
        error = jQuery.parseJSON(response.response);
        if(error[1] == 'rbi_name') { $("#rbi_name").addClass('rbi_red'); } else { $("#rbi_name").removeClass('rbi_red'); }
        if(error[2] == 'rbi_surname') { $("#rbi_surname").addClass('rbi_red'); } else { $("#rbi_surname").removeClass('rbi_red'); }
        if(error[3] == 'rbi_email') { $("#rbi_email").addClass('rbi_red'); } else { $("#rbi_email").removeClass('rbi_red'); }
        if(error[4] == 'rbi_cond') { $("#rbi_cond_bck").addClass('rbi_red_bck'); } else { $("#rbi_cond_bck").removeClass('rbi_red_bck'); }
        if(error[5] == 'rbi_gdpr') { $("#rbi_gdpr_bck").addClass('rbi_red_bck'); } else { $("#rbi_gdpr_bck").removeClass('rbi_red_bck'); }
        if(error[6] == 'rbi_phone') { $("#rbi_phone").addClass('rbi_red'); } else { $("#rbi_phone").removeClass('rbi_red'); }
        if(error[7] == 'rbi_street') { $("#rbi_company_street").addClass('rbi_red'); } else { $("#rbi_company_street").removeClass('rbi_red'); }
        if(error[8] == 'rbi_city') { $("#rbi_company_city").addClass('rbi_red'); } else { $("#rbi_company_city").removeClass('rbi_red'); }
        if(error[9] == 'rbi_zip') { $("#rbi_company_zip").addClass('rbi_red'); } else { $("#rbi_company_zip").removeClass('rbi_red'); }
        if(error[10] == 'rbi_country') { $("#rbi_company_country").addClass('rbi_red'); } else { $("#rbi_company_country").removeClass('rbi_red'); }
        $("html, body").animate({ scrollTop: 0 }, "slow");
        $('#wait').fadeOut('slow');
      } else
      if(response.status == 'true') {
        window.location.replace(response.response);
      } else
      if(response.status == 'false') {
        window.location.replace("/booking/" + response.redirect);
      } else {
        window.location.replace("/booking/");
      }
    });
});

$( document ).on( "click", "#reviewtoopen", function() {
  if($(this).hasClass("open")) {
    $(this).removeClass("open");
    $("body").removeClass("rewiewsopened");
    $("#allreviews").removeClass("opened");
  } else {
    $(this).addClass("open");
    $("body").addClass("rewiewsopened");
    $("#allreviews").addClass("opened");
  }
})


function IsEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z]{2,4})+$/;
  return regex.test(email);
}

function isValidDate(s) {
  var bits = s.split('.');
  var d = new Date(bits[2] + '/' + bits[1] + '/' + bits[0]);
  return !!(d && (d.getMonth() + 1) == bits[1] && d.getDate() == Number(bits[0]));
}

function addRoomModal() {
  $( "#popup" ).fadeIn("fast");
  $.post( "/utility/addroompopup/").done(function( data ) {
    var resp = jQuery.parseJSON( data );
    if(resp.status == 'true') {
      $('#js-popup-content').html(resp.html);
    }
  });
}
