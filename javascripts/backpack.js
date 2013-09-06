$(document).ready(function() {	
$.timeago.settings.allowFuture = true;
  //the click function for lists of badge thumbnails
  $( ".badge-thumbs" ).delegate( "a", "click", function() {
  	var target = $( this );
  	var hashOrAction = $( this ).attr('class').split(' ')[1];

  	//Display badge content and BadgeUI for clicked badge
   	if (target.hasClass('badgethumb')) {
      //for square thumbnal badges
      if(target.parents('ul').hasClass('square')){
  	    if (target.hasClass('chosen')) {
          $(target).find('.detail').animate({
            top: "160px"
          }, 400, "swing", function(){
            target.removeClass('chosen').parents('li').find('.badgeui').fadeOut('fast', function() {
              $(this).remove();
            });
          });
  	    } else {
          $(target).find('.detail').animate({
            top: "0px"
          }, 400, "swing", function(){
            target.addClass('chosen').parents('li').append(makeBadgeUI(hashOrAction)).find('.badgeui').fadeIn('fast');
          });
  	    }
      //for vertical thumbnail badges (in lists)
      } else if (target.parents('ul').hasClass('vertical')) {
        target.addClass('chosen').parent().append(makeBadgeUI(hashOrAction)).find('.badgeui').fadeIn('fast');
      }
    return false;
  //Perform action based on clicked Badge UI item
	} else if (target.hasClass('badge_action')) {
		badgeAction(target);
		if(!target.hasClass('bcol')) return false;
	} else {
		console.log('some other link');
	}
  });

  //a function to generate the dropdown BadgeUI from the clicked badge hash
  function makeBadgeUI(hash) {
  	console.log('making a badge ui for : ' + hash);
  	var output = '' +
  	'<div class="badgeui">' +
  	'	<ul>' +
  	'		<li><a class="badge_action bdel ' + hash + '" href="#">Delete</a></li>' +
  	'		<li><a class="badge_action bcol ' + hash + '" data-dropdown="' + hash + '_coll_dd" href="#">Collections</a>' +
  	'      <ul id="' + hash + '_coll_dd" class="f-dropdown" data-dropdown-content>' +
    '         <li><a class="badge_action batc ' + hash + '" href="#">Add to new or existing collection</a></li>' +

    getCollectionsByBadge(hash,'li') +

    '      </ul>' +
    '   </li>' +
    '		<li><a class="badge_action bdet ' + hash + '" href="#">Detail</a></li>' +
  	'	</ul>' +
  	'</div>';

  	return output;

  }

  //a function to process BadgeUI clicks (details,delete,etc.)
  function badgeAction(element) {

	var action = element.attr('class').split(' ')[1];
	var hash = element.attr('class').split(' ')[2];

  console.log('action is : ' + action);
  console.log('target is : ' + hash);

	if (action == 'bdel') {
    makeAlert('Are you sure you want to delete ' + $('.' + hash + ' .title').html() + '?','alert');
    } else if (action == 'bdet') {
      makeModal(element);
    } else if (action == 'bcol') {
      console.log(element);
    } else if (action == 'brfc') {
    var collection = element.attr('class').split(' ')[3];
    makeAlert('Are you sure you want to delete ' + $('.' + hash + ' .title').html() + ' from ' + $('.redirect.' + collection).html() + '?','alert');
    } else {
      console.log('no idea...')
    }
  }

  //a function to create an alert box element and add to the DOM
  function makeAlert(text,status) {
    if($('.alert-box').length != 0) {
      $('.alert-box').remove();
    }
  	var alert = '<div data-alert class="alert-box ' + status + '"><span class="content">' + text + '</span><a href="#" class="close">&times;</a></div>';
  	$(alert).prependTo($('body')).fadeIn('fast');
  }

  //a function to get badge details and display them in a modal
  //display modal to the left,right,or over the list itself depending on circumstances
  function makeModal(element) {

    elemPosition = element.parent().offset().left;
    bodyWidth = $('body').offset().width;

    console.log('element position is : ' + elemPosition);
    console.log('body width is : ' + bodyWidth);

    var parentUL = element.parents('.badge-thumbs');
    var firstli = parentUL.find('li:first-child').find('a').offset();
    var xpos = firstli.left;
    var ypos = firstli.top;
    var firstli_width = firstli.width;
    var width = firstli_width;
    var height = 420;

    if (parentUL.hasClass('square')) {
      width = ((firstli_width * 2) + 20);
      //if there are 4 list items, display modal on the right if item clicked is to the left
      if(calculateLIsInRow(parentUL.children('li')) == 4) {
        if(elemPosition < (bodyWidth / 2)) {
          console.log('this element is on the left');
          xpos = (xpos + width + 20);
        } else {
          console.log('this element is on the right');  
        }
      }   
    } else {
       height = 296;
    }
  
    var details = retrieveBadge(element.attr('class').split(' ')[2]);
    var close = $('<a href="#" class="close">×</a>').click(function(){$('#badge_modal').remove();return false});
    var inner = $('<div style="top:' + ypos + 'px;left:' + xpos + 'px;width:' + width + 'px;height:' + height + 'px;" id="badge_modal_inner"></div>');
    var outer = $('<div id="badge_modal"></div>');

    console.log(outer.append(inner.append(details,close)));
    
    if($('#badge_modal').length != 0) {
      $('#badge_modal').remove();
    }
    outer.appendTo('body').fadeIn('fast');
  }

  //a function to return the number of list items in a row (good for responsive lists)
  function calculateLIsInRow(element) {
    var lisInRow = 0;
    element.each(function() {
        if($(this).prev().length > 0) {
            if($(this).position().top != $(this).prev().position().top) return false;
            lisInRow++;
        }
        else {
            lisInRow++;   
        }
    });
    console.log('No: of lis in a row = ' + lisInRow);
    return lisInRow;
  }

//a function to retrieve full badge details - ideally via Ajax - then format for display
function retrieveBadge(hash) {
  //here is a dummy object
  hash = 'badgehash-a';
  badge=new Object();
  badge.hash=hash;
  badge.name="Some Badge";
  badge.org="Some Organization";
  badge.url_org="some-org.org";
  badge.issue=1346760732;
  badge.expire=1389484800;
  badge.url_criteria="some-org.org/criteria";
  badge.url_evidence="some-org.org/evidence";
  badge.desc="<p>Here is the user's description of the badge.";
  badge.collections='{ "collName":"Collection A" , "collHash":"123" },{ "collName":"Collection B" , "collHash":"456" }';

  var output = '<div class="fullbadge">' +
  '<h3>' + badge.name + '</h3>' +
  '<img src="./img/badge/' + hash + '-l.png">' +
  '<p>Issued by : <br><strong><a class="redirect ' + collection_hash1 + '" href="./badge/by-organization/organizationhash-x.html">' + badge.org + '</a></strong><br>' + badge.url_org + '</p>' +
  '<p>Issued ' + $.timeago(dateFromUnix(badge.issue)) + '.</p>' +
  '<p>Expires ' + $.timeago(dateFromUnix(badge.expire)) + '.</p>' +
  '<p>Description : <br>' + badge.desc + '</p>' +
  '<p>Criteria : <a href="http://' + badge.url_criteria + '" target=_blank>' + badge.url_criteria + '</a></p>' +
  '<p>Evidence : <a href="http://' + badge.url_evidence + '" target=_blank>' + badge.url_evidence + '</a></p>' +
  '</div>';
  return output;
}

function dateFromUnix(timestamp) {
  var date = new Date(timestamp * 1000);
  return date;
}

//a function to retrieve all a users collections containting a specified badge
function getCollectionsByBadge(hash,style) {
  //fetch collection hash and names
  collection_hash1="collectionhash-a";
  collection_hash2="collectionhash-a";
  collection_hash3="collectionhash-a";

  var output = '' +
  '<li class="divider"><hr></li>' +
  '<li><a class="badge_action brfc ' + hash + ' ' + collection_hash1 + '" href="#">x</a><a class="redirect ' + collection_hash1 + '" href="./badge/by-collection/collectionhash-x.html">Collection A</a></li>' +
  '<li><a class="badge_action brfc ' + hash + ' ' + collection_hash2 + '" href="#">x</a><a class="redirect ' + collection_hash2 + '" href="./badge/by-collection/collectionhash-x.html">Collection B</a></li>' +
  '<li><a class="badge_action brfc ' + hash + ' ' + collection_hash3 + '" href="#">x</a><a class="redirect ' + collection_hash3 + '" href="./badge/by-collection/collectionhash-x.html">Collection C</a></li>';
  return output;
}


});