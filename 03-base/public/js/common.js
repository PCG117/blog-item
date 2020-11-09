; (function ($) {

    var $registerWrap = $('#register-wrap')
    var $loginWrap = $('#login-wrap')


    $('#goto-register').on('click',function(){
        $loginWrap.hide()
        $registerWrap.show()
    })

    $('#goto-login').on('click',function(){
        $registerWrap.hide()
        $loginWrap.show()
    })

    var userNameReg = /^[a-z][a-z0-9_]{2,5}$/

    var passwordReg = /^\w{3,6}$/

    $('#sub-register').on('click',function(){
 
        var inputUsername = $('#regInputUsername').val()
        var inputPassword = $('#regInputPassword').val()
        var inputRepPassword = $('#regInputRepPassword').val()
        var $err = $registerWrap.find('.text-danger')

        var errMsg = ''
        if (!userNameReg.test(inputUsername)){
            errMsg = '以英文字符开头,总共3-6个字符包括数字英文和下划线'
        } else if (!passwordReg.test(inputPassword)){
            errMsg = '密码为3-6个任意字符'
        } else if (inputPassword != inputRepPassword){
            errMsg = '两次密码输入不一致'
        }

        if (errMsg) {
            $err.html(errMsg)
            return false
        }
        $err.html('')

        $.ajax({
            url:'/users/register',
            type:'POST',
            dataType:'json',
            data:{
                username: inputUsername,
                password: inputPassword
            },
            success:function(result){
                if(result.code == 0){
                    $('#goto-login').trigger('click')
                }else{
                    $err.html(result.message)
                }
            },
            error:function(){
                $err.html('服务器端错误')
            }
        })
    })

    $('#sub-login').on('click',function(){
 
        var inputUsername = $('#loginInputUsername').val()
        var inputPassword = $('#loginInputPassword').val()
        var $err = $loginWrap.find('.text-danger')

        var errMsg = ''
        if (!userNameReg.test(inputUsername)){
            errMsg = '以英文字符开头,总共3-6个字符包括数字英文和下划线'
        } else if (!passwordReg.test(inputPassword)){
            errMsg = '密码为3-6个任意字符'
        } 

        if (errMsg) {
            $err.html(errMsg)
            return false
        }
        $err.html('')

        $.ajax({
            url:'/users/login',
            type:'POST',
            dataType:'json',
            data:{
                username: inputUsername,
                password: inputPassword
            },
            success:function(result){
                if(result.code == 0){
                   window.location.reload()
                }else{
                    $err.html(result.message)
                }
            },
            error:function(){
                $err.html('服务器端错误')
            }
        })
    })
})(jQuery)