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
    function buildArticleHtml(docs){
        console.log(docs);
        var html=''
        for(var i=0,len=docs.length;i<len;i++){
            html += `<div class="panel panel-default custom-panel article-panel">
            <div class="panel-heading">
                <a href="/detail/${docs[i]._id}">
                    <h3 class="panel-title">${docs[i].title}</h3>
                </a>
            </div>
            <div class="panel-body">${docs[i].intro}</div>
            <div class="panel-footer">
                <span class="glyphicon glyphicon-user" aria-hidden="true"></span>
                <span class="footer-text text-muted">${docs[i].user.username}</span>
                <span class="glyphicon glyphicon-th-list" aria-hidden="true"></span>
                <span class="footer-text text-muted">${docs[i].category.name}</span>
                <span class="glyphicon glyphicon-time" aria-hidden="true"></span>
                <span class="footer-text text-muted">${docs[i].createdTime}</span>
                <span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
                <span class="footer-text text-muted"><span class="view-num">${docs[i].click}</span>已阅读</span>
            </div>
        </div>`
        }
        return html
    }
    function buildPaginationHtml(list,page,pages){
        var html=''
        if(page==1){
            html+=`<li class="disabled">`
        }else{
            html+=`<li>`
        }
        html+=`   <a href="javascript:;" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>`
        for(var i=0,len=list.length;i<len;i++){
            if(list[i]==page){
                html+= `<li class="active">`
            }else{
                html += `<li>`
            }
            html += `<a href="javascript:;">${list[i]}</a></li>`
        }
        if(page == pages){
            html += `<li class="disabled">`
        }else{
            html += `<li>`
        }
        html += `   <a href="javascript:;" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>`  
        return html;
    }
    var $articlePage=$('#article-page')
    $articlePage.on('get-data',function(ev,data){
        var articleHtml=buildArticleHtml(data.docs)
        $('#article-wrap').html(articleHtml)
        if(data.pages<=1){
            $articlePage.html('')
        }else{
            var paginationHtml=buildPaginationHtml(data.list,data.page,data.pages)
            $articlePage.find('.pagination').html(paginationHtml)
        }
    })
    
    $articlePage.pagination({
        url:'/articlesList'
    })
})(jQuery)