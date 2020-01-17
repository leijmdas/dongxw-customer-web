// 定义资源接口地址、资源编码、认证服务等
let  OAUTH_SERVER, LOGIN_URL, LOGOUT_URL, RESOURCE_CODE
RESOURCE_CODE = 'erp';
if (process.env.NODE_ENV == 'development') {
  OAUTH_SERVER = 'http://192.168.121.51:8000/'
} else if (process.env.NODE_ENV == 'testing') {
  OAUTH_SERVER = 'http://test.tenfont.com:8000/gw'
}
LOGIN_URL = OAUTH_SERVER + '/oauth/authorize?client_id=' + RESOURCE_CODE + '&response_type=token&redirect_uri=' + window.location.origin+"/"

LOGOUT_URL = OAUTH_SERVER + '/logout?redirect_uri=' + window.location.origin

let Consts ={
    BASE_API:process.env.BASE_API,
    LOGIN_URL:LOGIN_URL,
    LOGOUT_URL:LOGOUT_URL
}


export default Consts