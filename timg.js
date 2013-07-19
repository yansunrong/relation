function timg(imgId, max_size, quality) {
	if( typeof max_size == 'undefined'){ max_size='w480'; }
	if( typeof quality == 'undefined'){ quality=60; }
//	if( typeof WEBAPP.unixTime!='undefined' ) { 
//		var sec = WEBAPP.unixSec; 
//	}else{
//		var sec = parseInt(new Date().getTime()/1000,10);
//	}

	//var host_thumbnail = 'http://tc-wise-rdtf06.tc.baidu.com:8138',
	var host_thumbnail = 'http://timg.baidu.com',
		product_name = 'wapbaike',
//		key_img = 'wisetimgkey', //有过期验证
		key_img = 'wisetimgkey_noexpire_3f60e7362b8c23871c7564327a31d9d7', //无过期验证
		pic_url = 'http://imgsrc.baidu.com/baike/pic/item/' + imgId + '.jpg',
		sec = 1353768339; //任意固定时间
		code = key_img+sec+pic_url,
		di = hex_md5(code);

		return host_thumbnail+"/timg?"+product_name+"&quality="+quality+"&size="+max_size+"&sec="+sec+"&di="+di+"&src="+pic_url;

}
