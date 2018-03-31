	// ========= //
	// Variables //
	// =======================================================
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

	// =======================================================
    
	
	// ========= //
	// Functions //
	// =======================================================
	// Got it button-click
	gotIt_Button.click(function(e){
		e.preventDefault();
		initialLogin.hide();
		loginScreen.show();
	});
	
	// Log in button-click
	<!-- $('#login_Button').click(function(e){ -->
		<!-- e.preventDefault(); -->
		<!-- initialLogin.hide(); -->
		<!-- loginScreen.show(); -->
	<!-- }); -->
	
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
		
		var empty = $(this).parent().find("input").filter(function() {
            return this.value === "";
        });
		
		var pwReqCompleted = JSON.stringify(pwReqs) === '[1,1,1,1,1]';
		var pwMatch = pw1.value === pw2.value;
		
		if (pw1.value != pw2.value) {
			pw2[0].setCustomValidity('Passwords must match.');
			e.preventDefault();
		} else {
			pw2[0].setCustomValidity('');
		}
		
		console.log(pwReqCompleted);
		if(!empty.length && pwReqCompleted && pwMatch) {
			e.preventDefault();
			createAccount_SignUp.hide();
			createAccount_Language.show();		
		} else {
			return false;
		}
	});
	
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
	
	

	// =======================================================
        /* PW Requirements */

        $('input[type=password]').keyup(function() {
            var pswd = $(this).val();

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

        }).focus(function() {
            //placeReq(); //$('#pswd_info').show();
			pwRequirements.show();
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
	
	// initial-run function
	$(function (){
        		
		// Hide all pages except home
		hideAll();
			
		
    });



    
    function hideAll(){
		loginScreen.hide();
		createAccount_SignUp.hide();
		createAccount_Language.hide();
		createAccount_Profile.hide();
	};


    // Get PW Reqs


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