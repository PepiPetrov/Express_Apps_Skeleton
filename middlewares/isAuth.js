module.exports=function(){
    return (req,res,next)=>{
        if(req.cookies.auth!==undefined){
            next()
            return
        }
        res.redirect('/auth/login')
    }
}