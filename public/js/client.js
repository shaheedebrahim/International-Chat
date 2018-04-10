$(function() {
	
	/* ======= *\
	| VARIABLES | ==============================================
	\* ======= */
	
	// Screens / Containers
	var initialLogin = $('#initialLogin');
	var loginScreen = $('#loginScreen');
	var createAccount_SignUp = $('#createAccount_SignUp');
	var createAccount_Language = $('#createAccount_Language');
	var createAccount_Profile = $('#createAccount_Profile');
	var createAccount_PickImage = $('#createAccount_PickImage');
	var pwRequirements = $('#pswd_info');
	var dashboard = $('#dashboard');
	var loadingScreen = $('#loadingScreen');
	var createGroup = $('#createGroup');
	var joinGroup = $('#joinGroup');
	var selectLanguage = $('#selectLanguage');
	var selectDefaultRoom = $('#selectDefaultRoom');

	// Buttons / Clickables
	var gotIt_Button = $('#gotIt_Button');
	var login_Button = $('#login_Button');
	var createAccount_Button = $('#createAcc');
	var close = $('.close');
	var closeToDash = $('.closeToDash');
	var next_SignUp = $('#next_SignUp');
	var back_Language = $('#back_Language');
	var next_Language = $('#next_Language');
	var back_Profile = $('#back_Profile');
	var finish_Profile = $('#finish_Profile');
	var change_ProfileImage = $('#change_ProfileImage');
	var save_DisplayName = $('#save_DisplayName');
	var cancel_ImagePicker = $('#cancel_ImagePicker');
	var done_ImagePicker = $('#done_ImagePicker');
	var finishDefaultRoom = $('#finishDefaultRoom');

	// Dashboard Buttons
	var select_chatroom = $('#select_chatroom');
	var create_group = $('#create_group');
	var join_group = $('#join_group');
	var match_language = $('#match_language');
	var profile_settings = $('#profile_settings');
	var known_languages = $('#known_languages');
	var translation_language = $('#translation_language');
	var finishCreateGroup = $('#finishCreateGroup');
	var finishJoinGroup = $('#finishJoinGroup');
	var finishMatchLanguage = $('#finishMatchLanguage');

	// Others
	var pw1 = $('#pw1');
	var pw2 = $('#pw2');
	var createAccount_Form = $('#createAccount_Form');
		// each index refers to one of the pw requirements 
		// -> [1: T, 0: F]
		var pwReqs = [0, 0, 0, 0, 0];
		// Picked profile image #, 0: default
		var pickedImage = 0;
	var userId = 0;
	var username = "";
	var socket = io();


	// =========================================================

	
	
	
	/* ======= *\
	| FUNCTIONS | 
	\* ======= */

	// Got it button-click
	gotIt_Button.click(function(e){
		e.preventDefault();
		initialLogin.hide();
		loginScreen.show();
	});

	// Log in button-click
	$('#login_Button').click(function(e){
		e.preventDefault();
		var usernameVal = $("#loginUsername").val();
		var passwordVal = $("#loginPassword").val();
		socket.emit("loginClicked", {username: usernameVal, password: passwordVal});
	});

	
	
	
	// -------------------------------- //
	// ------ Dashboard BUTTONs ------- //
	// -------------------------------- //
	
	// Select chatroom
	$('#select_chatroom').click(function(e){
		dashboard.css("filter", "blur(5px)");
		selectDefaultRoom.show();
	});

	// Finish default room selection
	$('#finishDefaultRoom').click(function(e){
		selectDefaultRoom.hide();
		var selected = [];
		
		// https://stackoverflow.com/questions/2155622/get-a-list-of-checked-checkboxes-in-a-div-using-jquery
		$('#roomCheckboxes input:checked').each(function() {
			selected.push($(this).attr('data-id'));
		});

		socket.emit("requestDefaultRoom", selected);
	});

	socket.on('joinRoomSuccess', function(msg){
		console.log(msg);
		$('body').load('chat.html', null, function(){
			$('#roomName').text(msg['roomName']);
			$('#userNick').text(msg['username']);
		});
	});

	// Join group
	$('#join_group').click(function(e){
		dashboard.css("filter", "blur(5px)");
		joinGroup.show();
	});

	// Finish join group
	$('#finishJoinGroup').click(function(e){
		var groupCode = $('#groupCode_Input').val();	
		socket.emit('joinGroup', {user:userId, groupCode:groupCode});
	});

	// Create group
	$('#create_group').click(function(e){
		dashboard.css("filter", "blur(5px)");
		createGroup.show();
		//$('#finishCreateGroupError').hide();
	});

	// Finish creating group
	$('#finishCreateGroup').click(function(e){
		var groupName = $('#groupName').val();
		//console.log("groupname " + groupName);
		socket.emit('createGroup',{chatRoomName:groupName, user:userId} );
		createGroup.hide();
		loadingScreen.show();
		//dashboard.show();	
			
	});

	// Match language
	$('#match_language').click(function(e){
		dashboard.css("filter", "blur(5px)");
		selectLanguage.show();
	});

	// Finish join group
	$('#finishMatchLanguage').click(function(e){
		selectLanguage.hide();
		loadingScreen.show();
	});

	// Exit button-click to Dashboard
	closeToDash.click(function(e){
		e.preventDefault();
		$(this).data('clicked', true);
		$('#dashboard').css("filter", "none");
		createGroup.hide();
		joinGroup.hide();
		selectLanguage.hide();
		loadingScreen.hide();
	});

	
	
	
	// ------------------------------- //
	// ------ Socket FUNCTIONs ------- //
	// ------------------------------- //
	
	socket.on("allowLogin",function(msg){
		loginScreen.hide();
		loginScreen.css("filter", "blur(5px)");
		dashboard.show();
		userId = msg['id'];
		username = msg['username'];
		$(".col, .loginHeader").text("Welcome "+username+"!");
		//window.location="../chat.html";
	});

	socket.on("accountNotFound", function(){
		$("#loginErrorField").text("Account Not Found! Check if caps lock is on");
	});
	socket.on('createGroup', function(msg){
		if (msg!=1){	
			$('#finishCreateGroupError').show();
		}
		createGroup.hide();
		loadingScreen.show();
		dashboard.show();
	});
	socket.on('joinGroup', function(msg){
		joinGroup.hide();
		$('body').load('chat.html', null, function(){
			$('#roomName').text(msg['roomName']);
			$('#userNick').text(msg['username']);
		});
	});


	
	// ------------------------------------- //
	// ------ Create Account BUTTONs ------- //
	// ------------------------------------- //
	
	// Create account hypertext-click
	createAccount_Button.click(function(e){
		e.preventDefault();
		loginScreen.css("filter", "blur(5px)");
		createAccount_SignUp.show();
	});

	// Exit button-click
	close.click(function(e){
		e.preventDefault();
		$(this).data('clicked', true);
		$('#loginScreen').css("filter", "none");
		createAccount_SignUp.hide();
		createAccount_Language.hide();
		createAccount_Profile.hide();
		createAccount_PickImage.hide();
	});

	// Next_Signup CreateAccount button-click
	next_SignUp.click(function(e){

		// Check if all the forms are filled
		var empty = $(this).parent().find("input").filter(function() {
            return this.value === "";
		});

		// Check if all the pw req conditions are met
		var pwReqCompleted = JSON.stringify(pwReqs) === '[1,1,1,1,1]';

		// continue to Next if it's a valid user info
		// Note: this condition must exist both in the button click
		// and when checking the user-input to avoid refreshes 
		// -> don't want to be using e.preventDefault() due to js validate
		if(!empty.length && pwReqCompleted) {
			createAccount_SignUp.hide();
			createAccount_Language.show();
		}
	});

	// Back_Language CreateAccount button-click
	back_Language.click(function(e){
		e.preventDefault();
		createAccount_SignUp.show();
		createAccount_Language.hide();
	});
	
	// Next_Language CreateAccount button-click
	next_Language.click(function(e){

		/* IN CASE COPY
		if($('#languageCheckboxes input:checked').length > 0){

			
			var selected = [];
			// https://stackoverflow.com/questions/2155622/get-a-list-of-checked-checkboxes-in-a-div-using-jquery
			$('#languageCheckboxes input:checked').each(function() {
				selected.push($(this).attr('name'));
			});

			var username = $('#username').val();
			socket.emit("selectedLanguages", {languages:selected, username:username});

			console.log(selected);
			e.preventDefault();
			createAccount_Language.hide();
			createAccount_Profile.show(); 
		*/
			
	
			
		if($('#languageCheckboxes input:checked').length > 0){			
			
			// Get the selected languages and push them into selected
			var selected = [];
			//https://stackoverflow.com/questions/2155622/get-a-list-of-checked-checkboxes-in-a-div-using-jquery
			$('#languageCheckboxes input:checked').each(function() {
				selected.push($(this).attr('name'));
			});
			
			// Let the server know about what languages user selected
			var username = $('#username').val();
			socket.emit("selectedLanguages", {languages:selected, username:username});
			
			// Move to the next page
			e.preventDefault();
			createAccount_Language.hide();	
			createAccount_Profile.show();
		} else {
			// Initial click error
			errorCheckbox.innerHTML = ("Please select at least 1!");
		}

	});
	
	// Error message check for language selected validation 
	// -> Through checkboxes
	$("#languageCheckboxes :input").change(function() {
		if(this.checked) {
			errorCheckbox.innerHTML = ("");
		} else if(!this.checked && $('#languageCheckboxes input:checked').length == 0) {
			// Checkbox clear error, not same as the one above
			errorCheckbox.innerHTML = ("Please select at least 1!");
		}
	});

	// Back_Profile CreateAccount button-click
	back_Profile.click(function(e){
		e.preventDefault();
		createAccount_Profile.hide();
		createAccount_Language.show();
	});
	
	// Change_ProfileImage CreateAccount button-click
	change_ProfileImage.click(function(e){
		e.preventDefault();
		createAccount_Profile.hide();
		createAccount_PickImage.show();		
	});	
	
	// Save_DisplayName CreateAccount button-click
	save_DisplayName.click(function(e){
		e.preventDefault();
		
		// Save user display name, let the server know
		
		// --->>>>
		
		
	});	

	// Finish_Profile CreateAccount button-click
	finish_Profile.click(function(e){
		e.preventDefault();
		createAccount_Profile.hide();
		$('#loginScreen').css("filter", "none");
		alert("Account created");
			
		// Redirect user ??
		
		
	});

	// Cancel_ProfileImage CreateAccount button-click
	cancel_ImagePicker.click(function(e){
		e.preventDefault();
		createAccount_PickImage.hide();		
		createAccount_Profile.show();
	});	
	
	
	// Done_ProfileImage CreateAccount button-click
	done_ImagePicker.click(function(e){
		e.preventDefault();
		createAccount_PickImage.hide();		
		createAccount_Profile.show();	
		// Retrieve the image using the picked image number
		var changedImage = "profileImages/p" + pickedImage + ".png";
		// Set the user profile image to the selected one
		$("#defaultImage").attr("src",changedImage);	
	});	

	// Functionality behind the feedback on profile image click(pick)/hover
	$("#imagePicker :button").click(function() {
		
		// Get the number of the selected image using the ID
		var selectedImage = parseInt(this.id.toString().match(/\d+/)[0]);
		
		// Indicate selected image if nothing else is selected
		if (pickedImage == 0){
			$(this).find("img").css({"border": "4px solid green"});
			pickedImage = selectedImage;
		// Remove indication if de-selected (same image clicked again)
		} else if (pickedImage == selectedImage) {
			$(this).find("img").css({"border": "none"});
			pickedImage = 0;
		// Remove previous indication if another image is selected
		} else if (pickedImage != selectedImage) {			
			$("#imagePicker :button").find("img").css({"border": "none"});
			$(this).find("img").css({"border": "4px solid green"});
			pickedImage = selectedImage;
		}			
	});
	

	// ========================================================




	/* PW Requirements */
	// While typing and on focus (click)
	// Avoids wrong req info for pw1 and pw2
	// -> Eg: if the confirmation pw area is selected
	// -> it shows the pw req for that box based on click
	// -> and not only keyup function (typing)
	$('#pw1, #pw2').keyup(function(){
		validatePassword(this);
	}).focus(function() {
		//placeReq(); //$('#pswd_info').show();
		pwRequirements.show();
		validatePassword(this);
	}).blur(function() {
		$('#pswd_info').hide();
		if(close.data('clicked')) {
			close.click(function(e){
				$(this).data('clicked', true);
				$('#loginScreen').css("filter", "none");
				createAccount_SignUp.hide();
			});
		}

	});


    // Get PW Reqs
	function validatePassword(pwBox){
		var pswd = $(pwBox).val();

		//validate the length
		if ( pswd.length >= 8 ) {
			pwReqs[0] = 1;
			$('#length').removeClass('invalid').addClass('valid');
		} else {
			pwReqs[0] = 0;
			$('#length').removeClass('valid').addClass('invalid');
		}

		//validate letter
		if ( pswd.match(/[A-z]/) ) {
			pwReqs[1] = 1;
			$('#letter').removeClass('invalid').addClass('valid');
		} else {
			pwReqs[1] = 0;
			$('#letter').removeClass('valid').addClass('invalid');
		}

		//validate capital letter
		if ( pswd.match(/[A-Z]/) ) {
			pwReqs[2] = 1;
			$('#capital').removeClass('invalid').addClass('valid');
		} else {
			pwReqs[2] = 0;
			$('#capital').removeClass('valid').addClass('invalid');
		}

		//validate number
		if ( pswd.match(/\d/) ) {
			pwReqs[3] = 1;
			$('#number').removeClass('invalid').addClass('valid');
		} else {
			pwReqs[3] = 0;
			$('#number').removeClass('valid').addClass('invalid');
		}

		//validate space
		if ( pswd.match(/[^a-zA-Z0-9\-\/]/) ) {
			pwReqs[4] = 1;
			$('#space').removeClass('invalid').addClass('valid');
		} else {
			pwReqs[4] = 0;
			$('#space').removeClass('valid').addClass('invalid');
		}
	}

	// Place the pw req screen on the right coordinates
    function placeReq() {
        var position = pw1.position();
        var position2 = pw2.position();

        console.log(position.left);
        console.log(position.top);
        console.log(position);

        pwRequirements.style.position = "absolute";
        pwRequirements.style.top = position.top + 370 + 'px';
        pwRequirements.style.left = position.left + 300 + 'px';
        // pwRequirements.style.display = "inline";
        pwRequirements.show();
	};



	socket.on("createAccountSuccess", function(){
		createAccount_SignUp.hide();
		createAccount_Language.show();
	});

	socket.on("usernameNotUnique", function(){
		$("#username-error").text("Your username is not unique please try again");
		$("#username-error").css('color', '#FF0000');
	});

	// Validation rules for creating an account 
	// JS Validate framework
	createAccount_Form.validate( {
		submitHandler: function(form) {
			var usernameVal = $("#username").val();
			var passwordVal = $("#pw1").val();
			socket.emit('createAccount', {username: usernameVal, password: passwordVal});
		},
		rules: {
			email: {
				required: true,
				email: true
			},
			username: {
				required: true,
				minlength: 7
			},
			pw1: {
				required: true,
				minlength: 8
			},
			pw2: {
				required: true,
				minlength: 8,
				equalTo: "#pw1"
			}
		},
		messages: {
			email: "Please enter a valid email address",
			username: {
				required: "Please enter a username",
				minlength: "Your username must consist of at least 7 characters long"
			},
			pw1: {
				required: "Please provide a password",
				minlength: "Your password must be at least 8 characters long --Will add more rules --"
			},
			pw2: {
				required: "Please provide a password",
				equalTo: "Please enter the same password as above"
			}
		},
		errorElement: "em",
		errorPlacement: function ( error, element ) {
			// Add the `help-block` class to the error element
			error.addClass( "help-block" );

			// Add `has-feedback` class to the parent div.form-group
			// in order to add icons to inputs
			element.parents( ".form-group").addClass( "has-feedback" );

			// error.insertAfter( element.parent( "label" ) );
			error.insertAfter( element.parent("div") );


			// Add the span element, if doesn't exists, and apply the icon classes to it.
			if ( !element.next( "span" )[ 0 ] ) {
				$( "<span class='glyphicon glyphicon-remove form-control-feedback'></span>" ).insertAfter( element );
			}
		},
		success: function ( label, element ) {
			// Add the span element, if doesn't exists, and apply the icon classes to it.
			if ( !$( element ).next( "span" )[ 0 ] ) {
				$( "<span class='glyphicon glyphicon-ok form-control-feedback'></span>" ).insertAfter( $( element ) );
			}
		},
		highlight: function ( element, errorClass, validClass ) {
			$( element ).parents( ".form-group" ).addClass( "has-error" ).removeClass( "has-success" );
			$( element ).next( "span" ).addClass( "glyphicon-remove" ).removeClass( "glyphicon-ok" );
		},
		unhighlight: function ( element, errorClass, validClass ) {
			$( element ).parents( ".form-group" ).addClass( "has-success" ).removeClass( "has-error" );
			$( element ).next( "span" ).addClass( "glyphicon-ok" ).removeClass( "glyphicon-remove" );
		}
	});


	// Select Language check box --> only select one
	$("input:checkbox").on('click', function() {
	var $box = $(this);
	if ($box.is(":checked")) {
		var group = "input:checkbox[name='" + $box.attr("name") + "']";
		$(group).prop("checked", false);
		$box.prop("checked", true);
	} else {
		$box.prop("checked", false);
	}
	});

	// Loading screen --> rotate image

	var loadImage = anime ({
	targets: ['.loader'],
	rotate: 180,
	duration: 1600,
	loop: true,
	elasticity: 600,
	easing: 'easeOutElastic',
	delay: function(el, index) {
		return index * 80;
	},
	});

	/* Chat Functionality */

	var userNickSt=  $('#userNick').value;
    var color= "";
   
    $('form').submit(function(){
        var message = $('#m').val();
        if (message !== undefined){
            var mess_args = message.split(" ");
            if (mess_args.length==2 && mess_args[0]=="/nick")
            {
                socket.emit('nick', mess_args[1]);
            }
            else if (mess_args.length==2 && mess_args[0]=="/nickcolor") {
                console.log("nick color invoked");
                socket.emit('nickcolor', mess_args[1]);
                color = mess_args[1];
            }
            else{
                socket.emit('chat',message );
            }
            $('#m').val('');
        }
    
        return false;
    });
    socket.on('chat', function(msg){
        doChat(msg);
     });
    
    socket.on('wel', function(wel){
        for ( var i=0; i< wel.length;i++)
        {   doChat(wel[i]);   }
    });
    socket.on('userList', function(list){
        $('#userList').empty();
        for ( var i=0; i< list.length;i++)
        {
             $('#userList').prepend($('<li>')
				.append($('<img>').attr("src", "img/bit.png").addClass("profile"))
				.append($('<p>').text(list[i]))
            );
        }
         
    });
    function doChat(msg){
        var time = new Date(msg.time_id);
        var body = msg.body;
        var toPutIn = $('<li>');
        var divMessage = document.createElement("div");
           
        
         if (userNickSt==msg.clientId){
            $(toPutIn).addClass("me");
            $(toPutIn).append($('<img>').attr("src", "img/about.jpg"));
            $(toPutIn).append($('<p>').text(msg.body));   
          }
          else{ 
            $(toPutIn).addClass("you");
           //   $('li div img').attr("src", "../img/bit.png");
            }
         $('#messages').prepend(toPutIn);
        $('#messages').stop().animate({scrollTop:($('#messages')[0].scrollHeight)},500);
    }

});
