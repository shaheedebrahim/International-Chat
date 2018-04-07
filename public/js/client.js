	// ========= //
	// Variables //
	// ========= // ===========================================
$(function() {
	// Screens / Containers
	var initialLogin = $('#initialLogin');
	var loginScreen = $('#loginScreen');
	var createAccount_SignUp = $('#createAccount_SignUp');
	var createAccount_Language = $('#createAccount_Language');
	var createAccount_Profile = $('#createAccount_Profile');
	var pwRequirements = $('#pswd_info');
	
	// Buttons / Clickables
	var gotIt_Button = $('#gotIt_Button');
	var login_Button = $('#login_Button');
	var createAccount_Button = $('#createAcc');
	var close = $('.close');
	var next_SignUp = $('#next_SignUp');
	var next_Language = $('#next_Language');
	var back_Language = $('#back_Language');
	var back_Profile = $('#back_Profile');
	var finish_Profile = $('#finish_Profile');
	
	// Others
	var pw1 = $('#pw1');
	var pw2= $('#pw2');
	var pwReqs = [0, 0, 0, 0, 0];
	var createAccount_Form = $('#createAccount_Form');

	var socket = io();
	

	// ========================================================
    
	
	// =========== //
	// Initial Run //
	// =========== // =========================================
	
	$(function (){
        		
		// Hide all pages except home
		hideAll();
			
		
    });
	
	// ========= //
	// Functions //
	// ========= // ===========================================
	
	// Got it button-click
	gotIt_Button.click(function(e){
		e.preventDefault();
		initialLogin.hide();
		loginScreen.show();
	});
	
	// Log in button-click
	$('#login_Button').click(function(e){
		e.preventDefault();
		initialLogin.hide();
		loginScreen.show();
	});
	
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
	});
	
	// Next_Signup CreateAccount button-click
	next_SignUp.click(function(e){
		
		// check if all the forms are filled
		var empty = $(this).parent().find("input").filter(function() {
            return this.value === "";
		});



		// Check if all the pw req conditions are met
		var pwReqCompleted = JSON.stringify(pwReqs) === '[1,1,1,1,1]';
		
		// continue to Next if it's a valid user info
		if(!empty.length && pwReqCompleted) {
			
			createAccount_SignUp.hide();
			createAccount_Language.show();		
		}

	});
	
	// NO LONGER NEEDED 
	///////////////////////////////////
	/* function accountRequirementsComplete(){
		
		var empty = $(next_SignUp).parent().find("input").filter(function() {
            return next_SignUp.value === "";
        });
		
		var pwReqCompleted = JSON.stringify(pwReqs) === '[1,1,1,1,1]';
		// var pwMatch = pw1.value === pw2.value;
		
		if(!empty.length && pwReqCompleted) {
			return true;	
		} else {
			return false;
		}
	}	 */
	///////////////////////////////////
	
	
	
	
	
	// Next_Language CreateAccount button-click
	next_Language.click(function(e){
	
		if($('#languageCheckboxes input:checked').length > 0){
	
			e.preventDefault();
			createAccount_Language.hide();	
			createAccount_Profile.show();
		}
	});
	
	
	
	// Back_Language CreateAccount button-click
	back_Language.click(function(e){
		e.preventDefault();
		createAccount_SignUp.show();
		createAccount_Language.hide();	
	});
	
	
	// Finish_Profile CreateAccount button-click
	finish_Profile.click(function(e){
	
		if(true){
	
			e.preventDefault();
			createAccount_Profile.hide();	
			$('#loginScreen').css("filter", "none");
			alert("Account created");
			// redirect
			//createAccount_Profile.show();
		}
	});
	
	
	
	// Back_Profile CreateAccount button-click
	back_Profile.click(function(e){
		e.preventDefault();
		createAccount_Profile.hide();
		createAccount_Language.show();		
	});	

	// ========================================================
	
	
	
	
    // Bring out the home screen
    function hideAll(){
		loginScreen.hide();
		createAccount_SignUp.hide();
		createAccount_Language.hide();
		createAccount_Profile.hide();
	};
	

	/* PW Requirements */
	// While typing and on focus (click)
	// Avoids wrong solely on click as well
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
	
	$("#login_Button").click(function(e){
		var usernameVal = $("#loginUsername").val();
		var passwordVal = $("#loginPassword").val();
		socket.emit("loginClicked", {username: usernameVal, password: passwordVal});
	});
	
	// $.validator.setDefaults( {
			// submitHandler: function () {
				// if (accountRequirementsComplete() === true){
					// createAccount_SignUp.hide();
					// createAccount_Language.show();		
				// }
			// }
	// });
	
	
	// Just in case:
	/* submitHandler: function(form) {
			// def action
		}, */
	
	createAccount_Form.validate( {		
		submitHandler: function(form) {
			createAccount_SignUp.hide();
			createAccount_Language.show();
			
			var usernameVal = $("#username").val();
			var passwordVal = $("#pw1").val();
			console.log(usernameVal);
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
});
